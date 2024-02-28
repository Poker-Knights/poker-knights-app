// types/Player.tsx

export type Player = {
  id: string;
  name: string;
  money: number;
  avatarUri?: string;
  currentTurn: boolean;
};
