import mongoose, { Schema, model, models } from "mongoose";

export interface IParticipant {
  playerId: mongoose.Types.ObjectId;
  playerName: string;
  team: "blue" | "red";
  champion: string;
  position: string;
  kills: number;
  deaths: number;
  assists: number;
  cs: number;
  gold: number;
  vision: number;
  damage: number;
  eloChange: number;
}

export interface IMatch {
  _id?: mongoose.Types.ObjectId;
  date: Date;
  duration: number;
  winner: "blue" | "red";
  blueTeamName: string;
  redTeamName: string;
  note: string;
  participants: IParticipant[];
  createdAt?: Date;
}

const ParticipantSchema = new Schema<IParticipant>({
  playerId: { type: Schema.Types.ObjectId, ref: "Player", required: true },
  playerName: { type: String, required: true },
  team: { type: String, enum: ["blue", "red"], required: true },
  champion: { type: String, default: "" },
  position: { type: String, default: "" },
  kills: { type: Number, default: 0 },
  deaths: { type: Number, default: 0 },
  assists: { type: Number, default: 0 },
  cs: { type: Number, default: 0 },
  gold: { type: Number, default: 0 },
  vision: { type: Number, default: 0 },
  damage: { type: Number, default: 0 },
  eloChange: { type: Number, default: 0 },
});

const MatchSchema = new Schema<IMatch>(
  {
    date: { type: Date, default: Date.now },
    duration: { type: Number, default: 0 },
    winner: { type: String, enum: ["blue", "red"], required: true },
    blueTeamName: { type: String, default: "블루팀" },
    redTeamName: { type: String, default: "레드팀" },
    note: { type: String, default: "" },
    participants: [ParticipantSchema],
  },
  { timestamps: true }
);

export const Match = models.Match || model<IMatch>("Match", MatchSchema);
