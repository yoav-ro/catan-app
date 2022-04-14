import React from "react";
import { Polygon, Rect } from "react-svg-path";

function SvgHouse({ color, centerX, centerY, scale }) {
    const width = 18 * scale;
    const height = 18 * scale;

    const hatCoords = {
        left: { x: centerX - (width - scale * 3), y: centerY - (height / 2) },
        right: { x: centerX + (width - scale * 3), y: centerY - (height / 2) },
        top: { x: centerX, y: centerY - (height) }
    }

    const lineData = {
        x1: centerX + (width / 2) - 1,
        y1: centerY - (height / 2),
        x2: centerX - (width / 2) + 1,
        y2: centerY - (height / 2),
    }

    return (
        <>
            <Polygon points={[
                [hatCoords.left.x, hatCoords.left.y],
                [hatCoords.top.x, hatCoords.top.y],
                [hatCoords.right.x, hatCoords.right.y],
            ]} fill={color} strokeWidth={1.5} stroke="black">
            </Polygon>
            <Rect cx={centerX} cy={centerY} stroke="black" strokeWidth={1.5} width={width} height={height} fill={color} />
            <line x1={lineData.x1} y1={lineData.y1} x2={lineData.x2} y2={lineData.y2} stroke={color} strokeWidth={scale*5}></line>
        </>
    )
}

export default SvgHouse;