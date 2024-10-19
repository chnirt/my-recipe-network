import { NextRequest } from "next/server";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { authenticateUser, createResponse, handleErrorAndRespond } from "@/lib/apiUtils";
import { db } from "@/firebase/firebaseConfig";

export async function PUT(
  request: NextRequest,
  { params }: { params: { inviteLinkId: string } },
) {
  try {
    const userId = authenticateUser(); // Ensure the user is authenticated

    // Reference to the invite link document in Firestore
    const inviteLinkRef = doc(db, "inviteLinks", params.inviteLinkId);

    // Update the document by adding the current user to invitedUsers
    await updateDoc(inviteLinkRef, {
      invitedUsers: arrayUnion({ userId, invited: true, accessRevoked: false }),
    });

    // Return a success response
    return createResponse({ message: "Invite accepted successfully" }, 200);
  } catch (error: unknown) {
    return handleErrorAndRespond(error);
  }
}
