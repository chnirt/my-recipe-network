import { db } from "@/firebase/firebaseConfig";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

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

// GET function to retrieve a recipe by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const recipeRef = doc(db, "recipes", params.id);
    const snapshot = await getDoc(recipeRef);

    if (!snapshot.exists()) {
      return createResponse({ error: "Recipe not found" }, 404);
    }

    return createResponse(snapshot.data(), 200);
  } catch (error: unknown) {
    const { error: errorMsg, status } = handleError(error);
    return createResponse({ error: errorMsg }, status);
  }
}

// PUT function to update a recipe by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const data = await request.json(); // Get data from request body

  try {
    const recipeRef = doc(db, "recipes", params.id);
    await updateDoc(recipeRef, data); // Update recipe in Firestore

    return createResponse(
      { id: params.id, message: "Recipe updated successfully" },
      200,
    );
  } catch (error: unknown) {
    const { error: errorMsg, status } = handleError(error);
    return createResponse({ error: errorMsg }, status);
  }
}

// DELETE function to remove a recipe by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const recipeRef = doc(db, "recipes", params.id);
    await deleteDoc(recipeRef); // Remove recipe from Firestore

    return createResponse({ message: "Recipe deleted successfully" }, 200);
  } catch (error: unknown) {
    const { error: errorMsg, status } = handleError(error);
    return createResponse({ error: errorMsg }, status);
  }
}
