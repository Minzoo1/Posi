export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Player, IChampionMastery } from "@/lib/models/Player";
import { Match } from "@/lib/models/Match";
import * as s from "../../styles/layout.css";
import * as c from "../../styles/components.css";
import * as pd from "./player-detail.css";
import mongoose from "mongoose";

async function getData(id: string) {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const [player, matches] = await Promise.all([
    Player.findById(id).lean(),
    Match.find({ "participants.playerId": new mongoose.Types.ObjectId(id) })
      .sort({ date: -1 })
      .limit(10)
      .lean(),
  ]);
  return player ? { player, matches } : null;
}

export default async function PlayerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getData(id);
  if (!data) notFound();

  const { player, matches } = data;
  const total = player.wins + player.losses;
  const wr = total > 0 ? Math.round((player.wins / total) * 100) : 0;
  const recentTotal = (player.recentWins ?? 0) + (player.recentLosses ?? 0);
  const recentWr = recentTotal > 0 ? Math.round(((player.recentWins ?? 0) / recentTotal) * 100) : 0;

  const kdaMatches = matches.filter((m) =>
    m.participants.some(
      (pt: { playerId: mongoose.Types.ObjectId; kills?: number; deaths?: number; assists?: number }) =>
        String(pt.playerId) === id && pt.kills != null
    )
  );
  const kdaTotals = kdaMatches.reduce(
    (acc, m) => {
      const pt = m.participants.find(
        (p: { playerId: mongoose.Types.ObjectId; kills?: number; deaths?: number; assists?: number }) =>
          String(p.playerId) === id
      );
      return { k: acc.k + (pt?.kills ?? 0), d: acc.d + (pt?.deaths ?? 0), a: acc.a + (pt?.assists ?? 0) };
    },
    { k: 0, d: 0, a: 0 }
  );
  const kdaCount = kdaMatches.length;
  const avgK = kdaCount > 0 ? (kdaTotals.k / kdaCount).toFixed(1) : null;
  const avgD = kdaCount > 0 ? (kdaTotals.d / kdaCount).toFixed(1) : null;
  const avgA = kdaCount > 0 ? (kdaTotals.a / kdaCount).toFixed(1) : null;
  const kdaRatio = kdaCount > 0 && kdaTotals.d > 0
    ? ((kdaTotals.k + kdaTotals.a) / kdaTotals.d).toFixed(2)
    : kdaCount > 0 ? "Perfect" : null;

  return (
    <div>
      <Link href="/players" className={pd.backLink}>← 플레이어 통계로 돌아가기</Link>

      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>플레이어 분석</h1>
        <p className={s.pageSubtitle}>{player.name}의 상세 정보</p>
      </div>

      {/* 프로필 */}
      <div className={pd.profileCard}>
        <div className={pd.avatar}>{player.name[0]}</div>
        <div className={pd.profileInfo}>
          <div className={pd.profileName}>{player.name}</div>
          <div className={pd.profileSub}>
            {player.riotId}#{player.tag} · {player.mainPosition}
          </div>
          <div style={{ marginTop: "6px" }}>
            <span style={{ color: c.tierColors[player.tier] ?? "#64748b", fontWeight: "700", fontSize: "15px" }}>
              {player.tier} {player.rank}
            </span>
            {player.lp > 0 && (
              <span style={{ color: "#64748b", fontSize: "13px" }}> {player.lp}LP</span>
            )}
          </div>
        </div>
      </div>

      {/* 스탯 요약 */}
      <div className={pd.statGrid}>
        <div className={pd.statBox}>
          <div className={pd.statLabel}>내전 ELO</div>
          <div className={pd.statValue}>{Math.round(player.elo)}</div>
        </div>
        <div className={pd.statBox}>
          <div className={pd.statLabel}>내전 승률</div>
          <div className={pd.statValue} style={{ color: wr >= 50 ? "#22c55e" : "#ef4444" }}>{wr}%</div>
          <div className={pd.statSub}>{player.wins}W {player.losses}L</div>
        </div>
        <div className={pd.statBox}>
          <div className={pd.statLabel}>솔랭 최근 {recentTotal}게임</div>
          <div className={pd.statValue} style={{ color: recentWr >= 50 ? "#22c55e" : "#ef4444" }}>
            {recentTotal > 0 ? `${recentWr}%` : "-"}
          </div>
          {recentTotal > 0 && (
            <div className={pd.statSub}>{player.recentWins}W {player.recentLosses}L</div>
          )}
        </div>
        <div className={pd.statBox}>
          <div className={pd.statLabel}>내전 경기수</div>
          <div className={pd.statValue}>{total}</div>
          <div className={pd.statSub}>판</div>
        </div>
        <div className={pd.statBox}>
          <div className={pd.statLabel}>평균 KDA</div>
          <div className={pd.statValue} style={{ color: kdaRatio && kdaRatio !== "Perfect" && parseFloat(kdaRatio) >= 3 ? "#22c55e" : undefined }}>
            {kdaRatio ?? "-"}
          </div>
          {avgK != null && (
            <div className={pd.statSub}>{avgK} / {avgD} / {avgA}</div>
          )}
        </div>
      </div>

      <div className={s.grid2} style={{ alignItems: "start" }}>
        {/* 챔피언 장인 */}
        <div className={s.card}>
          <h2 className={pd.sectionTitle}>챔피언 숙련도 TOP 3</h2>
          {!player.topChampions?.length ? (
            <p className={pd.emptyState}>데이터 없음 (재등록 시 조회)</p>
          ) : (
            <div className={pd.champList}>
              {(player.topChampions as IChampionMastery[]).map((ch, i) => (
                <div key={ch.championId} className={pd.champRow}>
                  <span className={pd.champRank}>{i + 1}</span>
                  <span className={pd.champName}>{ch.championName}</span>
                  <div className={pd.champMeta}>
                    <span className={pd.champLevel}>Lv.{ch.championLevel}</span>
                    <span className={pd.champPoints}>{ch.championPoints.toLocaleString()}점</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 최근 솔랭 상태 */}
          {recentTotal > 0 && (
            <div style={{ marginTop: "20px" }}>
              <h2 className={pd.sectionTitle}>솔랭 최근 상태</h2>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span className={pd.recentBadge[recentWr >= 50 ? "good" : "bad"]}>
                  {recentWr >= 50 ? "상승세" : "하락세"} {recentWr}%
                </span>
                <span style={{ fontSize: "13px", color: "#64748b" }}>
                  최근 {recentTotal}게임 {player.recentWins}승 {player.recentLosses}패
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 최근 내전 경기 */}
        <div className={s.card}>
          <h2 className={pd.sectionTitle}>최근 내전 경기</h2>
          {matches.length === 0 ? (
            <p className={pd.emptyState}>참가한 경기가 없습니다</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {matches.map((match) => {
                const myParticipant = match.participants.find(
                  (pt: { playerId: mongoose.Types.ObjectId; team: string; champion?: string; kills?: number; deaths?: number; assists?: number; eloChange?: number }) =>
                    String(pt.playerId) === id
                );
                const isWin = myParticipant?.team === match.winner;
                const date = new Date(match.date).toLocaleDateString("ko-KR");
                const eloChange = myParticipant?.eloChange ?? 0;
                return (
                  <div key={String(match._id)} className={pd.matchRow}>
                    <div className={pd.matchLeft}>
                      <div className={pd.matchTeams}>
                        <span style={{ color: "#3b82f6" }}>{match.blueTeamName}</span>
                        <span style={{ color: "#64748b", margin: "0 6px" }}>vs</span>
                        <span style={{ color: "#ef4444" }}>{match.redTeamName}</span>
                      </div>
                      <div className={pd.matchMeta}>
                        {date}
                        {myParticipant?.champion ? ` · ${myParticipant.champion}` : ""}
                        {myParticipant && ` · ${myParticipant.kills}/${myParticipant.deaths}/${myParticipant.assists}`}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "3px" }}>
                      <span className={`${c.badge} ${c.badgeVariant[isWin ? "win" : "loss"]}`}>
                        {isWin ? "승" : "패"}
                      </span>
                      <span style={{ fontSize: "11px", color: eloChange >= 0 ? "#22c55e" : "#ef4444" }}>
                        ELO {eloChange >= 0 ? "+" : ""}{eloChange}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
