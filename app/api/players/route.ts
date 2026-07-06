import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Player } from "@/lib/models/Player";

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
  let tier = "UNRANKED";
  let rank = "";
  let lp = 0;
  let riotError: string | null = null;

  if (RIOT_API_KEY) {
    try {
      // 1. Riot ID → puuid
      const accountRes = await fetch(
        `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(riotId)}/${encodeURIComponent(tag)}`,
        { headers: { "X-Riot-Token": RIOT_API_KEY } }
      );
      if (!accountRes.ok) {
        const errBody = await accountRes.json().catch(() => ({}));
        riotError = `계정 조회 실패 (${accountRes.status}): ${JSON.stringify(errBody)}`;
      } else {
        const account = await accountRes.json();

        // 2. puuid → summonerId
        const summonerRes = await fetch(
          `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${account.puuid}`,
          { headers: { "X-Riot-Token": RIOT_API_KEY } }
        );
        if (!summonerRes.ok) {
          const errBody = await summonerRes.json().catch(() => ({}));
          riotError = `소환사 조회 실패 (${summonerRes.status}): ${JSON.stringify(errBody)}`;
        } else {
          const summoner = await summonerRes.json();

          // 3. summonerId → rank
          const rankRes = await fetch(
            `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.id}`,
            { headers: { "X-Riot-Token": RIOT_API_KEY } }
          );
          if (!rankRes.ok) {
            const errBody = await rankRes.json().catch(() => ({}));
            riotError = `랭크 조회 실패 (${rankRes.status}): ${JSON.stringify(errBody)}`;
          } else {
            const ranks = await rankRes.json();
            const solo = ranks.find((r: { queueType: string }) => r.queueType === "RANKED_SOLO_5x5");
            if (solo) {
              tier = solo.tier;
              rank = solo.rank;
              lp = solo.leaguePoints;
            } else {
              riotError = "솔로랭크 기록 없음 (언랭)";
            }
          }
        }
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
    tier,
    rank,
    lp,
  });

  return NextResponse.json(
    { ...player.toObject(), _riotError: riotError },
    { status: 201 }
  );
}
