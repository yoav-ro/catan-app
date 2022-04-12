import React from "react";
import ResourceTile from "./resourceTile/resourceTile";
import { useSelector } from "react-redux";
import "./styles/hexagon.css"
import Road from "./resourceTile/road";
import { Container } from "react-bootstrap";
import Port from "./boardPieces/port";
import "./styles/board.css";

function HexagonBoard() {
    const gameData = useSelector(state => state.gameReducer);
    console.log(gameData)
    if (gameData.game !== "none") {
        const board = gameData.game.game.board;
        return (
            <div id="board" className="center">
                <svg height={625} width={673.2177826} className="centerSvg">
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
    return (
        <Container>
            <h3>
                No ongoing game!
            </h3>
            <p>Please head to the home page to queue for a new game.</p>
        </Container>
    )
}

export default HexagonBoard;