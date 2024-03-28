// types

export type Player = {
  id: string | undefined;
  name: string;
  money: number;
  allInFg: boolean;
  avatarUri?: string;
  currentTurn: boolean;
  isBigBlind: boolean;
  isSmallBlind: boolean;
  lastBet: number;
  foldFG: boolean;

};

export type Game = {
  id: string;
  hostPlayer: string;
  players: Player[];
  curLittleBlind: number;
  curBigBlind: number;
  littleBlindBet: number;
  bigBlindBet: number;
  potSize: number;
  playerCount: number;
  currentBet: number;
  currentPlayer: number;
  gameStarted: boolean;
};
