import { NextRequest } from "next/server";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import {
  authenticateUser,
  createResponse,
  handleErrorAndRespond,
} from "@/lib/apiUtils";
import { db } from "@/firebase/firebaseConfig";

export async function PUT(
  request: NextRequest,
  { params }: { params: { inviteLinkId: string } },
) {
  try {
    const userId = authenticateUser(); // Ensure the user is authenticated

    // Reference to the invite link document in Firestore
    const inviteLinkRef = doc(db, "inviteLinks", params.inviteLinkId);

    // Get the current data for the invite link
    const inviteLinkSnapshot = await getDoc(inviteLinkRef);

    // Check if invite link document exists
    if (!inviteLinkSnapshot.exists()) {
      return createResponse({ error: "Invite link not found" }, 404);
    }

    // Extract invitedUsers from the snapshot
    const inviteLinkData = inviteLinkSnapshot.data();
    const invitedUsers = inviteLinkData?.invitedUsers || []; // Use optional chaining and default to an empty array

    // Check if the user has previously been revoked
    const existingUser = invitedUsers.find(
      (user: { userId: string }) => user.userId === userId,
    );

    if (existingUser && existingUser.accessRevoked) {
      return createResponse(
        { message: "Access has been revoked for this invite" },
        403,
      );
    }

    // Add or update the user in invitedUsers
    await updateDoc(inviteLinkRef, {
      invitedUsers: arrayUnion({ userId, invited: true, accessRevoked: false }),
    });

    return createResponse({ message: "Invite accepted successfully" }, 200);
  } catch (error: unknown) {
    return handleErrorAndRespond(error);
  }
}
