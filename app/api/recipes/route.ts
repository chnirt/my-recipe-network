import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { Recipe } from "@/stores/recipeStore";
import { Ingredient } from "@/stores/ingredientStore";
import {
  authenticateUser,
  createResponse,
  handleErrorAndRespond,
} from "@/lib/apiUtils";

// GET function to retrieve all recipes for a specified user or the authenticated user, with optional search
export async function GET(request: Request) {
  try {
    // Ensure the user is authenticated
    const authenticatedUserId = authenticateUser();

    // Get the search parameters from the request URL
    const url = new URL(request.url);
    const searchName = url.searchParams.get("search") || ""; // Default to an empty string if not provided
    const targetUserId = url.searchParams.get("userId") || authenticatedUserId; // Use authenticated user if userId is not provided

    // Fetch all recipes created by the target user (specified or authenticated)
    const recipesCollectionRef = collection(db, "recipes");
    const recipesQuery = query(
      recipesCollectionRef,
      where("createdBy", "==", targetUserId),
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

          ingredients.push({
            id: ingredient.id,
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
    return handleErrorAndRespond(error);
  }
}

// POST function to create a new recipe
export async function POST(request: Request) {
  const data = await request.json(); // Get data from request body

  try {
    // Ensure user is authenticated
    const userId = authenticateUser();

    const recipesCollectionRef = collection(db, "recipes");
    const newRecipeRef = await addDoc(recipesCollectionRef, {
      name: data.name,
      note: data.note,
      ingredients: data.ingredients,
      createdBy: userId,
    });

    return createResponse(
      { id: newRecipeRef.id, message: "Recipe created successfully" },
      201,
    );
  } catch (error: unknown) {
    return handleErrorAndRespond(error);
  }
}
