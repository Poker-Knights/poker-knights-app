// types/Player.tsx

export type Player = {
  id: string;
  name: string;
  money: number;
  avatarUri?: string; // URL or local path for the player's avatar
  currentTurn: boolean;
};
