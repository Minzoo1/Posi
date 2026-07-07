"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import * as s from "../styles/layout.css";
import * as c from "../styles/components.css";
import * as m from "./matches.css";

interface Participant {
  team: string;
  playerName: string;
  champion: string;
}

interface Match {
  _id: string;
  date: string;
  duration: number;
  winner: "blue" | "red";
  blueTeamName: string;
  redTeamName: string;
  note: string;
  participants: Participant[];
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function fetchMatches() {
    const res = await fetch("/api/matches");
    const data = await res.json();
    setMatches(data);
    setLoading(false);
  }

  useEffect(() => { fetchMatches(); }, []);

  async function handleDelete(id: string) {
    if (!confirm("이 경기를 삭제할까요?\nELO와 승패 기록이 모두 되돌아갑니다.")) return;
    setDeletingId(id);
    await fetch(`/api/matches/${id}`, { method: "DELETE" });
    setDeletingId(null);
    fetchMatches();
  }

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
        {loading ? (
          <div style={{ textAlign: "center", padding: "48px 0" }}><div className={c.spinner} /></div>
        ) : matches.length === 0 ? (
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
              const blueParticipants = match.participants.filter((p) => p.team === "blue");
              const redParticipants = match.participants.filter((p) => p.team === "red");

              return (
                <div key={match._id} className={m.matchCard}>
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
                      <button
                        className={`${c.btn} ${c.btnDanger}`}
                        style={{ fontSize: "12px", padding: "4px 10px" }}
                        onClick={() => handleDelete(match._id)}
                        disabled={deletingId === match._id}
                      >
                        {deletingId === match._id ? "삭제 중..." : "삭제"}
                      </button>
                    </div>
                  </div>

                  {match.participants.length > 0 && (
                    <div className={m.participantRow}>
                      {(["blue", "red"] as const).map((team) =>
                        match.participants
                          .filter((p) => p.team === team)
                          .map((p, i) => (
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
