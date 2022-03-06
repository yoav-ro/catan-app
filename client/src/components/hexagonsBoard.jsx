import React from "react";
import ResourceTile from "./resourceTile/resourceTile";
import { getRowsData } from "../utils/boardHelper";
import "./styles/hexagon.css"

function HexagonBoard() {
    const rowsData = getRowsData();
    console.log(rowsData)

    const initX = 151.5;
    const initY = 48.5;

    return (
        <div id="board">
            {/* <svg height={1080} width={1920}> */}
            <div id="row0" className="row">
                {rowsData.row0.map((data, key) => {
                    console.log(data.number)
                    return <ResourceTile key={key} test={"wtf"} tileNumber={data.number} resource={data.resource} row={1} cell={key + 1} />
                })}
            </div><br />
            <div id="row1" className="row">
                {rowsData.row1.map((data, key) => {
                    return <ResourceTile key={key} tileNumber={data.number} resource={data.resource} row={2} cell={key + 1} />
                })}
            </div><br />
            <div id="row2" className="row">
                {rowsData.row2.map((data, key) => {
                    return <ResourceTile key={key} tileNumber={data.number} resource={data.resource} row={3} cell={key + 1} />
                })}
            </div><br />
            <div id="row3" className="row">
                {rowsData.row3.map((data, key) => {
                    return <ResourceTile key={key} tileNumber={data.number} resource={data.resource} row={4} cell={key + 1} />
                })}
            </div><br />
            <div id="row5" className="row">
                {rowsData.row4.map((data, key) => {
                    return <ResourceTile key={key} tileNumber={data.number} resource={data.resource} row={5} cell={key + 1} />
                })}
            </div><br />
            {/* </svg> */}
        </div>
    )

}


export default HexagonBoard;