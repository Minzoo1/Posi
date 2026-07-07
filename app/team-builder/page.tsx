"use client";

import { useEffect, useState } from "react";
import * as s from "../styles/layout.css";
import * as c from "../styles/components.css";
import * as t from "./team-builder.css";

interface Player {
  _id: string;
  name: string;
  tier: string;
  elo: number;
  mainPosition: string;
}

interface Team { blue: Player[]; red: Player[] }

const POSITIONS = ["TOP", "JG", "MID", "AD", "SUP"];

type Mode = "elo" | "random";
type TeamSize = 3 | 4 | 5;

function balanceByElo(selected: Player[]): Team {
  const sorted = [...selected].sort(() => Math.random() - 0.5).sort((a, b) => b.elo - a.elo);
  const blue: Player[] = [];
  const red: Player[] = [];
  const half = sorted.length / 2;
  sorted.forEach((p) => {
    const blueElo = blue.reduce((a, x) => a + x.elo, 0);
    const redElo = red.reduce((a, x) => a + x.elo, 0);
    if (blue.length < half && (blueElo <= redElo || red.length >= half)) blue.push(p);
    else red.push(p);
  });
  return { blue, red };
}

function splitRandom(selected: Player[], size: TeamSize): Team {
  const shuffled = [...selected].sort(() => Math.random() - 0.5);
  return { blue: shuffled.slice(0, size), red: shuffled.slice(size, size * 2) };
}

