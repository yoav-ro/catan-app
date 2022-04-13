import React from "react";
import HexagonBoard from "./hexagonsBoard";
import MainNav from "./navbar";
import { useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import PlayerDeck from "./playerDeck";

function GameTab() {
    const gameData = useSelector(state => state.gameReducer);
    const currPlayer = useSelector(state => state.playerReducer);
    console.log(gameData.game.game)
    if (gameData.game !== "none") {
        const players = gameData.game.game.players;
        const currPlayerObj = players.find(player => player.playerName.username === currPlayer);
        
        return (
            <div>
                <MainNav />
                <HexagonBoard boardData={gameData.game.game.board} />
                <PlayerDeck playerData={currPlayerObj}/>
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