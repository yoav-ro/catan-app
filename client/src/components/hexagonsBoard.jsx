import React from "react";
import ResourceTile from "./resourceTile/resourceTile";
import { getRowsData } from "../utils/boardHelper";
import "./styles/hexagon.css"

function HexagonBoard() {
    const rowsData = getRowsData();
    const { row0, row1, row2, row3, row4 } = rowsData;
    console.log(rowsData)

    return (
        <div id="board">
            <svg height={1080} width={1920}>
                <ResourceTile tileNumber={row0[0].number} resource={row0[0].resource} row={0} cell={0} />
                <ResourceTile tileNumber={row0[1].number} resource={row0[1].resource} row={0} cell={1} />
                <ResourceTile tileNumber={row0[2].number} resource={row0[2].resource} row={0} cell={2} />

                <ResourceTile tileNumber={row1[0].number} resource={row1[0].resource} row={1} cell={0} />
                <ResourceTile tileNumber={row1[1].number} resource={row1[1].resource} row={1} cell={1} />
                <ResourceTile tileNumber={row1[2].number} resource={row1[2].resource} row={1} cell={2} />
                <ResourceTile tileNumber={row1[3].number} resource={row1[3].resource} row={1} cell={3} />

                <ResourceTile tileNumber={row2[0].number} resource={row2[0].resource} row={2} cell={0} />
                <ResourceTile tileNumber={row2[1].number} resource={row2[1].resource} row={2} cell={1} />
                <ResourceTile tileNumber={row2[2].number} resource={row2[2].resource} row={2} cell={2} />
                <ResourceTile tileNumber={row2[3].number} resource={row2[3].resource} row={2} cell={3} />
                <ResourceTile tileNumber={row2[4].number} resource={row2[4].resource} row={2} cell={4} />

                <ResourceTile tileNumber={row3[0].number} resource={row3[0].resource} row={3} cell={0} />
                <ResourceTile tileNumber={row3[1].number} resource={row3[1].resource} row={3} cell={1} />
                <ResourceTile tileNumber={row3[2].number} resource={row3[2].resource} row={3} cell={2} />
                <ResourceTile tileNumber={row3[3].number} resource={row3[3].resource} row={3} cell={3} />

                <ResourceTile tileNumber={row4[0].number} resource={row4[0].resource} row={4} cell={0} />
                <ResourceTile tileNumber={row4[1].number} resource={row4[1].resource} row={4} cell={1} />
                <ResourceTile tileNumber={row4[2].number} resource={row4[2].resource} row={4} cell={2} />
            </svg>
        </div>
    )
}

export default HexagonBoard;