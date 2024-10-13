import { db } from "@/firebase/firebaseConfig";
import { auth } from "@clerk/nextjs/server";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  doc,
} from "firebase/firestore";
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

// GET function to retrieve all ingredients for the authenticated user
export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return createResponse({ error: "User not authenticated" }, 401);
    }

    const ingredientsCollectionRef = collection(db, "ingredients");
    const ingredientsQuery = query(
      ingredientsCollectionRef,
      where("createdBy", "==", userId),
    );
    const snapshot = await getDocs(ingredientsQuery);
    const ingredients = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return createResponse(ingredients, 200);
  } catch (error: unknown) {
    const { error: errorMsg, status } = handleError(error);
    return createResponse({ error: errorMsg }, status);
  }
}

// POST function to create a new ingredient
export async function POST(request: Request) {
  const data = await request.json(); // Get data from request body

  try {
    const { userId } = auth();

    if (!userId) {
      return createResponse({ error: "User not authenticated" }, 401);
    }

    const ingredientsCollectionRef = collection(db, "ingredients");
    const newIngredientRef = await addDoc(ingredientsCollectionRef, {
      name: data.name,
      createdBy: userId,
    });

    return createResponse(
      { id: newIngredientRef.id, message: "Ingredient created successfully" },
      201,
    );
  } catch (error: unknown) {
    const { error: errorMsg, status } = handleError(error);
    return createResponse({ error: errorMsg }, status);
  }
}
