import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// Hàm GET để lấy tất cả recipes
export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    const recipesCollectionRef = collection(db, "recipes");
    const recipesQuery = query(
      recipesCollectionRef,
      where("createdBy", "==", userId),
    );
    const snapshot = await getDocs(recipesQuery);
    const recipes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(recipes, { status: 200 });
  } catch (error: unknown) {
    // Check if the error is an instance of Error
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Fallback for non-Error types
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 400 },
    );
  }
}

// Hàm POST để tạo một recipe mới
export async function POST(request: Request) {
  const data = await request.json(); // Lấy dữ liệu từ request body

  try {
    // Lấy thông tin người dùng từ Clerk
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    const recipesCollectionRef = collection(db, "recipes");
    const newRecipeRef = await addDoc(recipesCollectionRef, {
      name: data.name,
      ingredients: data.ingredients,
      createdBy: userId,
    });

    return NextResponse.json(
      { id: newRecipeRef.id, message: "Recipe created successfully" },
      { status: 201 },
    );
  } catch (error: unknown) {
    // Check if the error is an instance of Error
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Fallback for non-Error types
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 400 },
    );
  }
}
