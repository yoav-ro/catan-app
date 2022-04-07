import React from "react";
import { Polygon } from "react-svg-path";
import { resourcesTypes } from "../../utils/constants";
import Junction from "./junction";
import "./styles/road.css"
import Road from "./road";

function Tile({ number, resource, coordinates }) {
    const center = {
        x: (coordinates.top.x + coordinates.bottom.x) / 2,
        y: (coordinates.top.y + coordinates.bottom.y) / 2,
    }

    let color = "";
    switch (resource) {
        case "wood":
            color = resourcesTypes.WOOD.color;
            break;
        case "brick":
            color = resourcesTypes.BRICK.color;
            break;
        case "sheep":
            color = resourcesTypes.SHEEP.color;
            break;
        case "iron":
            color = resourcesTypes.IRON.color;
            break;
        case "desert":
            color = resourcesTypes.DESERT.color;
            break;
        case "wheat":
            color = resourcesTypes.WHEAT.color;
            break;
        default:
            break;
    }

    if (number) {
        const numberPosCorrection = number.toString().length === 2 ? -8 : -4
        const numColor = (number === 6 || number === 8) ? "red" : "black"; 
        return (
            <g>
                <Polygon points={[
                    [coordinates.top.x, coordinates.top.y],
                    [coordinates.topRight.x, coordinates.topRight.y],
                    [coordinates.bottomRight.x, coordinates.bottomRight.y],
                    [coordinates.bottom.x, coordinates.bottom.y],
                    [coordinates.bottomLeft.x, coordinates.bottomLeft.y],
                    [coordinates.topLeft.x, coordinates.topLeft.y]
                ]} fill={color}></Polygon>

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
                <circle cx={center.x} cy={center.y} r="20" fill="white" stroke="black" />
                <text fill={numColor} x={center.x} y={center.y} strokeWidth="4px" fontFamily="Arial" dy=".3em" dx={numberPosCorrection}>{number}</text>
            </g>
        )
    }

    return (
        <g>
            <Polygon points={[
                [coordinates.top.x, coordinates.top.y],
                [coordinates.topRight.x, coordinates.topRight.y],
                [coordinates.bottomRight.x, coordinates.bottomRight.y],
                [coordinates.bottom.x, coordinates.bottom.y],
                [coordinates.bottomLeft.x, coordinates.bottomLeft.y],
                [coordinates.topLeft.x, coordinates.topLeft.y]
            ]} fill={color}></Polygon>

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
        </g>
    )
}

export default Tile;