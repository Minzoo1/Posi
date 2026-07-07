export const dynamic = "force-dynamic";

import { connectDB } from "@/lib/db";
import { Player } from "@/lib/models/Player";
import { Match, IParticipant } from "@/lib/models/Match";
import * as s from "../styles/layout.css";
import * as f from "./fun-stats.css";

async function getData() {
  try {
    await connectDB();
    const [players, allMatches] = await Promise.all([
      Player.find().lean(),
      Match.find().sort({ date: 1 }).lean(), // oldest first
    ]);

    const nameMap: Record<string, string> = {};
    for (const p of players) nameMap[String(p._id)] = p.name;

    // ── 1. 최악의 콤비 (같은 팀 페어 승률) ──────────────────────────
    // pairKey = sorted ids joined by ":"
    const pairStats: Record<string, { wins: number; losses: number; names: [string, string] }> = {};

    for (const match of allMatches) {
      const blue = match.participants.filter((p: IParticipant) => p.team === "blue").map((p: IParticipant) => String(p.playerId));
      const red = match.participants.filter((p: IParticipant) => p.team === "red").map((p: IParticipant) => String(p.playerId));

      for (const group of [blue, red]) {
        const won = group[0] && match.participants.find((p: IParticipant) => String(p.playerId) === group[0])?.team === match.winner;
        for (let i = 0; i < group.length; i++) {
          for (let j = i + 1; j < group.length; j++) {
            const key = [group[i], group[j]].sort().join(":");
            if (!pairStats[key]) {
              const ids = key.split(":");
              pairStats[key] = { wins: 0, losses: 0, names: [nameMap[ids[0]] ?? "?", nameMap[ids[1]] ?? "?"] };
            }
            if (won) pairStats[key].wins++;
            else pairStats[key].losses++;
          }
        }
      }
    }

    const MIN_PAIR_GAMES = 3;

    // 최악의 콤비 (승률 낮은 페어)
    const worstPairs = Object.values(pairStats)
      .filter((p) => p.wins + p.losses >= MIN_PAIR_GAMES)
      .map((p) => ({ ...p, total: p.wins + p.losses, wr: Math.round((p.wins / (p.wins + p.losses)) * 100) }))
      .sort((a, b) => a.wr - b.wr)
      .slice(0, 5);

    // 최고의 콤비 (승률 높은 페어)
    const bestPairs = Object.values(pairStats)
      .filter((p) => p.wins + p.losses >= MIN_PAIR_GAMES)
      .map((p) => ({ ...p, total: p.wins + p.losses, wr: Math.round((p.wins / (p.wins + p.losses)) * 100) }))
      .sort((a, b) => b.wr - a.wr)
      .slice(0, 5);

    // ── 2. 팀에 있으면 지는 플레이어 (개인 내전 승률 기준) ─────────
    const playerWinStats: Record<string, { wins: number; losses: number; name: string }> = {};
    for (const p of players) {
      playerWinStats[String(p._id)] = { wins: p.wins, losses: p.losses, name: p.name };
    }

    const MIN_PLAYER_GAMES = 3;
    const curseList = Object.values(playerWinStats)
      .filter((p) => p.wins + p.losses >= MIN_PLAYER_GAMES)
      .map((p) => ({ ...p, total: p.wins + p.losses, wr: Math.round((p.wins / (p.wins + p.losses)) * 100) }))
      .sort((a, b) => a.wr - b.wr)
      .slice(0, 5);

    // ── 3. 연속으로 같은 상대한테 진 기록 ─────────────────────────
    // rivalRecord[victimId][killerId] = { curStreak, maxStreak, killerName, victimName }
    type RivalEntry = { curStreak: number; maxStreak: number; killerName: string; victimName: string };
    const rivalRecord: Record<string, Record<string, RivalEntry>> = {};

    for (const match of allMatches) {
      const blueIds = match.participants.filter((p: IParticipant) => p.team === "blue").map((p: IParticipant) => String(p.playerId));
      const redIds = match.participants.filter((p: IParticipant) => p.team === "red").map((p: IParticipant) => String(p.playerId));

      const winnerIds = match.winner === "blue" ? blueIds : redIds;
      const loserIds = match.winner === "blue" ? redIds : blueIds;

      // for each loser, each winner is their "rival" who beat them
      for (const loserId of loserIds) {
        if (!rivalRecord[loserId]) rivalRecord[loserId] = {};
        for (const winnerId of winnerIds) {
          if (!rivalRecord[loserId][winnerId]) {
            rivalRecord[loserId][winnerId] = {
              curStreak: 0, maxStreak: 0,
              killerName: nameMap[winnerId] ?? "?",
              victimName: nameMap[loserId] ?? "?",
            };
          }
          rivalRecord[loserId][winnerId].curStreak++;
          rivalRecord[loserId][winnerId].maxStreak = Math.max(
            rivalRecord[loserId][winnerId].maxStreak,
            rivalRecord[loserId][winnerId].curStreak
          );
        }
        // reset streaks for loserId vs anyone on loserIds (same team — no streak change)
      }

      // reset streak when loser wins against that rival
      for (const winnerId of winnerIds) {
        if (!rivalRecord[winnerId]) continue;
        for (const loserId of loserIds) {
          if (rivalRecord[winnerId][loserId]) {
            rivalRecord[winnerId][loserId].curStreak = 0;
          }
        }
      }
    }

    const rivalList: { victimName: string; killerName: string; streak: number }[] = [];
    for (const loserId of Object.keys(rivalRecord)) {
      for (const killerId of Object.keys(rivalRecord[loserId])) {
        const r = rivalRecord[loserId][killerId];
        if (r.maxStreak >= 2) {
          rivalList.push({ victimName: r.victimName, killerName: r.killerName, streak: r.maxStreak });
        }
      }
    }
    rivalList.sort((a, b) => b.streak - a.streak);
    const topRivals = rivalList.slice(0, 5);

    return { worstPairs, bestPairs, curseList, topRivals };
  } catch {
    return { worstPairs: [], bestPairs: [], curseList: [], topRivals: [] };
  }
}

