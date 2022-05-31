import React from "react";
import HexagonBoard from "./hexagonsBoard";
import MainNav from "./navbar";
import { useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import Chat from "./chat";
import PlayerDeck from "../playerDeck/playerDeck";
import Opponents from "./opponents";
import MainEventComp from "../events/mainActionComp";

function GameTab({ gameSocketRef }) {
    const gameData = useSelector(state => state.gameReducer);
    const currPlayer = useSelector(state => state.playerReducer);

    if (gameData.game !== "none") {
        const players = gameData.game.game.players;
        const currPlayerIndex = players.findIndex(player => player.playerName.username === currPlayer);
        const mockPlayers = players.slice();
        mockPlayers.splice(currPlayerIndex, 1);

        return (
            <div>
                <MainNav />
                <Opponents playersData={mockPlayers} gameData={gameData.game.game} />
                <Chat gameData={gameData.game.game} />
                <HexagonBoard boardData={gameData.game.game.board} gameSocketRef={gameSocketRef} />
                <PlayerDeck playerData={players[currPlayerIndex]} gameData={gameData.game.game} gameSocketRef={gameSocketRef} />
                <MainEventComp gameSocketRef={gameSocketRef} />
            </div>
        )
    }
    return (
        <div>
            <MainNav />
            <Container>
                <h3>
                    No ongoing game!
                </h3>
                <p>Please head to the home page to queue for a new game.</p>
            </Container>
        </div>

    )

}

export default GameTab;