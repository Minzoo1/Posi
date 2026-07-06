import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Player } from "@/lib/models/Player";

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  await Player.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const player = await Player.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(player);
}
