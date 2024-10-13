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

// GET function to retrieve an ingredient by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const ingredientRef = doc(db, "ingredients", params.id);
    const snapshot = await getDoc(ingredientRef);

    if (!snapshot.exists()) {
      return createResponse({ error: "Ingredient not found" }, 404);
    }

    return createResponse(snapshot.data(), 200);
  } catch (error: unknown) {
    const { error: errorMsg, status } = handleError(error);
    return createResponse({ error: errorMsg }, status);
  }
}

// PUT function to update an ingredient by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const data = await request.json(); // Get data from request body

  try {
    const ingredientRef = doc(db, "ingredients", params.id);
    await updateDoc(ingredientRef, data); // Update ingredient in Firestore

    return createResponse(
      { id: params.id, message: "Ingredient updated successfully" },
      200,
    );
  } catch (error: unknown) {
    const { error: errorMsg, status } = handleError(error);
    return createResponse({ error: errorMsg }, status);
  }
}

// DELETE function to remove an ingredient by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const ingredientRef = doc(db, "ingredients", params.id);
    await deleteDoc(ingredientRef); // Remove ingredient from Firestore

    return createResponse({ message: "Ingredient deleted successfully" }, 200);
  } catch (error: unknown) {
    const { error: errorMsg, status } = handleError(error);
    return createResponse({ error: errorMsg }, status);
  }
}
