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
  let puuid = "";
  let topChampions: { championId: number; championName: string; championKey: string; championLevel: number; championPoints: number }[] = [];
  let recentWins = 0;
  let recentLosses = 0;
  let riotError: string | null = null;

  // DDragon 챔피언 맵 (championId → { name(한국어), key(영문) })
  type ChampEntry = { key: string; name: string };
  let champMap: Map<number, { name: string; key: string }> = new Map();
  try {
    const verRes = await fetch("https://ddragon.leagueoflegends.com/api/versions.json");
    const versions = await verRes.json();
    const version = versions[0];
    const champRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/ko_KR/champion.json`);
    const champData = await champRes.json();
    for (const [engKey, val] of Object.entries(champData.data as Record<string, ChampEntry>)) {
      champMap.set(Number(val.key), { name: val.name, key: engKey });
    }
  } catch { /* DDragon 실패 시 빈 맵으로 진행 */ }

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
        puuid = account.puuid;

        // 2. puuid → rank, mastery, recent matches 병렬 조회
        const [rankRes, masteryRes, matchIdsRes] = await Promise.all([
          fetch(`https://kr.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`, { headers: { "X-Riot-Token": RIOT_API_KEY } }),
          fetch(`https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=3`, { headers: { "X-Riot-Token": RIOT_API_KEY } }),
          fetch(`https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?queue=420&count=20`, { headers: { "X-Riot-Token": RIOT_API_KEY } }),
        ]);

        // 랭크 (솔로 없으면 자유랭크 fallback)
        if (rankRes.ok) {
          const ranks = await rankRes.json();
          const solo = ranks.find((r: { queueType: string }) => r.queueType === "RANKED_SOLO_5x5");
          const flex = ranks.find((r: { queueType: string }) => r.queueType === "RANKED_FLEX_SR");
          if (solo) {
            tier = solo.tier; rank = solo.rank; lp = solo.leaguePoints;
          } else if (flex) {
            tier = flex.tier; rank = flex.rank; lp = flex.leaguePoints;
            riotError = "솔로랭크 없음 — 자유랭크 티어 적용";
          } else {
            riotError = "랭크 기록 없음 (언랭)";
          }
        } else {
          const errBody = await rankRes.json().catch(() => ({}));
          riotError = `랭크 조회 실패 (${rankRes.status}): ${JSON.stringify(errBody)}`;
        }

        // 챔피언 마스터리
        if (masteryRes.ok) {
          const masteries = await masteryRes.json();
          topChampions = masteries.map((m: { championId: number; championLevel: number; championPoints: number }) => {
            const info = champMap.get(m.championId);
            return {
              championId: m.championId,
              championName: info?.name ?? String(m.championId),
              championKey: info?.key ?? String(m.championId),
              championLevel: m.championLevel,
              championPoints: m.championPoints,
            };
          });
        }

        // 최근 솔랭 전적
        if (matchIdsRes.ok) {
          const matchIds: string[] = await matchIdsRes.json();
          const matchDetails = await Promise.all(
            matchIds.slice(0, 20).map((id) =>
              fetch(`https://asia.api.riotgames.com/lol/match/v5/matches/${id}`, { headers: { "X-Riot-Token": RIOT_API_KEY } })
                .then((r) => r.ok ? r.json() : null)
            )
          );
          for (const match of matchDetails) {
            if (!match) continue;
            const participant = match.info?.participants?.find((p: { puuid: string }) => p.puuid === puuid);
            if (participant) {
              if (participant.win) recentWins++; else recentLosses++;
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
    puuid,
    tier,
    rank,
    lp,
    topChampions,
    recentWins,
    recentLosses,
  });

  return NextResponse.json(
    { ...player.toObject(), _riotError: riotError },
    { status: 201 }
  );
}
