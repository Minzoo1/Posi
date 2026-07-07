import mongoose, { Schema, model, models } from "mongoose";

export interface IChampionMastery {
  championId: number;
  championName: string;
  championKey: string;
  championLevel: number;
  championPoints: number;
}

export interface IPlayer {
  _id?: mongoose.Types.ObjectId;
  name: string;
  riotId: string;
  tag: string;
  puuid: string;
  tier: string;
  rank: string;
  lp: number;
  elo: number;
  wins: number;
  losses: number;
  mainPosition: string;
  topChampions: IChampionMastery[];
  recentWins: number;
  recentLosses: number;
  createdAt?: Date;
}

const ChampionMasterySchema = new Schema<IChampionMastery>({
  championId: Number,
  championName: String,
  championKey: { type: String, default: "" },
  championLevel: Number,
  championPoints: Number,
}, { _id: false });

const PlayerSchema = new Schema<IPlayer>(
  {
    name: { type: String, required: true },
    riotId: { type: String, required: true, unique: true },
    tag: { type: String, required: true },
    puuid: { type: String, default: "" },
    tier: { type: String, default: "UNRANKED" },
    rank: { type: String, default: "" },
    lp: { type: Number, default: 0 },
    elo: { type: Number, default: 1000 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    mainPosition: { type: String, default: "FILL" },
    topChampions: { type: [ChampionMasterySchema], default: [] },
    recentWins: { type: Number, default: 0 },
    recentLosses: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Player = models.Player || model<IPlayer>("Player", PlayerSchema);
