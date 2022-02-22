import React from "react";
import ResourceTile from "./resourceTile";
import { getRowsData } from "../utils/boardHelper";
import "./styles/hexagon.css"

function HexagonBoard() {
    const rowsData = getRowsData();
    console.log(rowsData)

    return (
        <div>
            <div id="row0" className="row">
                {rowsData.row0.map((type, key) => {
                    return <ResourceTile key={key} resourceType={type} />
                })}
            </div><br />
            <div id="row1" className="row">
                {rowsData.row1.map((type, key) => {
                    return <ResourceTile key={key} resourceType={type} />
                })}
            </div><br />
            <div id="row2" className="row">
                {rowsData.row2.map((type, key) => {
                    return <ResourceTile key={key} resourceType={type} />
                })}
            </div><br />
            <div id="row3" className="row">
                {rowsData.row3.map((type, key) => {
                    return <ResourceTile key={key} resourceType={type} />
                })}
            </div><br />
            <div id="row5" className="row">
                {rowsData.row4.map((type, key) => {
                    return <ResourceTile key={key} resourceType={type} />
                })}
            </div><br />
        </div>
    )

}


export default HexagonBoard;