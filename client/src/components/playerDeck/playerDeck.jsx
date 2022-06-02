import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { resourcesTypes } from "../../utils/constants";
import ActionsDeck from "./actionsTab";
import LongestRoadIcon from "../icons/longestRoadIcon";
import LargestArmyIcon from "../icons/largestArmyIcon";
import "../styles/playerDeck.css";

function PlayerDeck({ playerData, gameData, gameSocketRef }) {
    const playerName = playerData.playerName.username;
    const { color, points, resources, playerDevCards, settlementsLeft, roadsLeft, citiesLeft, settlements, cities, roads } = playerData;
    const woodCount = resources.filter(item => item === resourcesTypes.WOOD.name).length;
    const sheepCount = resources.filter(item => item === resourcesTypes.SHEEP.name).length;
    const ironCount = resources.filter(item => item === resourcesTypes.IRON.name).length;
    const brickCount = resources.filter(item => item === resourcesTypes.BRICK.name).length;
    const wheatCount = resources.filter(item => item === resourcesTypes.WHEAT.name).length;

    const knightCards = playerDevCards.filter(item => item.name === "Knight");
    const roadBuildingCards = playerDevCards.filter(item => item.name === "Road Building");
    const monopolyCards = playerDevCards.filter(item => item.name === "Monopoly");
    const yearOfPlentyCards = playerDevCards.filter(item => item.name === "Year of Plenty");
    const victoryPointCards = playerDevCards.filter(item => item.name === "Victory Point");

    const activeKnights = knightCards.filter(item => item.isUsed).length;
    const activeRoadBuildingCards = roadBuildingCards.filter(item => item.isUsed).length;
    const activeMonopolyCards = monopolyCards.filter(item => item.isUsed).length;
    const activeYearOfPlentyCards = yearOfPlentyCards.filter(item => item.isUsed).length;
    const activeVictoryPointCards = victoryPointCards.filter(item => item.isUsed).length;
    return (
        <div className="playerDeck">
            <Container style={{ marginBottom: "10px" }}>
                <Row className="topRow">
                    <Col>
                        <h3 className="playerHeader" style={{ color: color, float: "left" }}>{playerName} ({color})</h3>
                    </Col>
                    <Col>
                        <h3 className="playerHeader" style={{ color: color, float: "right" }}>Points: {points}</h3>
                        <LongestRoadIcon playerColor={color} longestRoadPlayer={gameData.longestRoadPlayer} />
                        <LargestArmyIcon playerColor={color} largestArmyPlayer={gameData.largestArmyPlayer} />
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
                        <div>Settelments: {settlements.length} ({settlementsLeft} left)</div>
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
                    <ActionsDeck gameSocketRef={gameSocketRef} />
                </Row>
            </Container >
        </div >
    )
}

export default PlayerDeck;