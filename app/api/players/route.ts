import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Player } from "@/lib/models/Player";
import { fetchRiotProfile, type RiotProfile } from "@/lib/fetchRiotProfile";

export async function GET() {
  await connectDB();
  const players = await Player.find().sort({ elo: -1 });
  return NextResponse.json(players);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const { name, riotId, tag, mainPosition } = body;

  if (!name || !riotId || !tag) {
    return NextResponse.json({ error: "필수 항목을 입력해주세요." }, { status: 400 });
  }

  const existing = await Player.findOne({ riotId: riotId.toLowerCase() });
  if (existing) {
    return NextResponse.json({ error: "이미 등록된 플레이어입니다." }, { status: 409 });
  }

  const RIOT_API_KEY = process.env.RIOT_API_KEY;
  let puuid = "";
  let riotError: string | null = null;
  let profile: RiotProfile = { tier: "UNRANKED", rank: "", lp: 0, topChampions: [], recentWins: 0, recentLosses: 0, riotError: null };

  if (RIOT_API_KEY) {
    try {
      const accountRes = await fetch(
        `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(riotId)}/${encodeURIComponent(tag)}`,
        { headers: { "X-Riot-Token": RIOT_API_KEY } }
      );
      if (!accountRes.ok) {
        const errBody = await accountRes.json().catch(() => ({}));
        riotError = `계정 조회 실패 (${accountRes.status}): ${JSON.stringify(errBody)}`;
      } else {
        const account = await accountRes.json();
        puuid = account.puuid;
        profile = await fetchRiotProfile(puuid, RIOT_API_KEY);
        riotError = profile.riotError;
      }
    } catch (e) {
      riotError = `네트워크 오류: ${String(e)}`;
    }
  } else {
    riotError = "RIOT_API_KEY 미설정";
  }

  const player = await Player.create({
    name,
    riotId: riotId.toLowerCase(),
    tag: tag.toLowerCase(),
    mainPosition: mainPosition || "FILL",
    puuid,
    tier: profile.tier,
    rank: profile.rank,
    lp: profile.lp,
    topChampions: profile.topChampions,
    recentWins: profile.recentWins,
    recentLosses: profile.recentLosses,
  });

  return NextResponse.json(
    { ...player.toObject(), _riotError: riotError },
    { status: 201 }
  );
}
