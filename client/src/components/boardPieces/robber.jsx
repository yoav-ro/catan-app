import React, { useState } from "react";
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from "react-redux";
import { setCanMoveRobber } from "../../actions";
import { directiveTypes } from "../../utils/constants";

function Robber({ tileCX, tileCY, shouldRender }) {
    const [scale, setScale] = useState(1);
    const currPlayer = useSelector(state => state.playerReducer);
    const gameData = useSelector(state => state.gameReducer);
    const players = gameData.game.game.players;
    const dispatch = useDispatch();

    const player = players.find(player => player.playerName.username === currPlayer);
    const isCurrPlayerTurn = gameData.game.game.playerOrder[0].color === player.color;
    const canRobb = gameData.game.game.directiveExpectation.includes(directiveTypes.moveRobber) && isCurrPlayerTurn;


    const handleClick = () => {
        if (canRobb) {
            NotificationManager.info("Move the robber to the desired tile by clicking it");
            dispatch(setCanMoveRobber(true));
        }
    }


    const handleMouseEnter = () => {
        if (canRobb) {
            setScale(1.3);
        }

    }
    const handleMouseLeave = () => {
        if (canRobb) {
            setScale(1);
        }
    }

    if (!shouldRender) {
        return (
            <></>
        )
    }

    return (
        <g onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick}>
            <circle cx={tileCX} cy={tileCY - 18 * scale} r={10 * scale} />
            <ellipse cx={tileCX} cy={tileCY + 5 * scale} rx={12} ry={19 * scale} />
            <rect x={tileCX - 13* scale} y={tileCY + 15 * scale} width={25 * scale} height={10 * scale} />
        </g>
    )
}

export default Robber;