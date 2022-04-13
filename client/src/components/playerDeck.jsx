import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { resourcesTypes } from "../utils/constants";
import "./styles/playerDeck.css";

function PlayerDeck({ playerData }) {
    const playerName = playerData.playerName.username;
    const { color, points, resources, devCards, settelmentsLeft, roadsLeft, citiesLeft, settelments, cities, roads } = playerData;

    const woodCount = resources.filter(item => item === resourcesTypes.WOOD.name).length;
    const sheepCount = resources.filter(item => item === resourcesTypes.SHEEP.name).length;
    const ironCount = resources.filter(item => item === resourcesTypes.IRON.name).length;
    const brickCount = resources.filter(item => item === resourcesTypes.BRICK.name).length;
    const wheatCount = resources.filter(item => item === resourcesTypes.WHEAT.name).length;

    const knightCards = devCards.filter(item => item.name === "Knight");
    const roadBuildingCards = devCards.filter(item => item.name === "Road Building");
    const monopolyCards = devCards.filter(item => item.name === "Monopoly");
    const yearOfPlentyCards = devCards.filter(item => item.name === "Year of Plenty");
    const victoryPointCards = devCards.filter(item => item.name === "Victory Point");

    const activeKnights = knightCards.filter(item => item.isUsed === true).length;
    const activeRoadBuildingCards = roadBuildingCards.filter(item => item.isUsed === true).length;
    const activeMonopolyCards = monopolyCards.filter(item => item.isUsed === true).length;
    const activeYearOfPlentyCards = yearOfPlentyCards.filter(item => item.isUsed === true).length;
    const activeVictoryPointCards = victoryPointCards.filter(item => item.isUsed === true).length;

    return (
        <div className="playerDeck">
            <Container style={{ marginBottom: "10px" }}>
                <Row className="topRow">
                    <Col>
                        <h3 style={{ color: color, float: "left" }}>{playerName} ({color})</h3>
                    </Col>
                    <Col>
                        <h3 style={{ color: color, float: "right" }}>Points: {points}</h3>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h5>Resources:</h5>
                        <div className="resource" style={{ color: resourcesTypes.WOOD.color }}>Wood: {woodCount}</div>
                        <div className="resource" style={{ color: resourcesTypes.BRICK.color }}>Brick: {brickCount}</div>
                        <div className="resource" style={{ color: resourcesTypes.SHEEP.color }}>Sheep: {sheepCount}</div>
                        <div className="resource" style={{ color: resourcesTypes.IRON.color }}>Iron: {ironCount}</div>
                        <div className="resource" style={{ color: resourcesTypes.WHEAT.color }}>Wheat: {wheatCount}</div>
                    </Col>
                    <Col>
                        <h5>Pieces:</h5>
                        <div>Settelments: {settelments.length} ({settelmentsLeft} left)</div>
                        <div>Roads: {roads.length} ({roadsLeft} left)</div>
                        <div>Cities: {cities.length} ({citiesLeft} left)</div>
                    </Col>
                    <Col>
                        <h5>Development cards:</h5>
                        <div>Knight: {knightCards.length - activeKnights} ({activeKnights} used)</div>
                        <div>Monopoly: {monopolyCards.length - activeMonopolyCards} ({activeMonopolyCards} used)</div>
                        <div>Road building: {roadBuildingCards.length - activeRoadBuildingCards} ({activeRoadBuildingCards} used)</div>
                        <div>Year of plenty: {yearOfPlentyCards.length - activeYearOfPlentyCards} ({activeYearOfPlentyCards} used)</div>
                        <div>Victory point: {victoryPointCards.length - activeVictoryPointCards} ({activeVictoryPointCards} used)</div>

                    </Col>
                    <Col>
                        <h5>Actions:</h5>
                        <div>Roll Dice</div>
                        <div>Activate dev card</div>
                        <div>Offer a trade</div>
                        <div>end turn</div>
                    </Col>
                </Row>
            </Container >
        </div >
    )
}

export default PlayerDeck;