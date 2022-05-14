import React from "react";
import { Button } from "react-bootstrap";
import { rollDiceDir } from "../../utils/directiveCreator";
import { useSelector } from "react-redux";

function RollDiceBtn({ gameSocketRef }) {
    const gameData = useSelector(state => state.gameReducer);
    const currPlayer = useSelector(state => state.playerReducer);
    const players = gameData.game.game.players;

    const player = players.find(player => player.playerName.username === currPlayer);

    const handleClick = () => {
        const directive = rollDiceDir(player.color);
        gameSocketRef.current.emit("newDirective", { directive: directive });
    }

    return (
        <>
            <Button onClick={handleClick}>Roll Dice</Button>
        </>
    )
}

export default RollDiceBtn;