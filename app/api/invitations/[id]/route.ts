import { db } from "@/firebase/firebaseConfig";
import {
  authenticateUser,
  createResponse,
  handleErrorAndRespond,
} from "@/lib/apiUtils";
import { doc, deleteDoc, updateDoc, getDoc } from "firebase/firestore";

// PATCH function to respond to an invitation (accept or decline)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    // Ensure user is authenticated
    const userId = authenticateUser();

    // Parse request body to get new status
    const { status } = await request.json();

    // Validate input
    if (!params.id || !["accepted", "declined"].includes(status)) {
      return createResponse({ error: "Invalid request data" }, 400);
    }

    // Fetch the invitation from Firestore
    const invitationDocRef = doc(db, "invitations", params.id);
    const invitationSnapshot = await getDoc(invitationDocRef);

    if (!invitationSnapshot.exists()) {
      return createResponse({ error: "Invitation not found" }, 404);
    }

    const invitationData = invitationSnapshot.data();

    // Ensure the invitation is for the current user
    if (invitationData.invitedBy !== userId) {
      return createResponse({ error: "Permission denied" }, 403);
    }

    // Update the invitation status
    await updateDoc(invitationDocRef, { status });

    // Return success response
    return createResponse(
      { message: `Invitation ${status} successfully` },
      200,
    );
  } catch (error: unknown) {
    return handleErrorAndRespond(error);
  }
}

// DELETE function to remove an invitation
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    // Ensure user is authenticated
    const userId = authenticateUser();

    // Fetch the invitation to check its existence and ownership
    const invitationDocRef = doc(db, "invitations", params.id);
    const invitationSnapshot = await getDoc(invitationDocRef);

    if (!invitationSnapshot.exists()) {
      return createResponse({ error: "Invitation not found" }, 404);
    }

    const invitationData = invitationSnapshot.data();

    // Ensure the invitation belongs to the authenticated user
    if (invitationData.invitedBy !== userId) {
      return createResponse({ error: "Permission denied" }, 403);
    }

    // Remove the invitation from Firestore
    await deleteDoc(invitationDocRef);

    // Return success response
    return createResponse({ message: "Invitation removed successfully" }, 200);
  } catch (error: unknown) {
    return handleErrorAndRespond(error);
  }
}
