import React from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import HexagonBoard from "./hexagonsBoard";
import MainNav from "./navbar";

function GameTab() {
    const gameData = useSelector(state => state.gameReducer);

    if (gameData.game !== "none") {
        return (
            <div>
                <MainNav />
                <HexagonBoard />
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