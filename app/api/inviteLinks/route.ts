import { NextRequest } from "next/server";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import {
  authenticateUser,
  createResponse,
  handleErrorAndRespond,
} from "@/lib/apiUtils";

export async function POST(request: NextRequest) {
  const data = await request.json();

  try {
    const userId = authenticateUser(); // Ensure user is authenticated

    // Check if an invite link for this recipe already exists
    const inviteLinksCollectionRef = collection(db, "inviteLinks");
    const existingInviteLinkQuery = query(
      inviteLinksCollectionRef,
      where("recipeId", "==", data.recipeId),
    );
    const existingInviteLinkSnapshot = await getDocs(existingInviteLinkQuery);

    if (!existingInviteLinkSnapshot.empty) {
      // If the invite link exists, return the existing invite link ID
      const existingInviteLinkId = existingInviteLinkSnapshot.docs[0].id;
      return createResponse({ inviteLinkId: existingInviteLinkId }, 200);
    }

    // Create a new invite link if it does not exist
    const newInviteLinkRef = await addDoc(inviteLinksCollectionRef, {
      recipeId: data.recipeId,
      invitedUsers: [],
      createdAt: new Date().toISOString(),
      createdBy: userId,
    });

    // Return the newly created inviteLinkId
    return createResponse({ inviteLinkId: newInviteLinkRef.id }, 201);
  } catch (error: unknown) {
    return handleErrorAndRespond(error); // Use the utility function for error handling
  }
}

export async function GET() {
  try {
    const userId = authenticateUser(); // Ensure the user is authenticated

    // Reference to the inviteLinks collection
    const inviteLinksCollectionRef = collection(db, "inviteLinks");

    // Create a query to fetch invite links created by the authenticated user
    const inviteLinksQuery = query(
      inviteLinksCollectionRef,
      where("createdBy", "==", userId),
    );

    // Fetch the invite links
    const inviteLinksSnapshot = await getDocs(inviteLinksQuery);

    // Map the data to an array of invite links
    const inviteLinks = inviteLinksSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Return the invite links data
    return createResponse(inviteLinks, 200);
  } catch (error) {
    return handleErrorAndRespond(error);
  }
}
