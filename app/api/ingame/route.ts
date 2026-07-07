import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Player } from "@/lib/models/Player";

export async function GET() {
  await connectDB();
  const RIOT_API_KEY = process.env.RIOT_API_KEY;
  if (!RIOT_API_KEY) return NextResponse.json([]);

  const players = await Player.find({ puuid: { $ne: "" } }).lean();

  const results = await Promise.all(
    players.map(async (p) => {
      try {
        const res = await fetch(
          `https://kr.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/${p.puuid}`,
          { headers: { "X-Riot-Token": RIOT_API_KEY }, next: { revalidate: 0 } }
        );
        if (res.status === 404) return null; // 게임 중 아님
        if (!res.ok) return null;
        const game = await res.json();
        const participant = game.participants?.find((pt: { puuid: string }) => pt.puuid === p.puuid);
        return {
          playerId: String(p._id),
          playerName: p.name,
          champion: participant?.championName ?? "",
          gameMode: game.gameMode ?? "",
          gameLength: game.gameLength ?? 0,
        };
      } catch {
        return null;
      }
    })
  );

  return NextResponse.json(results.filter(Boolean));
}
