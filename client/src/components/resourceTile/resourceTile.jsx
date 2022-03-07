import React from "react";
import { Polygon } from "react-svg-path";
import Junction from "./junction";
import "./styles/road.css"
import Road from "./road";

function Tile({ row, cell, tileNumer, resource }) {
    console.log(tileNumer)
    // const backgroundColor= getResourceBackground(resource.name);
    const radius = 70;
    const rad30 = 30 * Math.PI / 180;

    const center = {
        x: cell * radius * 2 + radius + row % 2 * radius,
        y: (row * (Math.tan(rad30) + 1) + 1) * radius,
    }
    if (row === 0 || row === 4) {
        center.x += radius * 2;
    }



    const coordinates = {
        top: { x: center.x, y: center.y + radius },
        topLeft: { x: center.x - radius, y: center.y + Math.tan(rad30) * radius },
        topRight: { x: center.x + radius, y: center.y + Math.tan(rad30) * radius },
        bottom: { x: center.x, y: center.y - radius },
        bottomLeft: { x: center.x - radius, y: center.y - Math.tan(rad30) * radius },
        bottomRight: { x: center.x + radius, y: center.y - Math.tan(rad30) * radius },
    }

    return (
        <>
            <div x={center.x} y={center.y} />
            <Polygon points={[
                [coordinates.top.x, coordinates.top.y],
                [coordinates.topRight.x, coordinates.topRight.y],
                [coordinates.bottomRight.x, coordinates.bottomRight.y],
                [coordinates.bottom.x, coordinates.bottom.y],
                [coordinates.bottomLeft.x, coordinates.bottomLeft.y],
                [coordinates.topLeft.x, coordinates.topLeft.y]
            ]} fill={resource.color}></Polygon>

            <Road x1={coordinates.top.x} y1={coordinates.top.y} x2={coordinates.topRight.x} y2={coordinates.topRight.y} />
            <Road x1={coordinates.topRight.x} y1={coordinates.topRight.y} x2={coordinates.bottomRight.x} y2={coordinates.bottomRight.y} />
            <Road x1={coordinates.bottomRight.x} y1={coordinates.bottomRight.y} x2={coordinates.bottom.x} y2={coordinates.bottom.y} />
            <Road x1={coordinates.bottom.x} y1={coordinates.bottom.y} x2={coordinates.bottomLeft.x} y2={coordinates.bottomLeft.y} />
            <Road x1={coordinates.bottomLeft.x} y1={coordinates.bottomLeft.y} x2={coordinates.topLeft.x} y2={coordinates.topLeft.y} />
            <Road x1={coordinates.topLeft.x} y1={coordinates.topLeft.y} x2={coordinates.top.x} y2={coordinates.top.y} />
            <Junction centerX={coordinates.top.x} centerY={coordinates.top.y} />
            <Junction centerX={coordinates.topLeft.x} centerY={coordinates.topLeft.y} />
            <Junction centerX={coordinates.topRight.x} centerY={coordinates.topRight.y} />
            <Junction centerX={coordinates.bottom.x} centerY={coordinates.bottom.y} />
            <Junction centerX={coordinates.bottomLeft.x} centerY={coordinates.bottomLeft.y} />
            <Junction centerX={coordinates.bottomRight.x} centerY={coordinates.bottomRight.y} />
            <circle style={{ fill: "white", stroke: "black" }} cx={center.x} cy={center.y} r="20">
            </circle>
            <text x="50%" y="50%" textAnchor="middle" strokeWidth="2px" dy=".3em">{tileNumer}</text>
        </>
    )
}

export default Tile;