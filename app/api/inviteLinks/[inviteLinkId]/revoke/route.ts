import { NextRequest, NextResponse } from "next/server";
import { doc, updateDoc, arrayRemove, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import {
  authenticateUser,
  createResponse,
  handleErrorAndRespond,
} from "@/lib/apiUtils";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { inviteLinkId: string } },
) {
  try {
    // Ensure the user is authenticated
    const userId = authenticateUser();

    // Extract the target userId from query parameters
    const url = new URL(request.url);
    const targetUserId = url.searchParams.get("userId");

    // Validate the userId
    if (!targetUserId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // Reference to the invite link document in Firestore
    const inviteLinkRef = doc(db, "inviteLinks", params.inviteLinkId);

    // Check if the invite link exists
    const inviteLinkSnapshot = await getDoc(inviteLinkRef);
    if (!inviteLinkSnapshot.exists()) {
      return NextResponse.json(
        { error: "Invite link not found" },
        { status: 404 },
      );
    }

    // Remove the specified userId from the invitedUsers array
    await updateDoc(inviteLinkRef, {
      invitedUsers: arrayRemove({
        userId: targetUserId,
        invited: true,
        accessRevoked: false,
      }),
    });

    // Return a success response
    return createResponse({ message: "Access revoked successfully" }, 200);
  } catch (error: unknown) {
    return handleErrorAndRespond(error);
  }
}
