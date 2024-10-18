import { db } from "@/firebase/firebaseConfig";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import {
  authenticateUser,
  createResponse,
  handleErrorAndRespond,
} from "@/lib/apiUtils";

// GET function to fetch invitations for the authenticated user
export async function GET() {
  try {
    // Ensure user is authenticated
    const userId = authenticateUser();

    const invitationsRef = collection(db, "invitations");
    const invitationsQuery = query(
      invitationsRef,
      where("invitedBy", "==", userId),
    );
    const invitationsSnapshot = await getDocs(invitationsQuery);

    const invitations = invitationsSnapshot.docs.map((doc) => ({
      id: doc.id,
      recipeId: doc.data().recipeId,
      status: doc.data().status,
      createdAt: doc.data().createdAt,
    }));

    return createResponse(invitations, 200);
  } catch (error: unknown) {
    return handleErrorAndRespond(error);
  }
}

// POST function to create an invitation
export async function POST(request: Request) {
  const data = await request.json(); // Get data from request body

  try {
    // Ensure user is authenticated
    const userId = authenticateUser();

    // Input validation: ensure recipeId is provided
    if (!data.recipeId) {
      return createResponse({ error: "Missing recipe ID" }, 400);
    }

    // Check if an invitation for this recipe already exists
    const invitationsCollectionRef = collection(db, "invitations");
    const existingInvitationQuery = query(
      invitationsCollectionRef,
      where("invitedBy", "==", userId),
      where("recipeId", "==", data.recipeId),
    );
    const existingInvitationSnapshot = await getDocs(existingInvitationQuery);

    // If invitation exists, return it
    if (!existingInvitationSnapshot.empty) {
      const existingInvitation = existingInvitationSnapshot.docs[0]; // Assuming there's only one invitation per recipe
      return createResponse(
        { id: existingInvitation.id, message: "Invitation already exists" },
        200,
      );
    }

    // If no invitation exists, create a new one
    const newInviteRef = await addDoc(invitationsCollectionRef, {
      invitedBy: userId,
      recipeId: data.recipeId,
      status: "pending", // Initial status
    });

    return createResponse(
      { id: newInviteRef.id, message: "Invitation sent successfully" },
      201,
    );
  } catch (error: unknown) {
    return handleErrorAndRespond(error);
  }
}
