import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

// Hàm GET để lấy tất cả recipes
export async function GET(request: Request) {
  try {
    const { userId } = getAuth(request); // Lấy userId từ yêu cầu

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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// Hàm POST để tạo một recipe mới
export async function POST(request: Request) {
  const data = await request.json(); // Lấy dữ liệu từ request body

  try {
    // Lấy thông tin người dùng từ Clerk
    const { userId } = getAuth(request); // Lấy userId từ yêu cầu

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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
