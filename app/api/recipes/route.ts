import { db } from "@/firebase/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  DocumentData,
} from "firebase/firestore";
import { Recipe } from "@/stores/recipeStore";
import { Ingredient } from "@/stores/ingredientStore";
import {
  authenticateUser,
  createResponse,
  handleErrorAndRespond,
} from "@/lib/apiUtils";

type InvitedUser = {
  userId: string;
  accessRevoked: boolean;
};

type InviteLink = {
  invitedUsers: InvitedUser[];
};

function checkAccessForUser(
  inviteLinkData: InviteLink | DocumentData,
  targetUserId: string,
) {
  // Find the user in the invitedUsers array
  const invitedUser = inviteLinkData.invitedUsers.find(
    (user: { userId: string }) => user.userId === targetUserId,
  );

  // Check if the user exists and if access is revoked
  if (!invitedUser) {
    return { access: false, message: "User not found in invited list." };
  } else if (invitedUser.accessRevoked) {
    return { access: false, message: "Access has been revoked for this user." };
  } else {
    return { access: true, message: "Access granted." };
  }
}

// GET function to retrieve all recipes for a specified user or the authenticated user, with optional search
export async function GET(request: Request) {
  try {
    // Ensure the user is authenticated
    const authenticatedUserId = authenticateUser();

    // Get the search parameters from the request URL
    const url = new URL(request.url);
    const searchName = url.searchParams.get("search") || ""; // Default to an empty string if not provided
    const targetUserId = url.searchParams.get("userId") || authenticatedUserId; // Use authenticated user if userId is not provided
    const isOwner = targetUserId === authenticatedUserId;

    // Check if an invite link for this recipe already exists
    const inviteLinksCollectionRef = collection(db, "inviteLinks");
    const inviteLinkQuery = query(
      inviteLinksCollectionRef,
      where("recipeId", "==", targetUserId),
    );

    // Execute the query to fetch the invite links
    const inviteLinkSnapshot = await getDocs(inviteLinkQuery);

    // If no invite link is found, return an access denied response
    if (inviteLinkSnapshot.empty) {
      return createResponse({ message: "No access to this recipe" }, 403);
    }

    if (!isOwner) {
      // Retrieve the first invite link found
      const inviteLink = inviteLinkSnapshot.docs[0].data();

      const result = checkAccessForUser(inviteLink, authenticatedUserId);

      if (!result.access) {
        return createResponse(
          { message: "Access to this recipe has been revoked" },
          403,
        );
      }
    }

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
