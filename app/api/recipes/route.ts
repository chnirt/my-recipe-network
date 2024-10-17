import { db } from "@/firebase/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  getDoc,
  DocumentData,
  doc,
} from "firebase/firestore";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Recipe } from "@/stores/recipeStore";
import { Ingredient } from "@/stores/ingredientStore";

// Utility function to handle errors
const handleError = (error: unknown) => {
  if (error instanceof Error) {
    return { error: error.message, status: 400 };
  }
  return { error: "An unexpected error occurred.", status: 400 };
};

// Utility function for creating a JSON response
const createResponse = (data: unknown, status: number) => {
  return NextResponse.json(data, { status });
};

// GET function to retrieve all recipes for the authenticated user with optional search
export async function GET(request: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return createResponse({ error: "User not authenticated" }, 401);
    }

    // Get the search parameter from the request URL
    const url = new URL(request.url);
    const searchName = url.searchParams.get("search") || ""; // Default to an empty string if not provided

    // Fetch all recipes created by the user
    const recipesCollectionRef = collection(db, "recipes");
    const recipesQuery = query(
      recipesCollectionRef,
      where("createdBy", "==", userId),
    );
    const snapshot = await getDocs(recipesQuery);

    const recipesWithIngredients: Recipe[] = [];

    for (const recipeDoc of snapshot.docs) {
      const recipeData = { id: recipeDoc.id, ...recipeDoc.data() } as Recipe;

      // Filter recipes by name if searchName is provided
      if (
        searchName === "" ||
        recipeData.name.toLowerCase().includes(searchName.toLowerCase())
      ) {
        const ingredients: Ingredient[] = [];

        for (const ingredient of recipeData.ingredients) {
          if (!ingredient.id) {
            throw new Error(
              `Ingredient ID is missing for recipe ID: ${recipeData.id}`,
            );
          }

          const ingredientRef = doc(db, "ingredients", ingredient.id);
          const ingredientSnapshot = await getDoc(ingredientRef);

          if (!ingredientSnapshot.exists()) {
            throw new Error(`Ingredient not found for ID: ${ingredient.id}`);
          }

          const ingredientData = ingredientSnapshot.data() as DocumentData;
          ingredients.push({
            id: ingredientSnapshot.id,
            name: ingredientData.name,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
          });
        }

        recipesWithIngredients.push({
          ...recipeData,
          ingredients,
        });
      }
    }

    // Sort recipes alphabetically by name (A to Z)
    recipesWithIngredients.sort((a, b) => a.name.localeCompare(b.name));

    return createResponse(recipesWithIngredients, 200);
  } catch (error: unknown) {
    const { error: errorMsg, status } = handleError(error);
    return createResponse({ error: errorMsg }, status);
  }
}

// POST function to create a new recipe
export async function POST(request: Request) {
  const data = await request.json(); // Get data from request body

  try {
    const { userId } = auth();

    if (!userId) {
      return createResponse({ error: "User not authenticated" }, 401);
    }

    const recipesCollectionRef = collection(db, "recipes");
    const newRecipeRef = await addDoc(recipesCollectionRef, {
      name: data.name,
      ingredients: data.ingredients,
      createdBy: userId,
    });

    return createResponse(
      { id: newRecipeRef.id, message: "Recipe created successfully" },
      201,
    );
  } catch (error: unknown) {
    const { error: errorMsg, status } = handleError(error);
    return createResponse({ error: errorMsg }, status);
  }
}
