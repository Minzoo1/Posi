"use client";

import { useEffect, useState } from "react";
import * as s from "../styles/layout.css";
import * as c from "../styles/components.css";
import * as m from "./members.css";

const POSITIONS = ["TOP", "JG", "MID", "AD", "SUP"];

interface ChampionMastery {
  championId: number;
  championName: string;
  championLevel: number;
  championPoints: number;
}

interface Player {
  _id: string;
  name: string;
  riotId: string;
  tag: string;
  tier: string;
  rank: string;
  lp: number;
  elo: number;
  wins: number;
  losses: number;
  mainPosition: string;
  topChampions: ChampionMastery[];
  recentWins: number;
  recentLosses: number;
}

export default function MembersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", riotId: "", tag: "", mainPosition: "TOP" });
  const [error, setError] = useState("");

  async function fetchPlayers() {
    const res = await fetch("/api/players");
    const data = await res.json();
    setPlayers(data);
    setLoading(false);
  }

  useEffect(() => { fetchPlayers(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setAdding(true);
    const res = await fetch("/api/players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "오류가 발생했습니다.");
    } else {
      if (data._riotError) {
        setError(`등록 완료 (티어 조회 실패: ${data._riotError})`);
      }
      setForm({ name: "", riotId: "", tag: "", mainPosition: "TOP" });
      fetchPlayers();
    }
    setAdding(false);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`${name} 멤버를 삭제할까요?`)) return;
    await fetch(`/api/players/${id}`, { method: "DELETE" });
    fetchPlayers();
  }

  async function handleRefresh(id: string) {
    setRefreshingId(id);
    const res = await fetch(`/api/players/${id}`, { method: "PUT" });
    const data = await res.json();
    setRefreshingId(null);
    if (!res.ok) {
      alert(data.error ?? "갱신 실패");
    } else {
      fetchPlayers();
    }
  }

  return (
    <div>
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>멤버 관리</h1>
        <p className={s.pageSubtitle}>내전 참가자를 등록하고 관리하세요</p>
      </div>

      <div className={s.grid2} style={{ alignItems: "start" }}>
        <div className={s.card}>
          <h2 className={m.sectionTitle}>멤버 추가</h2>
          <form onSubmit={handleAdd} className={m.formStack}>
            <div>
              <label className={m.label}>표시 이름 *</label>
              <input
                className={c.input}
                placeholder="홍길동"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className={m.riotIdRow}>
              <div>
                <label className={m.label}>소환사명 *</label>
                <input
                  className={c.input}
                  placeholder="닉네임"
                  value={form.riotId}
                  onChange={(e) => setForm({ ...form, riotId: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className={m.label}>태그 *</label>
                <input
                  className={c.input}
                  placeholder="KR1"
                  value={form.tag}
                  onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <label className={m.label}>주 포지션</label>
              <select
                className={c.select}
                value={form.mainPosition}
                onChange={(e) => setForm({ ...form, mainPosition: e.target.value })}
              >
                {POSITIONS.map((pos) => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>
            {error && <p className={m.errorMsg}>{error}</p>}
            <button type="submit" className={`${c.btn} ${c.btnPrimary}`} disabled={adding}>
              {adding ? "등록 중..." : "멤버 등록"}
            </button>
            <p className={m.hint}>* Riot API 키 설정되면 티어가 자동으로 조회됩니다</p>
          </form>
        </div>

        <div className={s.card}>
          <h2 className={m.sectionTitle}>멤버 목록 ({players.length}명)</h2>
          {loading ? (
            <div className={m.centerLoader}><div className={c.spinner} /></div>
          ) : players.length === 0 ? (
            <p className={m.emptyState}>등록된 멤버가 없습니다</p>
          ) : (
            <div className={m.section}>
              {players.map((p) => {
                const total = p.wins + p.losses;
                const wr = total > 0 ? Math.round((p.wins / total) * 100) : 0;
                return (
                  <div key={p._id} className={m.playerCard}>
                    <div className={m.playerLeft}>
                      <span className={c.positionBadge}>{p.mainPosition.slice(0, 3)}</span>
                      <div>
                        <div className={m.playerName}>{p.name}</div>
                        <div className={m.playerSub}>
                          {p.riotId}#{p.tag} ·{" "}
                          <span style={{ color: c.tierColors[p.tier] ?? "#64748b" }}>
                            {p.tier} {p.rank}
                          </span>
                        </div>
                        {p.topChampions?.length > 0 && (
                          <div className={m.champRow}>
                            {p.topChampions.map((ch) => (
                              <span key={ch.championId} className={m.champBadge} title={`${ch.championPoints.toLocaleString()}점`}>
                                {ch.championName}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={m.playerRight}>
                      <div>
                        <div className={m.eloText}>ELO {Math.round(p.elo)}</div>
                        <div className={`${m.wrText} ${wr >= 50 ? c.winText : c.lossText}`}>
                          내전 {p.wins}W {p.losses}L · {wr}%
                        </div>
                        {(p.recentWins + p.recentLosses) > 0 && (() => {
                          const rTotal = p.recentWins + p.recentLosses;
                          const rWr = Math.round((p.recentWins / rTotal) * 100);
                          const streak = p.recentWins > p.recentLosses ? "연승 중" : "연패 중";
                          return (
                            <div className={`${m.wrText} ${rWr >= 50 ? c.winText : c.lossText}`}>
                              솔랭 최근 {rTotal}게임 {rWr}% ({streak})
                            </div>
                          );
                        })()}
                      </div>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          className={`${c.btn} ${c.btnGhost} ${m.smallBtn}`}
                          onClick={() => handleRefresh(p._id)}
                          disabled={refreshingId === p._id}
                          title="티어 갱신"
                        >
                          {refreshingId === p._id ? "갱신 중..." : "티어 갱신"}
                        </button>
                        <button
                          className={`${c.btn} ${c.btnDanger} ${m.smallBtn}`}
                          onClick={() => handleDelete(p._id, p.name)}
                        >
                          삭제
                        </button>
                      </div>
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
