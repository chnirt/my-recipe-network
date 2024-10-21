import { NextRequest, NextResponse } from "next/server";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import {
  authenticateUser,
  createResponse,
  handleErrorAndRespond,
} from "@/lib/apiUtils";

export async function PUT(
  request: NextRequest,
  { params }: { params: { inviteLinkId: string } },
) {
  try {
    // Ensure the user is authenticated
    authenticateUser();

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

    const inviteLinkRef = doc(db, "inviteLinks", params.inviteLinkId);

    // Fetch the current invite link document
    const inviteLinkSnapshot = await getDoc(inviteLinkRef);

    // Check if the invite link exists
    if (!inviteLinkSnapshot.exists()) {
      return NextResponse.json(
        { error: "Invite link not found" },
        { status: 404 },
      );
    }

    const inviteLinkData = inviteLinkSnapshot.data();
    const { invitedUsers } = inviteLinkData || {};

    // Ensure invitedUsers is an array
    if (!Array.isArray(invitedUsers)) {
      return NextResponse.json(
        { error: "Invalid invite link data" },
        { status: 400 },
      );
    }

    // Find the user in the invitedUsers array
    const userToUpdate = invitedUsers.find(
      (user: { userId: string }) => user.userId === targetUserId,
    );

    if (!userToUpdate) {
      return NextResponse.json(
        { error: "Target user not found in invite link" },
        { status: 404 },
      );
    }

    // Update the user's accessRevoked status
    await updateDoc(inviteLinkRef, {
      invitedUsers: invitedUsers.map(
        (user: { userId: string; accessRevoked: boolean }) =>
          user.userId === targetUserId
            ? { ...user, accessRevoked: false }
            : user,
      ),
    });

    // Return a success response
    return createResponse({ message: "Access revoked successfully" }, 200);
  } catch (error: unknown) {
    return handleErrorAndRespond(error);
  }
}
