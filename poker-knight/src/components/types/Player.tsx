// types/Player.tsx
import { Card } from "./Card";

export type Player = {
  id: string;
  name: string;
  money: number;
  avatarUri?: string;
  currentTurn: boolean;
  currentHand: Card[];
};
