export const dynamic = "force-dynamic";

import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Match } from "@/lib/models/Match";
import * as s from "../styles/layout.css";
import * as c from "../styles/components.css";
import * as m from "./matches.css";

async function getMatches() {
  await connectDB();
  return Match.find().sort({ date: -1 }).lean();
}

export default async function MatchesPage() {
  const matches = await getMatches();

  return (
    <div>
      <div className={m.headerRow}>
        <div className={s.pageHeader}>
          <h1 className={s.pageTitle}>경기 기록</h1>
          <p className={s.pageSubtitle}>총 {matches.length}경기</p>
        </div>
        <Link href="/matches/new">
          <button className={`${c.btn} ${c.btnPrimary}`}>경기 입력</button>
        </Link>
      </div>

      <div className={s.card}>
        {matches.length === 0 ? (
          <div className={m.emptyState}>
            <p className={m.emptyText}>아직 경기 기록이 없습니다</p>
            <Link href="/matches/new">
              <button className={`${c.btn} ${c.btnPrimary}`}>첫 경기 입력하기</button>
            </Link>
          </div>
        ) : (
          <div className={m.matchList}>
            {matches.map((match) => {
              const date = new Date(match.date).toLocaleDateString("ko-KR", {
                year: "numeric", month: "long", day: "numeric",
              });
              const mins = Math.floor(match.duration / 60);
              const secs = match.duration % 60;
              const blueParticipants = match.participants.filter((p: { team: string }) => p.team === "blue");
              const redParticipants = match.participants.filter((p: { team: string }) => p.team === "red");

              return (
                <div key={String(match._id)} className={m.matchCard}>
                  <div className={m.matchCardInner}>
                    <div>
                      <div className={m.matchTitle}>
                        <span className={m.blueTeam}>{match.blueTeamName}</span>
                        <span className={m.sep}>vs</span>
                        <span className={m.redTeam}>{match.redTeamName}</span>
                      </div>
                      <div className={m.matchMeta}>
                        {date}
                        {mins > 0 && ` · ${mins}분 ${secs}초`}
                        {match.note && ` · ${match.note}`}
                      </div>
                    </div>
                    <div className={m.matchRight}>
                      <span className={m.vsLabel}>
                        {blueParticipants.length}v{redParticipants.length}
                      </span>
                      <span className={`${c.badge} ${c.badgeVariant[match.winner === "blue" ? "win" : "loss"]} ${m.bigBadge}`}>
                        {match.winner === "blue" ? match.blueTeamName : match.redTeamName} 승리
                      </span>
                    </div>
                  </div>

                  {match.participants.length > 0 && (
                    <div className={m.participantRow}>
                      {(["blue", "red"] as const).map((team) =>
                        match.participants
                          .filter((p: { team: string }) => p.team === team)
                          .map((p: { playerName: string; champion: string }, i: number) => (
                            <span
                              key={`${team}-${i}`}
                              className={`${m.participantChip} ${team === "blue" ? m.blueChip : m.redChip}`}
                            >
                              {p.playerName}{p.champion && ` (${p.champion})`}
                            </span>
                          ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
