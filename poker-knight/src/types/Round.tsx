//Round of poker class
import { Player } from "./Player";

export class Round {
  //Round Attributes
  littleBlind: Player; //Little Blind
  bigBlind: Player; //Big Blind
  pot: number = 0; //Pot

  constructor(littleBlind: Player, bigBlind: Player) {
    //Assign the blinds before each round
    this.littleBlind = littleBlind;
    this.bigBlind = bigBlind;
  }
}
