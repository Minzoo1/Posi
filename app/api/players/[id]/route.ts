import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Player } from "@/lib/models/Player";
import { fetchRiotProfile, getChampMap } from "@/lib/fetchRiotProfile";
import mongoose from "mongoose";

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

export async function PUT(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "잘못된 ID" }, { status: 400 });
  }

  const RIOT_API_KEY = process.env.RIOT_API_KEY;
  if (!RIOT_API_KEY) {
    return NextResponse.json({ error: "RIOT_API_KEY 미설정" }, { status: 500 });
  }

  const player = await Player.findById(id).lean();
  if (!player) {
    return NextResponse.json({ error: "플레이어를 찾을 수 없습니다" }, { status: 404 });
  }
  if (!player.puuid) {
    return NextResponse.json({ error: "puuid 없음 — 멤버 재등록 필요" }, { status: 400 });
  }

  const champMap = await getChampMap();
  const profile = await fetchRiotProfile(player.puuid as string, RIOT_API_KEY, champMap);

  const updated = await Player.findByIdAndUpdate(id, {
    tier: profile.tier,
    rank: profile.rank,
    lp: profile.lp,
    topChampions: profile.topChampions,
    recentWins: profile.recentWins,
    recentLosses: profile.recentLosses,
  }, { new: true });

  return NextResponse.json({ ...updated?.toObject(), _riotError: profile.riotError });
}
