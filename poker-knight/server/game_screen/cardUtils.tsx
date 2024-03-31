import { Game } from "../../src/types/Game";

export const dealRiverCards = (game: Game) => { // Function to deal river cards, removing them from deck
    const riverCards: string[] = [];

    while (riverCards.length < 5) {
        const randomIndex = Math.floor(Math.random() * game.deckCards.length);
        const randomCard = game.deckCards.splice(randomIndex, 1)[0];
        if (!game.riverCards.includes(randomCard)) {
            riverCards.push(randomCard);
        }
    }
    riverCards.sort((a, b) => a.localeCompare(b));
    game.riverCards = riverCards;
}

export const dealPlayerCards = (game: Game) => { // Function to deal player cards, removing them from deck
    game.players.forEach((player) => {
        player.playerCards = [];
        while (player.playerCards.length < 2) {
            const randomIndex = Math.floor(Math.random() * game.deckCards.length);
            const randomCard = game.deckCards.splice(randomIndex, 1)[0];
            player.playerCards.push(randomCard);
        }
        player.playerCards.sort((a, b) => a.localeCompare(b));
    });
}

export const resetCards = (game: Game) => { // Remove all cards from river and players, return to deck
    game.riverCards = Array(5).fill("back");
    game.players.forEach((player) => {
        player.playerCards = Array(2).fill("back");
    });
    game.deckCards = [...game.deckCards, ...game.riverCards, ...game.players.flatMap(player => player.playerCards)];
    game.deckCards.sort((a, b) => a.localeCompare(b));
}