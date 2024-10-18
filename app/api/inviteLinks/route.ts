import { db } from "@/firebase/firebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import {
  authenticateUser,
  createResponse,
  handleErrorAndRespond,
} from "@/lib/apiUtils";

// POST function to create a new invite link or return existing one
export async function POST(request: Request) {
  const data = await request.json();

  try {
    // Ensure user is authenticated
    const userId = authenticateUser();

    // Check if the invite link already exists
    const inviteLinksCollectionRef = collection(db, "inviteLinks");
    const existingInviteLinkQuery = query(
      inviteLinksCollectionRef,
      where("recipeId", "==", data.recipeId),
      where("inviteLink", "==", data.inviteLink),
    );
    const existingInviteLinkSnapshot = await getDocs(existingInviteLinkQuery);

    if (!existingInviteLinkSnapshot.empty) {
      // If the invite link exists, return it
      const existingInviteLink = existingInviteLinkSnapshot.docs[0].data();
      return createResponse(existingInviteLink.inviteLink, 200);
    }

    // Create a new invite link if it does not exist
    await addDoc(inviteLinksCollectionRef, {
      recipeId: data.recipeId,
      inviteLink: data.inviteLink,
      invitedUsers: [], // Start with an empty invitedUsers array
      createdAt: new Date().toISOString(),
      createdBy: userId, // Optionally store the user who created the invite link
    });

    return createResponse(data.inviteLink, 201); // Return the invite link
  } catch (error: unknown) {
    return handleErrorAndRespond(error);
  }
}

// GET function to retrieve all invite links for the authenticated user
export async function GET(request: Request) {
  console.log("🚀 ~ GET ~ request:", request)
  try {
    const userId = authenticateUser();

    const inviteLinksCollectionRef = collection(db, "inviteLinks");
    const inviteLinksQuery = query(
      inviteLinksCollectionRef,
      where("userId", "==", userId),
    );
    const snapshot = await getDocs(inviteLinksQuery);

    const inviteLinks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return createResponse(inviteLinks, 200);
  } catch (error: unknown) {
    return handleErrorAndRespond(error);
  }
}
