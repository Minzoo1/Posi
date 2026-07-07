import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Match, IParticipant } from "@/lib/models/Match";
import { Player } from "@/lib/models/Player";
import mongoose from "mongoose";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "잘못된 ID" }, { status: 400 });
  }

  const match = await Match.findById(id).lean();
  if (!match) {
    return NextResponse.json({ error: "경기를 찾을 수 없습니다" }, { status: 404 });
  }

  // reverse ELO and win/loss for each participant
  await Promise.all(
    match.participants.map(async (p: IParticipant) => {
      const won = p.team === match.winner;
      await Player.findByIdAndUpdate(p.playerId, {
        $inc: {
          elo: -(p.eloChange ?? 0),
          wins: won ? -1 : 0,
          losses: won ? 0 : -1,
        },
      });
    })
  );

  await Match.findByIdAndDelete(id);

  return NextResponse.json({ ok: true });
}
