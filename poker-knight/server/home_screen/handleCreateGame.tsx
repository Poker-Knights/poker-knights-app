import { Socket } from "socket.io";
import { Game } from "../../src/types/Game";
import { handleCreateAndAddPlayer } from "../game_screen/handleCreateAndAddPlayer";

export const handleCreateGame =
  (socket: Socket, games: { [key: string]: Game }) =>
  (gameID: string, username: string) => {
    // Create a new game object\
    const newGame: Game = {
      hostPlayer: username,
      id: gameID,
      players: [],
      curLittleBlind: 1,
      curBigBlind: 2,
      littleBlindBet: 10,
      bigBlindBet: 20,
      potSize: 0,
      playerCount: 0, // Will be updated when adding a player
      currentBet: 0,
      currentPlayer: 1,
      gameStarted: false,
      roundCount: 0,
      riverCards: ["back", "back", "back", "back", "back"],
      deckCards: [
        "spades_2",
        "spades_3",
        "spades_4",
        "spades_5",
        "spades_6",
        "spades_7",
        "spades_8",
        "spades_9",
        "spades_T",
        "spades_J",
        "spades_Q",
        "spades_K",
        "spades_A",
        "hearts_2",
        "hearts_3",
        "hearts_4",
        "hearts_5",
        "hearts_6",
        "hearts_7",
        "hearts_8",
        "hearts_9",
        "hearts_T",
        "hearts_J",
        "hearts_Q",
        "hearts_K",
        "hearts_A",
        "clubs_2",
        "clubs_3",
        "clubs_4",
        "clubs_5",
        "clubs_6",
        "clubs_7",
        "clubs_8",
        "clubs_9",
        "clubs_T",
        "clubs_J",
        "clubs_Q",
        "clubs_K",
        "clubs_A",
        "diamonds_2",
        "diamonds_3",
        "diamonds_4",
        "diamonds_5",
        "diamonds_6",
        "diamonds_7",
        "diamonds_8",
        "diamonds_9",
        "diamonds_T",
        "diamonds_J",
        "diamonds_Q",
        "diamonds_K",
        "diamonds_A",
      ],
      curBettingRound: 0,
    };

    // Use the utility function to create and add the new player to the game
    handleCreateAndAddPlayer(username, socket.id, newGame);

    // Store the new game in the games object
    games[gameID] = newGame;

    console.log("Server Side Creating Game");

    // Notify the creator that the game has been created successfully
    socket.emit("gameCreated", { gameState: newGame });
  };
