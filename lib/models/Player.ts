import mongoose, { Schema, model, models } from "mongoose";

export interface IPlayer {
  _id?: mongoose.Types.ObjectId;
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
  createdAt?: Date;
}

const PlayerSchema = new Schema<IPlayer>(
  {
    name: { type: String, required: true },
    riotId: { type: String, required: true, unique: true },
    tag: { type: String, required: true },
    tier: { type: String, default: "UNRANKED" },
    rank: { type: String, default: "" },
    lp: { type: Number, default: 0 },
    elo: { type: Number, default: 1000 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    mainPosition: { type: String, default: "FILL" },
  },
  { timestamps: true }
);

export const Player = models.Player || model<IPlayer>("Player", PlayerSchema);
