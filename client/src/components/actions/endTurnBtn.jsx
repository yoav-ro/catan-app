import React from "react";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { endTurnDir } from "../../utils/directiveCreator";

function EndTurnBtn({ gameSocketRef }) {
    const gameData = useSelector(state => state.gameReducer);
    const currPlayer = useSelector(state => state.playerReducer);
    const players = gameData.game.game.players;

    const player = players.find(player => player.playerName.username === currPlayer);


    const handleClick = () => {
        const directive = endTurnDir(player.color);
        gameSocketRef.current.emit("newDirective", { directive: directive });
    }

    return (
        <>
            <Button onClick={handleClick} variant="warning">End Turn</Button>
        </>
    )
}

export default EndTurnBtn;