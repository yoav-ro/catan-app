import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import LargestArmyIcon from "../icons/largestArmyIcon";
import LongestRoadIcon from "../icons/longestRoadIcon";
import "../styles/playerDeck.css";

function Opponents({ playersData, gameData }) {
    return (
        <div className="opponentsTab">
            <Container>
                <Row>
                    Opponents:
                </Row>
                {playersData.map((player, key) => {
                    const playerName = player.playerName.username;
                    const { color, resources, playerDevCards } = player;
                    const usedDevCards = playerDevCards.filter(card => card.isUsed);
                    console.log(gameData)
                    const knightCards = usedDevCards.filter(item => item.name === "Knight");
                    const roadBuildingCards = usedDevCards.filter(item => item.name === "Road Building");
                    const monopolyCards = usedDevCards.filter(item => item.name === "Monopoly");
                    const yearOfPlentyCards = usedDevCards.filter(item => item.name === "Year of Plenty");

                    return (
                        <Row key={key} className="opponent">
                            <Row>
                                <Col>
                                    <h4 className="playerHeader" style={{ color: color }}>{playerName} ({color})</h4>
                                </Col>
                                <Col>
                                    <LongestRoadIcon playerColor={color} longestRoadPlayer={gameData.longestRoadPlayer} />
                                    <LargestArmyIcon playerColor={color} largestArmyPlayer={gameData.largestArmyPlayer} />
                                </Col>
                            </Row>
                            <div>Resources: {resources.length}</div>
                            <div>Unused development cards: {playerDevCards.length - usedDevCards.length}</div>
                            <div>Development cards:</div>
                            <Container>
                                <Row>
                                    <Col>
                                        Knight: {knightCards.length}
                                    </Col>
                                    <Col>
                                        Monopoly: {monopolyCards.length}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        Year of Plenty: {yearOfPlentyCards.length}
                                    </Col>
                                    <Col>
                                        Road building: {roadBuildingCards.length}
                                    </Col>
                                </Row>
                            </Container>
                            <br /><br /><br />
                        </Row>
                    )
                })}
            </Container>

        </div>
    )
}

export default Opponents;