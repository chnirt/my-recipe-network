import { NextRequest } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import {
  authenticateUser,
  createResponse,
  handleErrorAndRespond,
} from "@/lib/apiUtils";

// Fetch invite link by inviteLinkId
export async function GET(
  request: NextRequest,
  { params }: { params: { inviteLinkId: string } },
) {
  const { inviteLinkId } = params; // Extract inviteLinkId from the route

  try {
    // Ensure the user is authenticated
    authenticateUser(); // You can modify this to return user info if needed

    // Reference the specific invite link document by inviteLinkId
    const inviteLinkRef = doc(db, "inviteLinks", inviteLinkId);
    const inviteLinkDoc = await getDoc(inviteLinkRef);

    // Check if the document exists
    if (!inviteLinkDoc.exists()) {
      return createResponse({ message: "Invite link not found" }, 404);
    }

    // Return the invite link data
    const inviteLinkData = { id: inviteLinkDoc.id, ...inviteLinkDoc.data() };
    return createResponse(inviteLinkData, 200);
  } catch (error: unknown) {
    return handleErrorAndRespond(error); // Use the utility function for error handling
  }
}
