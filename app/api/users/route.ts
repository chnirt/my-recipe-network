import { db } from "@/firebase/firebaseConfig"; // Firebase setup
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { clerkClient } from "@clerk/nextjs/server"; // Ensure clerkClient is imported
import {
  authenticateUser,
  createResponse,
  handleErrorAndRespond,
} from "@/lib/apiUtils";

// POST function to save user data after login
export async function POST() {
  try {
    // Authenticate user and get userId
    const userId = authenticateUser();

    // Reference to the "users" collection in Firebase
    const userDocRef = doc(collection(db, "users"), userId);

    // Check if the user already exists in the database
    const userSnapshot = await getDoc(userDocRef);

    let userData;

    if (userSnapshot.exists()) {
      // If the user already exists, retrieve the user data
      userData = userSnapshot.data();
    } else {
      // Retrieve user info from Clerk
      const user = await clerkClient().users.getUser(userId);

      // Store the user info in Firebase
      userData = {
        userId: userId,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        avatar: user.imageUrl || "",
        createdAt: new Date().toISOString(),
      };

      await setDoc(userDocRef, userData);
    }

    // Respond with success and user data
    return createResponse(
      { message: "User information stored successfully", user: userData },
      200,
    );
  } catch (error: unknown) {
    // Handle errors
    return handleErrorAndRespond(error);
  }
}

// GET function to fetch users
export async function GET() {
  try {
    // Authenticate user
    authenticateUser();

    // Reference to the "users" collection in Firebase
    const usersCollectionRef = collection(db, "users");

    // Fetch all user documents from Firestore
    const snapshot = await getDocs(usersCollectionRef);

    // Create an array of user
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Respond with success and users
    return createResponse(users, 200);
  } catch (error: unknown) {
    // Handle errors
    return handleErrorAndRespond(error);
  }
}
