export const dynamic = "force-dynamic";

import { connectDB } from "@/lib/db";
import { Player } from "@/lib/models/Player";
import { Match } from "@/lib/models/Match";
import * as s from "../styles/layout.css";
import * as hof from "./hall-of-fame.css";

interface PlayerStat {
  id: string;
  name: string;
  value: number;
  sub?: string;
}

interface TrophyData {
  icon: string;
  title: string;
  accent: keyof typeof import("./hall-of-fame.css").accentColor;
  top: PlayerStat[];
}

async function getData() {
  try {
    await connectDB();
    const [players, allMatches] = await Promise.all([
      Player.find().lean(),
      Match.find().sort({ date: -1 }).lean(),
    ]);

    // per-player stats accumulator
    const stats: Record<string, {
      id: string; name: string;
      wins: number; losses: number; totalGames: number;
      kills: number; deaths: number; assists: number; kdaGames: number;
      cs: number; gold: number; damage: number; vision: number; statGames: number;
      maxWinStreak: number; maxLossStreak: number;
      curStreak: number; curStreakType: "win" | "loss" | null;
    }> = {};

    for (const p of players) {
      stats[String(p._id)] = {
        id: String(p._id), name: p.name,
        wins: p.wins, losses: p.losses, totalGames: p.wins + p.losses,
        kills: 0, deaths: 0, assists: 0, kdaGames: 0,
        cs: 0, gold: 0, damage: 0, vision: 0, statGames: 0,
        maxWinStreak: 0, maxLossStreak: 0,
        curStreak: 0, curStreakType: null,
      };
    }

    // process matches oldest-first for streak calculation
    const matchesAsc = [...allMatches].reverse();

    for (const match of matchesAsc) {
      for (const pt of match.participants) {
        const pid = String(pt.playerId);
        if (!stats[pid]) continue;
        const s = stats[pid];

        // streak (oldest-first)
        const won = pt.team === match.winner;
        if (s.curStreakType === null) {
          s.curStreakType = won ? "win" : "loss";
          s.curStreak = 1;
        } else if ((s.curStreakType === "win") === won) {
          s.curStreak++;
        } else {
          s.curStreakType = won ? "win" : "loss";
          s.curStreak = 1;
        }
        if (s.curStreakType === "win") s.maxWinStreak = Math.max(s.maxWinStreak, s.curStreak);
        else s.maxLossStreak = Math.max(s.maxLossStreak, s.curStreak);

        // KDA (only if entered)
        if (pt.kills != null && pt.kills > 0 || pt.deaths != null && pt.deaths > 0 || pt.assists != null && pt.assists > 0) {
          s.kills += pt.kills ?? 0;
          s.deaths += pt.deaths ?? 0;
          s.assists += pt.assists ?? 0;
          s.kdaGames++;
        }

        // other stats
        if (pt.cs > 0 || pt.gold > 0 || pt.damage > 0 || pt.vision > 0) {
          s.cs += pt.cs ?? 0;
          s.gold += pt.gold ?? 0;
          s.damage += pt.damage ?? 0;
          s.vision += pt.vision ?? 0;
          s.statGames++;
        }
      }
    }

    const all = Object.values(stats);
    const minGames = 3;

    function top3<T>(
      arr: typeof all,
      valueFn: (p: typeof all[0]) => number | null,
      subFn?: (p: typeof all[0], v: number) => string | undefined,
      filter?: (p: typeof all[0]) => boolean,
    ): PlayerStat[] {
      return arr
        .filter(filter ?? (() => true))
        .map((p) => ({ p, v: valueFn(p) }))
        .filter(({ v }) => v != null && v > 0)
        .sort((a, b) => (b.v as number) - (a.v as number))
        .slice(0, 3)
        .map(({ p, v }) => ({
          id: p.id,
          name: p.name,
          value: v as number,
          sub: subFn ? subFn(p, v as number) : undefined,
        }));
    }

    const trophies: TrophyData[] = [
      {
        icon: "👑",
        title: "내전 ELO 1위",
        accent: "gold",
        top: players
          .sort((a, b) => b.elo - a.elo)
          .slice(0, 3)
          .map((p) => ({
            id: String(p._id),
            name: p.name,
            value: Math.round(p.elo),
            sub: `ELO ${Math.round(p.elo)}`,
          })),
      },
     
      
      {
        icon: "📈",
        title: "최고 승률",
        accent: "win",
        top: top3(
          all,
          (p) => p.totalGames >= minGames ? Math.round((p.wins / p.totalGames) * 100) : null,
          (p, v) => `${v}% (${p.wins}W ${p.losses}L)`,
        ),
      },
      {
        icon: "🔥",
        title: "최장 연승 기록",
        accent: "orange",
        top: top3(all, (p) => p.maxWinStreak, (_, v) => `${v}연승`),
      },
      {
        icon: "🌧️",
        title: "최장 연패 기록",
        accent: "loss",
        top: top3(all, (p) => p.maxLossStreak, (_, v) => `${v}연패`),
      },
       {
        icon: "🏅",
        title: "최다 내전 참여",
        accent: "blue",
        top: top3(all, (p) => p.totalGames, (p) => `${p.wins}W ${p.losses}L`),
      },
      {
        icon: "⚔️",
        title: "평균 KDA 최고",
        accent: "purple",
        top: top3(
          all,
          (p) => {
            if (p.kdaGames === 0) return null;
            return p.deaths === 0
              ? (p.kills + p.assists) * 10
              : parseFloat(((p.kills + p.assists) / p.deaths).toFixed(2));
          },
          (p) => {
            if (p.kdaGames === 0) return undefined;
            const ratio = p.deaths === 0 ? "Perfect" : ((p.kills + p.assists) / p.deaths).toFixed(2);
            const k = (p.kills / p.kdaGames).toFixed(1);
            const d = (p.deaths / p.kdaGames).toFixed(1);
            const a = (p.assists / p.kdaGames).toFixed(1);
            return `KDA ${ratio} (${k}/${d}/${a})`;
          },
          (p) => p.kdaGames >= minGames,
        ),
      },
      {
        icon: "🗡️",
        title: "평균 킬 최다",
        accent: "orange",
        top: top3(
          all,
          (p) => p.kdaGames > 0 ? parseFloat((p.kills / p.kdaGames).toFixed(2)) : null,
          (p, v) => `평균 ${v} 킬 (${p.kdaGames}경기)`,
          (p) => p.kdaGames >= minGames,
        ),
      },
      {
        icon: "🤝",
        title: "평균 어시스트 최다",
        accent: "cyan",
        top: top3(
          all,
          (p) => p.kdaGames > 0 ? parseFloat((p.assists / p.kdaGames).toFixed(2)) : null,
          (p, v) => `평균 ${v} 어시 (${p.kdaGames}경기)`,
          (p) => p.kdaGames >= minGames,
        ),
      },
      {
        icon: "💀",
        title: "평균 데스 최다",
        accent: "loss",
        top: top3(
          all,
          (p) => p.kdaGames > 0 ? parseFloat((p.deaths / p.kdaGames).toFixed(2)) : null,
          (p, v) => `평균 ${v} 데스 (${p.kdaGames}경기)`,
          (p) => p.kdaGames >= minGames,
        ),
      },
      {
        icon: "🌾",
        title: "평균 CS 최고",
        accent: "gold",
        top: top3(
          all,
          (p) => p.statGames > 0 ? parseFloat((p.cs / p.statGames).toFixed(1)) : null,
          (p, v) => `평균 ${v} CS (${p.statGames}경기)`,
          (p) => p.statGames >= minGames,
        ),
      },
    ];

    return { trophies };
  } catch {
    return { trophies: [] };
  }
}

