import React from "react";
import ResourceTile from "./resourceTile/resourceTile";
import { useSelector } from "react-redux";
import "./styles/hexagon.css"

function HexagonBoard() {
    const gameData = useSelector(state => state.gameReducer);
    const board = gameData.game.board;
    console.log(board)
    if (board) {
        return (
            <div id="board">
                <svg height={1080} width={1920}>
                    {board.tiles.map((tile, key) => {
                        return <ResourceTile key={key} number={tile.number} resource={tile.resource} coordinates={tile.coordinates} />

                    })}
                </svg>
            </div>
        )
    }
    return (
        <></>
    )
}
// {/* return <ResourceTile key={key} tileNumber={tile.number} resource={tile.resource} coordinates={tile.coordinates} /> */ }

export default HexagonBoard;