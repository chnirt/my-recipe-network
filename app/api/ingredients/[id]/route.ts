import { db } from "@/firebase/firebaseConfig";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import {
  authenticateUser,
  createResponse,
  handleErrorAndRespond,
} from "@/lib/apiUtils";

// GET function to retrieve an ingredient by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    // Ensure user is authenticated
    authenticateUser();

    const ingredientRef = doc(db, "ingredients", params.id);
    const snapshot = await getDoc(ingredientRef);

    if (!snapshot.exists()) {
      return createResponse({ error: "Ingredient not found" }, 404);
    }

    return createResponse(snapshot.data(), 200);
  } catch (error: unknown) {
    return handleErrorAndRespond(error);
  }
}

// PUT function to update an ingredient by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const data = await request.json(); // Get data from request body

  try {
    // Ensure user is authenticated
    authenticateUser();

    const ingredientRef = doc(db, "ingredients", params.id);
    await updateDoc(ingredientRef, data); // Update ingredient in Firestore

    return createResponse(
      { id: params.id, message: "Ingredient updated successfully" },
      200,
    );
  } catch (error: unknown) {
    return handleErrorAndRespond(error);
  }
}

// DELETE function to remove an ingredient by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    // Ensure user is authenticated
    authenticateUser();

    const ingredientRef = doc(db, "ingredients", params.id);
    await deleteDoc(ingredientRef); // Remove ingredient from Firestore

    return createResponse({ message: "Ingredient deleted successfully" }, 200);
  } catch (error: unknown) {
    return handleErrorAndRespond(error);
  }
}
