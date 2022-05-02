import React, { useState } from "react";
import BuildCity from "../modals/buildCity";
import SvgHouse from "./svgHouse";
import { useSelector } from "react-redux";

function Settlement({ color, centerX, centerY, gameSocketRef }) {
    const gameData = useSelector(state => state.gameReducer);
    const currPlayer = useSelector(state => state.playerReducer);
    const players = gameData.game.game.players;

    const player = players.find(player => player.playerName.username === currPlayer);

    const [scale, setScale] = useState(1);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    const handleHoverIn = () => {
        setScale(1.3);
    }

    const handleHoverOut = () => {
        setScale(1);
    }

    const biggerHouseCoords = {
        centerX: centerX,
        centerY: centerY
    }

    const handleClick = () => {
        if(player.color===color){
            setShow(true);
        }
    }

    return (
        <>
            <g onMouseEnter={handleHoverIn} onMouseLeave={handleHoverOut} onClick={handleClick}>
                <SvgHouse centerX={biggerHouseCoords.centerX} centerY={biggerHouseCoords.centerY} scale={1 * scale} color={color} />
            </g>
            <BuildCity x={centerX} y={centerY} show={show} handleClose={handleClose} gameSocketRef={gameSocketRef} />
        </>

    )
}

export default Settlement;