"use client";

import { useEffect, useState } from "react";
import * as d from "../dashboard.css";

interface IngamePlayer {
  playerId: string;
  playerName: string;
  champion: string;
  gameMode: string;
  gameLength: number;
}

function formatTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function IngameWidget() {
  const [ingame, setIngame] = useState<IngamePlayer[]>([]);

  async function fetchIngame() {
    try {
      const res = await fetch("/api/ingame");
      const data = await res.json();
      setIngame(data);
    } catch {}
  }

  useEffect(() => {
    fetchIngame();
    const timer = setInterval(fetchIngame, 30000); // 30초마다 갱신
    return () => clearInterval(timer);
  }, []);

  if (ingame.length === 0) return null;

  return (
    <div className={d.ingameSection}>
      <div className={d.ingameTitle}>
        <span className={d.ingameDot} />
        현재 게임 중 ({ingame.length}명)
      </div>
      {ingame.map((p) => (
        <div key={p.playerId} className={d.ingameCard}>
          <div>
            <div className={d.ingameName}>{p.playerName}</div>
            <div className={d.ingameChamp}>{p.champion} · {p.gameMode}</div>
          </div>
          <div className={d.ingameTime}>{formatTime(p.gameLength)}</div>
        </div>
      ))}
    </div>
  );
}
