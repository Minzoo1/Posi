export const dynamic = "force-dynamic";

import { connectDB } from "@/lib/db";
import { Player } from "@/lib/models/Player";
import * as s from "../styles/layout.css";
import * as c from "../styles/components.css";
import * as p from "./players.css";

async function getPlayers() {
  await connectDB();
  return Player.find().sort({ elo: -1 }).lean();
}

export default async function PlayersPage() {
  const players = await getPlayers();

  return (
    <div>
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>플레이어 통계</h1>
        <p className={s.pageSubtitle}>전체 멤버 ELO 및 전적 통계</p>
      </div>

      <div className={s.card}>
        <table className={c.table}>
          <thead>
            <tr>
              <th className={c.th}>#</th>
              <th className={c.th}>플레이어</th>
              <th className={c.th}>포지션</th>
              <th className={c.th}>티어</th>
              <th className={c.th}>ELO</th>
              <th className={c.th}>전적</th>
              <th className={c.th}>승률</th>
            </tr>
          </thead>
          <tbody>
            {players.map((pl, i) => {
              const total = pl.wins + pl.losses;
              const wr = total > 0 ? Math.round((pl.wins / total) * 100) : 0;
              const medal = String(i + 1);
              return (
                <tr key={String(pl._id)} className={c.trHover}>
                  <td className={`${c.td} ${p.rankCell} ${i < 3 ? c.goldText : c.mutedText}`}>
                    {medal}
                  </td>
                  <td className={c.td}>
                    <div className={p.playerName}>{pl.name}</div>
                    <div className={p.playerSub}>{pl.riotId}#{pl.tag}</div>
                  </td>
                  <td className={c.td}>
                    <span className={c.positionBadge}>{pl.mainPosition.slice(0, 3)}</span>
                  </td>
                  <td className={c.td}>
                    <span style={{ color: c.tierColors[pl.tier] ?? "#64748b", fontWeight: "700", fontSize: "13px" }}>
                      {pl.tier} {pl.rank}
                    </span>
                    {pl.lp > 0 && <span className={p.lpText}> {pl.lp}LP</span>}
                  </td>
                  <td className={`${c.td} ${p.eloCell}`}>{Math.round(pl.elo)}</td>
                  <td className={c.td}>
                    <span className={c.winText}>{pl.wins}W</span>
                    {" "}
                    <span className={c.lossText}>{pl.losses}L</span>
                    <span className={c.mutedText}> ({total})</span>
                  </td>
                  <td className={c.td}>
                    <span className={c.wrBadge[wr >= 50 ? "win" : "loss"]}>{wr}%</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {players.length === 0 && <p className={p.emptyState}>등록된 멤버가 없습니다</p>}
      </div>
    </div>
  );
}
