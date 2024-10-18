import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import {
  authenticateUser,
  createResponse,
  handleErrorAndRespond,
} from "@/lib/apiUtils";

// GET function to retrieve all ingredients for the authenticated user
export async function GET() {
  try {
    // Ensure user is authenticated
    const userId = authenticateUser();

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
    return handleErrorAndRespond(error);
  }
}

// POST function to create a new ingredient
export async function POST(request: Request) {
  const data = await request.json(); // Get data from request body

  try {
    // Ensure user is authenticated
    const userId = authenticateUser();

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
    return handleErrorAndRespond(error);
  }
}
