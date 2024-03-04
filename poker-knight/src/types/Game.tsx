// types

export type Player = {
  id: string;
  name: string;
  money: number;
  avatarUri?: string;
  currentTurn: boolean;
  currentHand?: Card[];
};

export type Game = {
  id: string;
  players: Player[];
  potSize: number;
  playerCount: number;
};

export type Card = {};
