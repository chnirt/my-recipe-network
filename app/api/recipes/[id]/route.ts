import { db } from "@/firebase/firebaseConfig";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import {
  authenticateUser,
  createResponse,
  handleErrorAndRespond,
} from "@/lib/apiUtils";

// GET function to retrieve a recipe by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    // Ensure user is authenticated
    authenticateUser();

    const recipeRef = doc(db, "recipes", params.id);
    const snapshot = await getDoc(recipeRef);

    if (!snapshot.exists()) {
      return createResponse({ error: "Recipe not found" }, 404);
    }

    return createResponse(snapshot.data(), 200);
  } catch (error: unknown) {
    return handleErrorAndRespond(error);
  }
}

// PUT function to update a recipe by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    // Ensure user is authenticated
    authenticateUser();

    const data = await request.json(); // Get data from request body

    const recipeRef = doc(db, "recipes", params.id);
    await updateDoc(recipeRef, data); // Update recipe in Firestore

    return createResponse(
      { id: params.id, message: "Recipe updated successfully" },
      200,
    );
  } catch (error: unknown) {
    return handleErrorAndRespond(error);
  }
}

// DELETE function to remove a recipe by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    // Ensure user is authenticated
    authenticateUser();

    const recipeRef = doc(db, "recipes", params.id);
    await deleteDoc(recipeRef); // Remove recipe from Firestore

    return createResponse({ message: "Recipe deleted successfully" }, 200);
  } catch (error: unknown) {
    return handleErrorAndRespond(error);
  }
}
