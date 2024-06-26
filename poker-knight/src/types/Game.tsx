// types

export type Player = {
  id: string | undefined;
  name: string;
  money: number;
  allInFg: boolean;
  avatarUri?: string;
  currentTurn: boolean;
  isLittleBlind: boolean;
  isBigBlind: boolean;
  isRoundWinner: boolean;
  lastBet: number;
  foldFG: boolean;
  playerCards: string[];
  splitPotVal: number;
  eliminated: boolean;
  lastTurnCheckFG: boolean;
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
  checkCounter: number;
  gameStarted: boolean;
  riverCards: string[];
  deckCards: string[];
  curBettingRound: number;
  roundCount: number;
  gameWon: boolean;
};
