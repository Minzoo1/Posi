type ChampEntry = { key: string; name: string };

export interface RiotProfile {
  tier: string;
  rank: string;
  lp: number;
  topChampions: { championId: number; championName: string; championKey: string; championLevel: number; championPoints: number }[];
  recentWins: number;
  recentLosses: number;
  riotError: string | null;
}

// champMap을 모듈 레벨에서 한 번만 빌드해서 재사용
let cachedChampMap: Map<number, { name: string; key: string }> | null = null;

export async function getChampMap(): Promise<Map<number, { name: string; key: string }>> {
  if (cachedChampMap) return cachedChampMap;
  try {
    const verRes = await fetch("https://ddragon.leagueoflegends.com/api/versions.json");
    const versions = await verRes.json();
    const version = versions[0];
    const champRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/ko_KR/champion.json`);
    const champData = await champRes.json();
    const map = new Map<number, { name: string; key: string }>();
    for (const [engKey, val] of Object.entries(champData.data as Record<string, ChampEntry>)) {
      map.set(Number(val.key), { name: val.name, key: engKey });
    }
    cachedChampMap = map;
    return map;
  } catch {
    return new Map();
  }
}

export async function fetchRiotProfile(
  puuid: string,
  apiKey: string,
  champMap?: Map<number, { name: string; key: string }>
): Promise<RiotProfile> {
  let tier = "UNRANKED";
  let rank = "";
  let lp = 0;
  let topChampions: RiotProfile["topChampions"] = [];
  let recentWins = 0;
  let recentLosses = 0;
  let riotError: string | null = null;

  try {
    const map = champMap ?? await getChampMap();

    const [rankRes, masteryRes, matchIdsRes] = await Promise.all([
      fetch(`https://kr.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`, { headers: { "X-Riot-Token": apiKey } }),
      fetch(`https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=3`, { headers: { "X-Riot-Token": apiKey } }),
      // 최근 10게임만 — 개인 키 레이트리밋(2분/100req) 초과 방지
      fetch(`https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?queue=420&count=10`, { headers: { "X-Riot-Token": apiKey } }),
    ]);

    if (rankRes.ok) {
      const ranks = await rankRes.json();
      const solo = ranks.find((r: { queueType: string }) => r.queueType === "RANKED_SOLO_5x5");
      const flex = ranks.find((r: { queueType: string }) => r.queueType === "RANKED_FLEX_SR");
      if (solo) {
        tier = solo.tier; rank = solo.rank; lp = solo.leaguePoints;
      } else if (flex) {
        tier = flex.tier; rank = flex.rank; lp = flex.leaguePoints;
        riotError = "솔로랭크 없음 — 자유랭크 티어 적용";
      } else {
        riotError = "랭크 기록 없음 (언랭)";
      }
    } else {
      riotError = `랭크 조회 실패 (${rankRes.status})`;
    }

    if (masteryRes.ok) {
      const masteries = await masteryRes.json();
      topChampions = masteries.map((m: { championId: number; championLevel: number; championPoints: number }) => {
        const info = map.get(m.championId);
        return {
          championId: m.championId,
          championName: info?.name ?? String(m.championId),
          championKey: info?.key ?? String(m.championId),
          championLevel: m.championLevel,
          championPoints: m.championPoints,
        };
      });
    }

    if (matchIdsRes.ok) {
      const matchIds: string[] = await matchIdsRes.json();
      // 10개만 순차 조회 (병렬 20개는 레이트리밋 폭탄)
      for (const id of matchIds.slice(0, 10)) {
        const r = await fetch(`https://asia.api.riotgames.com/lol/match/v5/matches/${id}`, { headers: { "X-Riot-Token": apiKey } });
        if (!r.ok) break; // 429면 즉시 중단
        const match = await r.json();
        const participant = match.info?.participants?.find((p: { puuid: string }) => p.puuid === puuid);
        if (participant) {
          if (participant.win) recentWins++; else recentLosses++;
        }
        // 경기 상세는 요청이 무거우므로 300ms 간격
        await new Promise((res) => setTimeout(res, 300));
      }
    }
  } catch (e) {
    riotError = `네트워크 오류: ${String(e)}`;
  }

  return { tier, rank, lp, topChampions, recentWins, recentLosses, riotError };
}
