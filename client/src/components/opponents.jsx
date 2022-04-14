import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { resourcesTypes } from "../utils/constants";
import "./styles/playerDeck.css";

function Opponents({ playersData }) {
    return (
        <div className="opponentsTab">
            <Container>
                <Row>
                    Opponents:
                </Row>
                {playersData.map((player, key) => {
                    const playerName = player.playerName.username;
                    const { color, points, resources, devCards, settelmentsLeft, roadsLeft, citiesLeft, settelments, cities, roads } = player;
                    const usedDevCards = devCards.filter(card => card.isUsed);

                    const knightCards = usedDevCards.filter(item => item.name === "Knight");
                    const roadBuildingCards = usedDevCards.filter(item => item.name === "Road Building");
                    const monopolyCards = usedDevCards.filter(item => item.name === "Monopoly");
                    const yearOfPlentyCards = usedDevCards.filter(item => item.name === "Year of Plenty");
                    const victoryPointCards = usedDevCards.filter(item => item.name === "Victory Point");
                    return (
                        <Row key={key} className="opponent">
                            <h4 className="playerHeader" style={{ color: color }}>{playerName} ({color})</h4>
                            <div>Resources: {resources.length}</div>
                            <div>Unused development cards: {devCards.length - usedDevCards.length}</div>
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