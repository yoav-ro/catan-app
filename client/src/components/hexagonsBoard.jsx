import React from "react";
import ResourceTile from "./resourceTile/resourceTile";
import { useSelector } from "react-redux";
import "./styles/hexagon.css"
import Road from "./resourceTile/road";
import { Container } from "react-bootstrap";
import "./styles/centerDiv.css";

function HexagonBoard() {
    const gameData = useSelector(state => state.gameReducer);

    
    console.log(gameData)
    //width 606.2177826
    if(gameData.game !== "none"){
        const board = gameData.game.game.board;
        return (
            <div id="board" className="center">
                <svg height={605} width={651.2177826} className="centerSvg">
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