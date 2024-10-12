// /app/api/ingredients/route.ts
import { db } from "@/firebase/firebaseConfig";
import { auth } from "@clerk/nextjs/server";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { NextResponse } from "next/server";

// Hàm GET để lấy tất cả ingredients
export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    const ingredientsCollectionRef = collection(db, "ingredients");
    const ingredientsQuery = query(
      ingredientsCollectionRef,
      where("createdBy", "==", userId),
    );
    const snapshot = await getDocs(ingredientsQuery);
    const ingredients = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(ingredients, { status: 200 });
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

// Hàm POST để tạo một ingredient mới
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

    const ingredientsCollectionRef = collection(db, "ingredients");
    const newIngredientRef = await addDoc(ingredientsCollectionRef, {
      name: data.name,
      createdBy: userId,
    }); // Thêm ingredient mới vào Firestore

    return NextResponse.json(
      { id: newIngredientRef.id, message: "Ingredient created successfully" },
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
