import { db } from "@/firebase/firebaseConfig";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

// Hàm GET để lấy thông tin của một recipe theo ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const recipeRef = doc(db, "recipes", params.id);
    const snapshot = await getDoc(recipeRef);
    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }
    return NextResponse.json(snapshot.data(), { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// Hàm PUT để cập nhật thông tin của một recipe theo ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const data = await request.json(); // Lấy dữ liệu từ request body

  try {
    const recipeRef = doc(db, "recipes", params.id);
    await updateDoc(recipeRef, data); // Cập nhật recipe trong Firestore

    return NextResponse.json(
      { id: params.id, message: "Recipe updated successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// Hàm DELETE để xóa một recipe theo ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const recipeRef = doc(db, "recipes", params.id);
    await deleteDoc(recipeRef); // Xóa recipe trong Firestore

    return NextResponse.json(
      { message: "Recipe deleted successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
