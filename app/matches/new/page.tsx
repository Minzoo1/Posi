"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as s from "../../styles/layout.css";
import * as c from "../../styles/components.css";

interface Player {
  _id: string;
  name: string;
  riotId: string;
  elo: number;
  mainPosition: string;
  tier: string;
}

interface Participant {
  playerId: string;
  playerName: string;
  team: "blue" | "red";
  champion: string;
  position: string;
  kills: number;
  deaths: number;
  assists: number;
  cs: number;
  elo: number;
}

const POSITIONS = ["TOP", "JGL", "MID", "BOT", "SUP"];
const EMPTY_PARTICIPANT: Omit<Participant, "playerId" | "playerName" | "elo"> = {
  team: "blue",
  champion: "",
  position: "",
  kills: 0,
  deaths: 0,
  assists: 0,
  cs: 0,
};

export default function NewMatchPage() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [winner, setWinner] = useState<"blue" | "red">("blue");
  const [duration, setDuration] = useState("");
  const [blueTeamName, setBlueTeamName] = useState("블루팀");
  const [redTeamName, setRedTeamName] = useState("레드팀");
  const [note, setNote] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/players")
      .then((r) => r.json())
      .then(setPlayers);
  }, []);

  function addParticipant(team: "blue" | "red") {
    setParticipants((prev) => [
      ...prev,
      { ...EMPTY_PARTICIPANT, team, playerId: "", playerName: "", elo: 1000 },
    ]);
  }

  function updateParticipant(idx: number, field: string, value: string | number) {
    setParticipants((prev) => {
      const next = [...prev];
      if (field === "playerId") {
        const player = players.find((p) => p._id === value);
        next[idx] = { ...next[idx], playerId: String(value), playerName: player?.name ?? "", elo: player?.elo ?? 1000 };
      } else {
        (next[idx] as unknown as Record<string, unknown>)[field] = value;
      }
      return next;
    });
  }

  function removeParticipant(idx: number) {
    setParticipants((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (participants.filter((p) => p.team === "blue").length === 0 ||
        participants.filter((p) => p.team === "red").length === 0) {
      alert("양 팀에 최소 1명씩 있어야 합니다.");
      return;
    }
    setSubmitting(true);
    const durationSecs = duration ? parseInt(duration) * 60 : 0;
    const res = await fetch("/api/matches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ winner, duration: durationSecs, blueTeamName, redTeamName, note, participants }),
    });
    if (res.ok) {
      router.push("/matches");
    } else {
      alert("오류가 발생했습니다.");
      setSubmitting(false);
    }
  }

  const blueParticipants = participants.filter((_, i) => participants[i].team === "blue");
  const redParticipants = participants.filter((_, i) => participants[i].team === "red");

  return (
    <div>
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>경기 입력</h1>
        <p className={s.pageSubtitle}>경기 결과를 기록하면 ELO가 자동 계산됩니다</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={s.card} style={{ marginBottom: "16px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>경기 정보</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ fontSize: "13px", color: "#94a3b8", display: "block", marginBottom: "6px" }}>블루팀 이름</label>
              <input className={c.input} value={blueTeamName} onChange={(e) => setBlueTeamName(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: "13px", color: "#94a3b8", display: "block", marginBottom: "6px" }}>레드팀 이름</label>
              <input className={c.input} value={redTeamName} onChange={(e) => setRedTeamName(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: "13px", color: "#94a3b8", display: "block", marginBottom: "6px" }}>경기 시간 (분)</label>
              <input className={c.input} type="number" placeholder="30" value={duration} onChange={(e) => setDuration(e.target.value)} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "12px" }}>
            <div>
              <label style={{ fontSize: "13px", color: "#94a3b8", display: "block", marginBottom: "6px" }}>승리팀 *</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => setWinner("blue")}
                  className={`${c.btn} ${winner === "blue" ? c.btnPrimary : c.btnGhost}`}
                  style={{ flex: 1 }}
                >
                  {blueTeamName}
                </button>
                <button
                  type="button"
                  onClick={() => setWinner("red")}
                  className={`${c.btn} ${winner === "red" ? c.btnDanger : c.btnGhost}`}
                  style={{ flex: 1 }}
                >
                  {redTeamName}
                </button>
              </div>
            </div>
            <div>
              <label style={{ fontSize: "13px", color: "#94a3b8", display: "block", marginBottom: "6px" }}>메모</label>
              <input className={c.input} placeholder="특이사항 등..." value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
          </div>
        </div>

        {(["blue", "red"] as const).map((team) => {
          const teamParticipants = participants.map((p, i) => ({ p, i })).filter(({ p }) => p.team === team);
          return (
            <div key={team} className={s.card} style={{ marginBottom: "16px", borderColor: team === "blue" ? "#2563eb44" : "#ef444444" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h2 style={{ fontSize: "16px", fontWeight: "700", color: team === "blue" ? "#3b82f6" : "#ef4444" }}>
                  {team === "blue" ? blueTeamName : redTeamName} ({teamParticipants.length}명)
                </h2>
                <button
                  type="button"
                  className={`${c.btn} ${c.btnGhost}`}
                  style={{ fontSize: "13px" }}
                  onClick={() => addParticipant(team)}
                  disabled={teamParticipants.length >= 5}
                >
                  + 플레이어 추가
                </button>
              </div>

              {teamParticipants.length === 0 ? (
                <p style={{ color: "#64748b", textAlign: "center", padding: "24px 0" }}>
                  플레이어를 추가하세요
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {teamParticipants.map(({ p, i }) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "180px 80px 40px 40px 40px 60px 40px", gap: "6px", alignItems: "center" }}>
                      <select
                        className={c.select}
                        value={p.playerId}
                        onChange={(e) => updateParticipant(i, "playerId", e.target.value)}
                        required
                      >
                        <option value="">플레이어 선택</option>
                        {players.map((pl) => (
                          <option key={pl._id} value={pl._id}>{pl.name}</option>
                        ))}
                      </select>
                      <input className={c.input} placeholder="챔피언" value={p.champion} onChange={(e) => updateParticipant(i, "champion", e.target.value)} style={{ fontSize: "13px" }} />
                      <input className={c.input} type="number" placeholder="K" min={0} value={p.kills} onChange={(e) => updateParticipant(i, "kills", parseInt(e.target.value) || 0)} style={{ textAlign: "center" }} />
                      <input className={c.input} type="number" placeholder="D" min={0} value={p.deaths} onChange={(e) => updateParticipant(i, "deaths", parseInt(e.target.value) || 0)} style={{ textAlign: "center" }} />
                      <input className={c.input} type="number" placeholder="A" min={0} value={p.assists} onChange={(e) => updateParticipant(i, "assists", parseInt(e.target.value) || 0)} style={{ textAlign: "center" }} />
                      <input className={c.input} type="number" placeholder="CS" min={0} value={p.cs} onChange={(e) => updateParticipant(i, "cs", parseInt(e.target.value) || 0)} style={{ textAlign: "center" }} />
                      <button type="button" className={`${c.btn} ${c.btnDanger}`} style={{ padding: "6px 8px", fontSize: "12px" }} onClick={() => removeParticipant(i)}>✕</button>
                    </div>
                  ))}
                  <div style={{ display: "grid", gridTemplateColumns: "180px 80px 40px 40px 40px 60px 40px", gap: "6px" }}>
                    <div style={{ fontSize: "11px", color: "#64748b", padding: "0 12px" }}>플레이어</div>
                    <div style={{ fontSize: "11px", color: "#64748b", padding: "0 12px" }}>챔피언</div>
                    <div style={{ fontSize: "11px", color: "#64748b", textAlign: "center" }}>킬</div>
                    <div style={{ fontSize: "11px", color: "#64748b", textAlign: "center" }}>데스</div>
                    <div style={{ fontSize: "11px", color: "#64748b", textAlign: "center" }}>어시</div>
                    <div style={{ fontSize: "11px", color: "#64748b", textAlign: "center" }}>CS</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <button type="button" className={`${c.btn} ${c.btnGhost}`} onClick={() => router.back()}>
            취소
          </button>
          <button type="submit" className={`${c.btn} ${c.btnPrimary}`} disabled={submitting}>
            {submitting ? "저장 중..." : "경기 저장"}
          </button>
        </div>
      </form>
    </div>
  );
}
