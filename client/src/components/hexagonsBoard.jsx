import React from "react";
import ResourceTile from "./resourceTile/resourceTile";
import "./styles/hexagon.css"
import Road from "./resourceTile/road";
import Port from "./boardPieces/port";
import City from "./boardPieces/city";
import Settlement from "./boardPieces/settlement";
import "./styles/board.css";

function HexagonBoard({ boardData: board, gameSocketRef }) {
    return (
        <div id="board" className="center">
            <svg height={625} width={673.2177826} className="centerSvg">
                {board.tiles.map((tile, key) => {
                    return <ResourceTile
                        gameSocketRef={gameSocketRef}
                        key={key}
                        number={tile.number}
                        resource={tile.resource}
                        coordinates={tile.coordinates}
                        robber={tile.isRobber}
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
                {board.builtJunctions.map((junction, key) => {
                    if (junction.type === "city") {
                        return <City key={key} centerX={junction.x} centerY={junction.y} color={junction.player} />
                    }
                    if (junction.type === "settelment") {
                        return <Settlement key={key} centerX={junction.x} centerY={junction.y} color={junction.player} />
                    }
                })}
                <Port x={155} y={15.5} type={board.portsData[8].type} junctionA={board.portsData[8].junctionA} junctionB={board.portsData[8].junctionB} scale={0.06} />
                <Port x={360} y={15.5} type={board.portsData[7].type} junctionA={board.portsData[7].junctionA} junctionB={board.portsData[7].junctionB} scale={0.06} />
                <Port x={537} y={122} type={board.portsData[6].type} junctionA={board.portsData[6].junctionA} junctionB={board.portsData[6].junctionB} scale={0.06} />
                <Port x={639} y={295} type={board.portsData[5].type} junctionA={board.portsData[5].junctionA} junctionB={board.portsData[5].junctionB} scale={0.06} />
                <Port x={538} y={465} type={board.portsData[4].type} junctionA={board.portsData[4].junctionA} junctionB={board.portsData[4].junctionB} scale={0.06} />
                <Port x={355} y={571} type={board.portsData[3].type} junctionA={board.portsData[3].junctionA} junctionB={board.portsData[3].junctionB} scale={0.06} />
                <Port x={161} y={571} type={board.portsData[2].type} junctionA={board.portsData[2].junctionA} junctionB={board.portsData[2].junctionB} scale={0.06} />
                <Port x={60} y={398} type={board.portsData[1].type} junctionA={board.portsData[1].junctionA} junctionB={board.portsData[1].junctionB} scale={0.06} />
                <Port x={60} y={188} type={board.portsData[0].type} junctionA={board.portsData[0].junctionA} junctionB={board.portsData[0].junctionB} scale={0.06} />
            </svg>
        </div>
    )
}

export default HexagonBoard;