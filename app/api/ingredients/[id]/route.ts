// /app/api/ingredients/[id]/route.ts
import { db } from "@/firebase/firebaseConfig";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

// Hàm GET để lấy một ingredient dựa trên id
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  try {
    const docRef = doc(db, "ingredients", id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return NextResponse.json(
        { error: "Ingredient not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(snapshot.data(), { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// Hàm PUT để cập nhật một ingredient
export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const data = await request.json();

  try {
    const docRef = doc(db, "ingredients", id);
    await updateDoc(docRef, data);

    return NextResponse.json(
      { message: "Ingredient updated successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// Hàm DELETE để xóa một ingredient
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  try {
    const docRef = doc(db, "ingredients", id);
    await deleteDoc(docRef);

    return NextResponse.json(
      { message: "Ingredient deleted successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
