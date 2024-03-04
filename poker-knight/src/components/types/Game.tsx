// types/Game.tsx

import { Player } from "./Player";
import { Card } from "./Card";

export type Game = {
  gameId: string;
  players: Player[];
  playerCount: number;
  potSize: number;
  river: Card[];
};
