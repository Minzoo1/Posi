export const dynamic = "force-dynamic";

import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Player } from "@/lib/models/Player";
import { Match } from "@/lib/models/Match";
import * as s from "./styles/layout.css";
import * as c from "./styles/components.css";
import * as d from "./dashboard.css";
import IngameWidget from "./components/IngameWidget";

async function getDDragonVersion(): Promise<string> {
  try {
    const res = await fetch("https://ddragon.leagueoflegends.com/api/versions.json", { next: { revalidate: 86400 } });
    const versions = await res.json();
    return versions[0];
  } catch {
    return "15.1.1";
  }
}

interface StreakPlayer { name: string; streak: number }

function calcStreaks(players: { _id: unknown; name: string }[], allMatches: { winner: string; participants: { playerId: unknown; team: string }[] }[]) {
  const winStreaks: StreakPlayer[] = [];
  const lossStreaks: StreakPlayer[] = [];

  for (const player of players) {
    const pid = String(player._id);
    let streak = 0;
    let streakType: "win" | "loss" | null = null;

    for (const match of allMatches) {
      const pt = match.participants.find((p) => String(p.playerId) === pid);
      if (!pt) continue;
      const won = pt.team === match.winner;
      if (streakType === null) {
        streakType = won ? "win" : "loss";
        streak = 1;
      } else if ((streakType === "win") === won) {
        streak++;
      } else {
        break;
      }
    }

    if (streak >= 3) {
      if (streakType === "win") winStreaks.push({ name: player.name, streak });
      else lossStreaks.push({ name: player.name, streak });
    }
  }

  winStreaks.sort((a, b) => b.streak - a.streak);
  lossStreaks.sort((a, b) => b.streak - a.streak);
  return { winStreaks, lossStreaks };
}

async function getData() {
  try {
    await connectDB();
    const [players, recentMatches, allMatches, ddVersion] = await Promise.all([
      Player.find().sort({ elo: -1 }).lean(),
      Match.find().sort({ date: -1 }).limit(5).lean(),
      Match.find().sort({ date: -1 }).lean(),
      getDDragonVersion(),
    ]);
    const { winStreaks, lossStreaks } = calcStreaks(players, allMatches);
    return { players, matches: recentMatches, ddVersion, winStreaks, lossStreaks };
  } catch {
    return { players: [], matches: [], ddVersion: "15.1.1", winStreaks: [], lossStreaks: [] };
  }
}

export default async function DashboardPage() {
  const { players, matches, winStreaks, lossStreaks } = await getData();
  const topPlayer = players[0];

  return (
    <div>
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>대시보드</h1>
        <p className={s.pageSubtitle}>선한영향력 내전 현황</p>
      </div>

      <IngameWidget />

      <div className={s.grid4} style={{ marginBottom: "24px" }}>
        <div className={c.statCard}>
          <div className={c.statLabel}>총 멤버</div>
          <div className={c.statValue}>{players.length}명</div>
        </div>
        <div className={c.statCard}>
          <div className={c.statLabel}>총 경기</div>
          <div className={c.statValue}>{matches.length}경기</div>
        </div>
        <div className={c.statCard}>
          <div className={c.statLabel}>1위 플레이어</div>
          <div className={c.statValue} style={{ fontSize: "17px" }}>
            {topPlayer?.name ?? "-"}
          </div>
          {topPlayer && (
            <div className={d.statSubValue}>ELO {Math.round(topPlayer.elo)}</div>
          )}
        </div>
        <div className={c.statCard}>
          <div className={c.statLabel}>바로가기</div>
          <div className={d.quickActions}>
            <Link href="/team-builder">
              <button className={`${c.btn} ${c.btnPrimary} ${d.fullWidth}`}>팀 뽑기</button>
            </Link>
            <Link href="/matches/new">
              <button className={`${c.btn} ${c.btnGhost} ${d.fullWidth}`}>경기 입력</button>
            </Link>
          </div>
        </div>
      </div>

      <div className={s.grid2}>
        <div className={s.card}>
          <h2 className={d.sectionTitle}>ELO 리더보드</h2>
          {players.length === 0 ? (
            <p className={d.emptyState}>멤버를 추가해주세요</p>
          ) : (
            <table className={c.table}>
              <thead>
                <tr>
                  <th className={c.th}>#</th>
                  <th className={c.th}>플레이어</th>
                  <th className={c.th}>티어</th>
                  <th className={c.th}>ELO</th>
                  <th className={c.th}>승/패</th>
                  <th className={c.th}>승률</th>
                </tr>
              </thead>
              <tbody>
                {players.slice(0, 10).map((p, i) => {
                  const total = p.wins + p.losses;
                  const wr = total > 0 ? Math.round((p.wins / total) * 100) : 0;
                  return (
                    <tr key={String(p._id)} className={c.trHover}>
                      <td className={`${c.td} ${d.rankNum} ${i < 3 ? c.goldText : c.mutedText}`}>
                        {i + 1}
                      </td>
                      <td className={c.td}>
                        <div className={d.playerName}>{p.name}</div>
                        <div className={d.playerTag}>#{p.tag}</div>
                      </td>
                      <td className={c.td}>
                        <span style={{ color: c.tierColors[p.tier] ?? "#64748b", fontWeight: "700", fontSize: "12px" }}>
                          {p.tier} {p.rank}
                        </span>
                      </td>
                      <td className={`${c.td} ${d.eloValue}`}>{Math.round(p.elo)}</td>
                      <td className={c.td}>
                        <span className={c.winText}>{p.wins}W</span>
                        {" / "}
                        <span className={c.lossText}>{p.losses}L</span>
                      </td>
                      <td className={c.td}>
                        <span className={c.wrBadge[wr >= 50 ? "win" : "loss"]}>{wr}%</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {players.length > 10 && (
            <Link href="/players" className={d.viewMore}>전체 보기</Link>
          )}
        </div>

        <div className={s.card}>
          <div className={d.recentMatchHeader}>
            <h2 className={d.sectionTitle} style={{ marginBottom: 0 }}>최근 경기</h2>
            <div className={d.streakPills}>
              {winStreaks.slice(0, 2).map((p) => (
                <span key={p.name} className={d.streakPill.win}>
                  {p.name}<br />🔥 {p.streak}연승중
                </span>
              ))}
              {lossStreaks.slice(0, 2).map((p) => (
                <span key={p.name} className={d.streakPill.loss}>
                  {p.name}<br />▼ {p.streak}연패중
                </span>
              ))}
            </div>
          </div>
          {matches.length === 0 ? (
            <p className={d.emptyState}>경기 기록이 없습니다</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {matches.map((m) => {
                const date = new Date(m.date).toLocaleDateString("ko-KR");
                const mins = Math.floor(m.duration / 60);
                return (
                  <div key={String(m._id)} className={d.matchCard}>
                    <div>
                      <div className={d.matchTeams}>
                        <span className={d.blueTeam}>{m.blueTeamName}</span>
                        <span className={d.matchSep}>vs</span>
                        <span className={d.redTeam}>{m.redTeamName}</span>
                      </div>
                      <div className={d.matchMeta}>
                        {date}{mins > 0 ? ` · ${mins}분` : ""}
                      </div>
                    </div>
                    <span className={`${c.badge} ${c.badgeVariant[m.winner === "blue" ? "win" : "loss"]}`}>
                      {m.winner === "blue" ? m.blueTeamName : m.redTeamName} 승
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          <Link href="/matches" className={d.viewMore}>전체 경기 보기</Link>
        </div>
      </div>
    </div>
  );
}
