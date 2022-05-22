import React, { useState } from "react";
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from "react-redux";
import { setCanMoveRobber } from "../../actions";
import { directiveTypes, resourcesTypes } from "../../utils/constants";

function Robber({ tileCX, tileCY, shouldRender, resourceType }) {
    const [scale, setScale] = useState(1);
    const opacity = resourceType === resourcesTypes.DESERT ? 0.6 : 1;
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
            <circle cx={tileCX} cy={tileCY - 15 * scale} r={8 * scale} opacity={opacity} />
            <ellipse cx={tileCX} cy={tileCY + 3 * scale} rx={10} ry={17 * scale} opacity={opacity} />
            <rect x={tileCX - 11 * scale} y={tileCY + 13 * scale} width={22 * scale} height={8 * scale} opacity={opacity} />
        </g>
    )
}

export default Robber;