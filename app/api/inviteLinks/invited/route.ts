import { NextRequest } from "next/server";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import {
  authenticateUser,
  createResponse,
  handleErrorAndRespond,
} from "@/lib/apiUtils"; // Adjust the import according to your file structure

export async function GET(request: NextRequest) {
  try {
    // Authenticate the user and get their ID
    authenticateUser(); // Ensure the user is authenticated

    // Extract userId from query parameters
    const url = new URL(request.url);
    const inviteUserId = url.searchParams.get("userId");

    // Validate the inviteUserId
    if (!inviteUserId) {
      return createResponse({ error: "User ID is required" }, 400);
    }

    // Reference to the inviteLinks collection
    const inviteLinksRef = collection(db, "inviteLinks");

    // Fetch all invite links
    const querySnapshot = await getDocs(inviteLinksRef);

    // Filter the invite links on the client side
    const inviteLinks = querySnapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          recipeId: data.recipeId, // Make sure to include recipeId
          inviteLink: data.inviteLink, // Make sure to include inviteLink
          invitedUsers: data.invitedUsers, // Include invitedUsers if needed
          // Include other properties if needed, e.g. createdAt, createdBy
        };
      })
      .filter((inviteLink) => {
        // Check if the userId is in the invitedUsers array
        return inviteLink.invitedUsers?.some(
          (user: { userId: string; accessRevoked: boolean }) =>
            user.userId === inviteUserId && user.accessRevoked === false,
        );
      });

    // Return the invite links
    return createResponse(inviteLinks, 200);
  } catch (error) {
    // Handle any errors and return a server error response
    return handleErrorAndRespond(error);
  }
}
