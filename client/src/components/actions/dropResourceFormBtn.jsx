import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import DropResourcesModal from "../modals/dropResourceEvent";


function DropResourcesBtn({ gameSocketRef }) {
    const currPlayer = useSelector(state => state.playerReducer);
    const gameData = useSelector(state => state.gameReducer);
    const players = gameData.game.game.players;
    const player = players.find(player => player.playerName.username === currPlayer);

    const isBtnEnabled = !gameData.game.game.droppingPlayers.some(dropper => dropper.color === player.color)
    const [show, setShow] = useState(false);

    const handleClick = () => {
        setShow(true);
    }

    const handleClose = () => setShow(false);

    return (
        <>
            <Button disabled={isBtnEnabled} onClick={handleClick}>Drop Resources</Button>
            <DropResourcesModal show={show} handleClose={handleClose} gameSocketRef={gameSocketRef} />
        </>
    )
}

export default DropResourcesBtn;