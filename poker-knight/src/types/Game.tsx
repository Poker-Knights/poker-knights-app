// Object File for a Game
import { Player } from "./Player";

export class Game {
  //Class Attributes
  gameID: string = ""; //Game ID String for connections
  players: Player[] = []; //Array of Players
  numPlayers: number = 0; //Counts number of players
  gameStatus: number = 0; //Flag to check if game failed/crashed

  //Class constructor
  constructor(player: Player) {
    this.gameID = this.generateString(10); //Create Game ID
    this.players[this.numPlayers] = player; //add first player
    this.numPlayers++; //Increment number of players
  }

  //Program to generate random strings
  generateString(length: number): string {
    //Return String
    let res = "";

    // declare all characters
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      res += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    //Return String ID
    return res;
  }

  //////////////////////////////////// Game Functions ////////////////////////////////////
  //Start Game Helper function
  startGame(): boolean {
    return true;
  }

  //End Game Helper function
  endGame(): boolean {
    return true;
  }

  //Function to add new player to the game
  addPlayer(player: Player): boolean {
    //Add new player to array of players in game
    this.players[this.numPlayers] = player;
    this.numPlayers++; //Increment total number of players

    //Check for successful add
    if (this.players[this.numPlayers - 1] == player) return true;
    else return false;
  }
}