export default async function FunStatsPage() {
  const { worstPairs, bestPairs, curseList, topRivals } = await getData();

  return (
    <div>
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>패배 분석 😈</h1>
        <p className={s.pageSubtitle}>팀원 탓, 상대 탓, 다 여기 있음</p>
      </div>

      <div className={f.grid2}>
        {/* 최악의 콤비 */}
        <div className={s.card}>
          <div className={f.section}>
            <div className={f.sectionTitle}>💀 최악의 콤비</div>
            <div className={f.sectionDesc}>같이 팀 되면 지는 조합 TOP 5 (최소 {3}경기)</div>
            {worstPairs.length === 0 ? (
              <p className={f.emptyState}>데이터 부족</p>
            ) : (
              <div className={f.rankList}>
                {worstPairs.map((p, i) => (
                  <div key={i} className={`${f.rankRow} ${f.rankRowAccent.loss}`}>
                    <span className={`${f.rankNum} ${i === 0 ? f.rankFirst : ""}`}>{i + 1}</span>
                    <div style={{ flex: 1 }}>
                      <div className={f.playerNames}>{p.names[0]} + {p.names[1]}</div>
                      <div className={f.playerSub}>{p.wins}승 {p.losses}패 · {p.total}경기</div>
                    </div>
                    <span className={f.statBadge.loss}>승률 {p.wr}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 최고의 콤비 */}
        <div className={s.card}>
          <div className={f.section}>
            <div className={f.sectionTitle}>🔥 최고의 콤비</div>
            <div className={f.sectionDesc}>같이 팀 되면 이기는 조합 TOP 5 (최소 {3}경기)</div>
            {bestPairs.length === 0 ? (
              <p className={f.emptyState}>데이터 부족</p>
            ) : (
              <div className={f.rankList}>
                {bestPairs.map((p, i) => (
                  <div key={i} className={`${f.rankRow} ${f.rankRowAccent.win}`}>
                    <span className={`${f.rankNum} ${i === 0 ? f.rankFirst : ""}`}>{i + 1}</span>
                    <div style={{ flex: 1 }}>
                      <div className={f.playerNames}>{p.names[0]} + {p.names[1]}</div>
                      <div className={f.playerSub}>{p.wins}승 {p.losses}패 · {p.total}경기</div>
                    </div>
                    <span className={f.statBadge.win}>승률 {p.wr}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 팀에 있으면 지는 플레이어 */}
        <div className={s.card}>
          <div className={f.section}>
            <div className={f.sectionTitle}>☠️ 팀에 있으면 지는 플레이어</div>
            <div className={f.sectionDesc}>이 사람이 팀에 있으면... 각오해 (최소 {3}경기)</div>
            {curseList.length === 0 ? (
              <p className={f.emptyState}>데이터 부족</p>
            ) : (
              <div className={f.rankList}>
                {curseList.map((p, i) => (
                  <div key={i} className={`${f.rankRow} ${f.rankRowAccent.loss}`}>
                    <span className={`${f.rankNum} ${i === 0 ? f.rankFirst : ""}`}>{i + 1}</span>
                    <div style={{ flex: 1 }}>
                      <div className={f.playerNames}>{p.name}</div>
                      <div className={f.playerSub}>{p.wins}승 {p.losses}패 · {p.total}경기</div>
                    </div>
                    <span className={f.statBadge.loss}>승률 {p.wr}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 연속으로 같은 상대한테 진 기록 */}
        <div className={s.card}>
          <div className={f.section}>
            <div className={f.sectionTitle}>😭 상대가 천적인 기록</div>
            <div className={f.sectionDesc}>연속으로 같은 상대 팀한테 진 최장 기록</div>
            {topRivals.length === 0 ? (
              <p className={f.emptyState}>데이터 부족</p>
            ) : (
              <div className={f.rankList}>
                {topRivals.map((r, i) => (
                  <div key={i} className={`${f.rankRow} ${f.rankRowAccent.loss}`}>
                    <span className={`${f.rankNum} ${i === 0 ? f.rankFirst : ""}`}>{i + 1}</span>
                    <div style={{ flex: 1 }}>
                      <div className={f.playerNames}>
                        {r.victimName} <span style={{ color: "#64748b", fontWeight: 400 }}>vs</span> {r.killerName}
                      </div>
                      <div className={f.playerSub}>{r.killerName}한테 연속으로 당함</div>
                    </div>
                    <span className={f.statBadge.loss}>{r.streak}연패</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
