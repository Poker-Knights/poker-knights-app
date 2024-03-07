// types

export type Player = {
  id: string | undefined;
  name: string;
  money: number;
  avatarUri?: string;
  currentTurn: boolean;
  lastBet: number;
  fold: boolean;
  isLittleBlind: boolean;
  isBigBlind: boolean;
};

export type Game = {
  id: string;
  players: Player[];
  potSize: number;
  playerCount: number;
  currentBet: number;
  currentPlayer: number;
};
