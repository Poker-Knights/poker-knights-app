import { Socket } from "socket.io";
import { Game } from "../../src/types/Game";
import { handleInitializePlayersforGame } from "./handleStartGame";

export const handleStartRound =
  (Socket: Socket, games: { [key: string]: Game }) => (inputGameID: string) => {
    // Find the game with the given ID
    const game = games[inputGameID];

    // Assign the first player as little blind and second player as big blind
    let players = game.players;

    // call function to 'give' players their cards here

    // every players current bet is -1
    players.forEach((player) => {
      player.lastBet = -1;
    });

    // make the player after the big blind the current player
    game.currentPlayer = game.curBigBlind + 1;
    players[game.currentPlayer - 1].currentTurn = true;

    // set players equal to game players
    game.players = players;

    // emit the updated game
    Socket.emit("startBettingRound", game);
    return;
  };
