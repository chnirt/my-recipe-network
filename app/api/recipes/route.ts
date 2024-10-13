import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

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

// GET function to retrieve all recipes for the authenticated user
export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return createResponse({ error: "User not authenticated" }, 401);
    }

    const recipesCollectionRef = collection(db, "recipes");
    const recipesQuery = query(
      recipesCollectionRef,
      where("createdBy", "==", userId),
    );
    const snapshot = await getDocs(recipesQuery);
    const recipes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return createResponse(recipes, 200);
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
