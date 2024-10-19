import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import {
  authenticateUser,
  createResponse,
  handleErrorAndRespond,
} from "@/lib/apiUtils";

// GET function to retrieve all ingredients for a specified user or the authenticated user
export async function GET(request: Request) {
  try {
    // Ensure the user is authenticated
    const authenticatedUserId = authenticateUser();

    // Get the target userId from the query parameters, fallback to the authenticated user if not provided
    const url = new URL(request.url);
    const targetUserId = url.searchParams.get("userId") || authenticatedUserId;

    // Fetch all ingredients created by the target user (either specified user or authenticated user)
    const ingredientsCollectionRef = collection(db, "ingredients");
    const ingredientsQuery = query(
      ingredientsCollectionRef,
      where("createdBy", "==", targetUserId),
    );
    const snapshot = await getDocs(ingredientsQuery);

    // Map the ingredients data from the Firestore snapshot
    const ingredients = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Return the list of ingredients as a response
    return createResponse(ingredients, 200);
  } catch (error: unknown) {
    // Handle any errors that occur and respond with the appropriate error message
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
