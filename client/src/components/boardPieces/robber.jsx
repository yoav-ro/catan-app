import React from "react";
import { NotificationManager } from "react-notifications";
import { useSelector } from "react-redux";
import { directiveTypes, resourcesTypes } from "../../utils/constants";

function Robber({ tileCX, tileCY, shouldRender, resourceType }) {
    const opacity = resourceType === resourcesTypes.DESERT ? 0.6 : 1;
    const currPlayer = useSelector(state => state.playerReducer);
    const gameData = useSelector(state => state.gameReducer);
    const players = gameData.game.game.players;

    const player = players.find(player => player.playerName.username === currPlayer);
    const isCurrPlayerTurn = gameData.game.game.player[0] === currPlayer;
    const canRobb = gameData.game.game.directiveExpectation.includes(directiveTypes.robbPlayer) && isCurrPlayerTurn;


    const handleClick = () => {
        if (canRobb) {
            NotificationManager.info("Move the robber to the desired tile by clicking it");
            //Move robber
        }
    }

    if (!shouldRender) {
        return (
            <></>
        )
    }

    return (
        <g onClick={handleClick}>
            <circle cx={tileCX} cy={tileCY - 15} r={8} opacity={opacity} />
            <ellipse cx={tileCX} cy={tileCY + 3} rx={10} ry={17} opacity={opacity} />
            <rect x={tileCX - 11} y={tileCY + 13} width={22} height={8} opacity={opacity} />
        </g>
    )
}

export default Robber;