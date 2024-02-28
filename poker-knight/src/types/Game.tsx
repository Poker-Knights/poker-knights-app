// types/Game.tsx

import { Player } from "./Player";

export type Game = {
  id: string;
  players: Player[];
  potSize: number;
};
