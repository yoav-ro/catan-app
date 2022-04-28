import React, { useState } from "react";
import { Button } from "react-bootstrap";
import DiceRoller from "../modals/diceRoller";
import { rollDiceDir } from "../../utils/directiveCreator";
import { useSelector } from "react-redux";

function RollDiceBtn({ gameSocketRef }) {
    const gameData = useSelector(state => state.gameReducer);
    const currPlayer = useSelector(state => state.playerReducer);
    const players = gameData.game.game.players;

    const player = players.find(player => player.playerName.username === currPlayer);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    const handleClick = () => {
        const directive = rollDiceDir(player.color);
        gameSocketRef.current.emit("newDirective", { directive: directive });
        // gameSocketRef.current.on("game-data", data => {
        //     if (data.message.includes("has rolled")) {

        //     }
        // })
    }

    return (
        <>
            <Button onClick={handleClick}>Roll Dice</Button>
            {/* <DiceRoller gameSocketRef={gameSocketRef} show={show} handleClose={handleClose} number={7} /> */}
        </>
    )
}

export default RollDiceBtn;