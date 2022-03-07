import React from "react";
import Tile from "./resourceTile/resourceTile";
import { getRowsData } from "../utils/boardHelper";

function PlacementTest() {
    const rowsData = getRowsData();
    const topleftTile = rowsData.row0[0];
    const toprightTile = rowsData.row0[1];
    const bottomTile = rowsData.row1[0];

    return (
        <div>
            <svg height={350} width={350}>
                <Tile resource={topleftTile.resource} row={0} cell={0} />
                <Tile resource={toprightTile.resource} row={0} cell={1} />
                <Tile resource={bottomTile.resource} row={1} cell={0} />
            </svg>
        </div>
    )

}

export default PlacementTest;