export default async function HallOfFamePage() {
  const { trophies } = await getData();

  return (
    <div>
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>명예의 전당</h1>
        <p className={s.pageSubtitle}>전체 내전 경기 기록 기반 랭킹</p>
      </div>

      <div className={hof.grid}>
        {trophies.map((trophy) => (
          <div key={trophy.title} className={hof.trophyCard}>
            <div className={hof.cardHeader}>
              <span className={hof.trophyIcon}>{trophy.icon}</span>
              <span className={hof.cardTitle}>{trophy.title}</span>
            </div>

            {trophy.top.length === 0 ? (
              <p className={hof.emptyState}>데이터 없음</p>
            ) : (
              <>
                <div>
                  <div className={`${hof.winner} ${hof.accentColor[trophy.accent]}`}>
                    {trophy.top[0].name}
                  </div>
                  {trophy.top[0].sub && (
                    <div className={hof.winnerSub}>{trophy.top[0].sub}</div>
                  )}
                </div>

                {trophy.top.length > 1 && (
                  <>
                    <div className={hof.divider} />
                    <div className={hof.runnerUpList}>
                      {trophy.top.slice(1).map((p, i) => (
                        <div key={p.id} className={hof.runnerUpRow}>
                          <span>
                            <span className={hof.rankBadge}>{i + 2}위</span>{" "}
                            <span className={hof.runnerUpName}>{p.name}</span>
                          </span>
                          <span className={hof.runnerUpVal}>{p.sub ?? p.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
