import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Match } from "@/lib/models/Match";
import { Player } from "@/lib/models/Player";

const ELO_K = 32;

function calcEloChange(myElo: number, oppElo: number, won: boolean) {
  const expected = 1 / (1 + Math.pow(10, (oppElo - myElo) / 400));
  return Math.round(ELO_K * ((won ? 1 : 0) - expected));
}

export async function GET() {
  await connectDB();
  const matches = await Match.find().sort({ date: -1 }).limit(50);
  return NextResponse.json(matches);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const { winner, duration, blueTeamName, redTeamName, note, participants, date } = body;

  const blueParticipants = participants.filter((p: { team: string }) => p.team === "blue");
  const redParticipants = participants.filter((p: { team: string }) => p.team === "red");

  const blueAvgElo =
    blueParticipants.reduce((acc: number, p: { elo: number }) => acc + (p.elo || 1000), 0) /
    (blueParticipants.length || 1);
  const redAvgElo =
    redParticipants.reduce((acc: number, p: { elo: number }) => acc + (p.elo || 1000), 0) /
    (redParticipants.length || 1);

  const enriched = participants.map((p: { playerId: string; team: string; elo: number }) => {
    const isWinner = p.team === winner;
    const oppAvgElo = p.team === "blue" ? redAvgElo : blueAvgElo;
    const change = calcEloChange(p.elo || 1000, oppAvgElo, isWinner);
    return { ...p, eloChange: change };
  });

  const match = await Match.create({
    winner,
    duration,
    blueTeamName: blueTeamName || "블루팀",
    redTeamName: redTeamName || "레드팀",
    note: note || "",
    participants: enriched,
    date: date ? new Date(date) : new Date(),
  });

  await Promise.all(
    enriched.map(async (p: { playerId: string; team: string; eloChange: number }) => {
      const won = p.team === winner;
      await Player.findByIdAndUpdate(p.playerId, {
        $inc: {
          elo: p.eloChange,
          wins: won ? 1 : 0,
          losses: won ? 0 : 1,
        },
      });
    })
  );

  return NextResponse.json(match, { status: 201 });
}