export default function TeamBuilderPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [teams, setTeams] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>("elo");
  const [teamSize, setTeamSize] = useState<TeamSize>(5);

  const needed = mode === "elo" ? 10 : teamSize * 2;

  useEffect(() => {
    fetch("/api/players").then((r) => r.json()).then((d) => { setPlayers(d); setLoading(false); });
  }, []);

  function togglePlayer(id: string) {
    setTeams(null);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < needed) next.add(id);
      return next;
    });
  }

  function handleModeChange(m: Mode) {
    setMode(m);
    setSelected(new Set());
    setTeams(null);
  }

  function handleSizeChange(size: TeamSize) {
    setTeamSize(size);
    setSelected(new Set());
    setTeams(null);
  }

  function buildTeams() {
    const sel = players.filter((p) => selected.has(p._id));
    setTeams(mode === "elo" ? balanceByElo(sel) : splitRandom(sel, teamSize));
  }

  const blueCount = teams?.blue.length ?? 0;
  const blueAvg = teams && blueCount > 0 ? Math.round(teams.blue.reduce((a, p) => a + p.elo, 0) / blueCount) : 0;
  const redCount = teams?.red.length ?? 0;
  const redAvg = teams && redCount > 0 ? Math.round(teams.red.reduce((a, p) => a + p.elo, 0) / redCount) : 0;
  const diff = Math.abs(blueAvg - redAvg);

  return (
    <div>
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>팀 뽑기</h1>
        <p className={s.pageSubtitle}>ELO 균형 또는 무작위로 팀을 구성합니다</p>
      </div>

      <div className={t.modeTabs}>
        <button className={t.modeTab[mode === "elo" ? "active" : "inactive"]} onClick={() => handleModeChange("elo")}>
          ELO 균형 (5vs5)
        </button>
        <button className={t.modeTab[mode === "random" ? "active" : "inactive"]} onClick={() => handleModeChange("random")}>
          증칼용 무작위
        </button>
      </div>

      <div className={s.grid2} style={{ alignItems: "start" }}>
        <div className={s.card}>
          {mode === "random" && (
            <div className={t.sizeTabRow}>
              {([3, 4, 5] as TeamSize[]).map((sz) => (
                <button key={sz} className={t.sizeTab[teamSize === sz ? "active" : "inactive"]} onClick={() => handleSizeChange(sz)}>
                  {sz} vs {sz}
                </button>
              ))}
            </div>
          )}

          <div className={t.listHeader}>
            <h2 style={{ fontSize: "17px", fontWeight: "700" }}>
              참가자 선택{" "}
              <span className={selected.size === needed ? t.countTextReady : t.countText}>
                ({selected.size}/{needed})
              </span>
            </h2>
            <div className={t.listHeaderBtns}>
              <button
                className={`${c.btn} ${c.btnGhost} ${t.smallBtn}`}
                onClick={() => { setSelected(new Set(players.slice(0, needed).map((p) => p._id))); setTeams(null); }}
              >전체</button>
              <button
                className={`${c.btn} ${c.btnGhost} ${t.smallBtn}`}
                onClick={() => { setSelected(new Set()); setTeams(null); }}
              >초기화</button>
            </div>
          </div>

          {loading ? (
            <div className={t.centerLoader}><div className={c.spinner} /></div>
          ) : players.length === 0 ? (
            <p className={t.emptyState}>멤버를 먼저 등록해주세요</p>
          ) : (
            <div className={t.playerList}>
              {players.map((p) => {
                const isSel = selected.has(p._id);
                return (
                  <div
                    key={p._id}
                    className={`${t.playerItem} ${isSel ? t.playerItemSelected : ""}`}
                    onClick={() => togglePlayer(p._id)}
                  >
                    <div className={t.playerInfo}>
                      <div className={`${t.checkCircle} ${isSel ? t.checkCircleSelected : ""}`}>
                        {isSel && <span className={t.checkMark}>✓</span>}
                      </div>
                      <span className={c.positionBadge}>{p.mainPosition.slice(0, 3)}</span>
                      <div>
                        <div className={t.playerName}>{p.name}</div>
                        <div className={t.playerTier} style={{ color: c.tierColors[p.tier] ?? "#64748b" }}>
                          {p.tier}
                        </div>
                      </div>
                    </div>
                    <span className={t.eloValue}>{Math.round(p.elo)}</span>
                  </div>
                );
              })}
            </div>
          )}

          <button
            className={`${c.btn} ${c.btnPrimary} ${t.buildBtn}`}
            disabled={selected.size !== needed}
            onClick={buildTeams}
          >
            {selected.size !== needed
              ? `${needed - selected.size}명 더 선택하세요`
              : mode === "elo" ? "팀 구성하기" : `무작위 ${teamSize}vs${teamSize} 뽑기`}
          </button>
        </div>

        <div>
          {!teams ? (
            <div className={`${s.card} ${t.resultPlaceholder}`}>
              <p className={t.placeholderText}>
                {needed}명 선택 후 팀을 구성하면<br />결과가 여기 표시됩니다
              </p>
            </div>
          ) : (
            <div className={t.resultStack}>
              <div className={t.resultHeader}>
                <h2 className={t.resultTitle}>
                  {mode === "elo" ? "ELO 균형 팀" : `무작위 ${teamSize}vs${teamSize}`}
                </h2>
                <button className={`${c.btn} ${c.btnGhost} ${t.smallBtn}`} onClick={buildTeams}>
                  다시 뽑기
                </button>
              </div>

              <div className={t.teamsGrid}>
                {(["blue", "red"] as const).map((team) => (
                  <div key={team} className={t.teamCard[team]}>
                    <div className={t.teamHeader}>
                      <h3 className={t.teamName[team]}>
                        {team === "blue" ? "블루팀" : "레드팀"}
                      </h3>
                      <span className={t.avgElo}>평균 {team === "blue" ? blueAvg : redAvg}</span>
                    </div>
                    <div className={t.teamPlayerList}>
                      {teams[team].map((p, i) => (
                        <div key={p._id} className={t.teamPlayerRow}>
                          <div className={t.teamPlayerLeft}>
                            {mode === "elo" && <span className={t.posLabel[team]}>{POSITIONS[i]}</span>}
                            <span className={t.teamPlayerName}>{p.name}</span>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                            <span className={t.teamPlayerElo}>{Math.round(p.elo)}</span>
                            {mode === "random" && (
                              <span style={{ fontSize: "10px", color: c.tierColors[p.tier] ?? "#64748b" }}>{p.tier}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className={t.balanceCard}>
                <div className={t.balanceLabel}>ELO 차이</div>
                <div className={t.balanceValue[diff < 30 ? "good" : "warn"]}>{diff} 포인트</div>
                <div className={t.balanceSub}>
                  {mode === "random"
                    ? diff < 30 ? "운좋게 균형잡힌 팀" : "무작위 팀 (불균형 가능)"
                    : diff < 30 ? "균형잡힌 팀" : "약간 불균형"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
