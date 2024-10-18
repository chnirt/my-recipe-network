import { db } from "@/firebase/firebaseConfig";
import {
  authenticateUser,
  createResponse,
  handleErrorAndRespond,
} from "@/lib/apiUtils";
import { doc, updateDoc, getDoc } from "firebase/firestore";

// PUT function to accept an invitation and add userId to invitedUsers
export async function PUT(
  request: Request,
  { params }: { params: { inviteLinkId: string } },
) {
  try {
    // Ensure user is authenticated
    const userId = authenticateUser(); // Xác thực người dùng

    const data = await request.json(); // Lấy dữ liệu từ body của yêu cầu
    console.log("🚀 ~ data:", data)

    // Reference to the specific invite link document
    const inviteLinkRef = doc(db, "inviteLinks", params.inviteLinkId);

    // Fetch the current invite link data
    const inviteLinkDoc = await getDoc(inviteLinkRef);

    if (!inviteLinkDoc.exists()) {
      return createResponse({ message: "Invite link not found" }, 404);
    }

    // Get existing invitedUsers array
    const inviteLinkData = inviteLinkDoc.data();
    const invitedUsers = inviteLinkData.invitedUsers || [];

    // Check if userId is already invited
    // const userAlreadyInvited = invitedUsers.some(
    //   (user) => user.userId === userId,
    // );

    // if (userAlreadyInvited) {
    //   return createResponse(
    //     { message: "User has already accepted the invitation" },
    //     400,
    //   );
    // }

    // Update invitedUsers array with the new user
    invitedUsers.push({
      userId,
      invited: true,
      accessRevoked: false,
    });

    // Update the invite link document in Firestore
    await updateDoc(inviteLinkRef, {
      invitedUsers: invitedUsers,
    });

    return createResponse(
      { id: params.inviteLinkId, message: "Invitation accepted successfully" },
      200,
    );
  } catch (error: unknown) {
    return handleErrorAndRespond(error);
  }
}
