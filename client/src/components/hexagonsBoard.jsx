import React from "react";
import ResourceTile from "./resourceTile/resourceTile";
import { useSelector } from "react-redux";
import "./styles/hexagon.css"
import Road from "./resourceTile/road";

function HexagonBoard() {
    const gameData = useSelector(state => state.gameReducer);
    const board = gameData.game.board;
    console.log(board)
    if (board) {
        return (
            <div id="board">
                <svg height={1080} width={1920}>
                    {board.tiles.map((tile, key) => {
                        return <ResourceTile
                            key={key}
                            number={tile.number}
                            resource={tile.resource}
                            coordinates={tile.coordinates}
                            robber={tile.isRobber}
                            junctions={tile.surroundingJunctions}
                        />
                    })}
                    {board.roads.map((road, key) => {
                        return <Road
                            key={key}
                            x1={road.startX}
                            y1={road.startY}
                            x2={road.endX}
                            y2={road.endY}
                            player={road.player}
                        />
                    })}
                </svg>
            </div>
        )
    }
    return (
        <></>
    )
}

export default HexagonBoard;