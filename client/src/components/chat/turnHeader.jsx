import React from "react";
import "../styles/playerDeck.css";
import { Container, Row, Col, Button } from "react-bootstrap";
import LobbyBtn from "../general/lobbyButton";

function TurnHeader({ gameData }) {

    const isSetup = gameData.isSetupPhase;
    const winner = gameData.winner;

    if (isSetup) {
        const currTurn = gameData.setupOrder[0];
        return (
            <Container>
                <Row>
                    <Col>
                        <h4>Setup Phase</h4>
                    </Col>
                    <Col>
                        <h4>Turn:
                            <div className="playerHeader" style={{ color: currTurn.color }}>{currTurn.name.username}</div>
                        </h4>
                    </Col>
                </Row>
            </Container>
        )
    }
    if (winner) {
        return (
            <Container>
                <Row>
                    <Col>
                        <h4>Turn:
                            <div className="playerHeader" style={{ color: winner.playerColor }}>{winner.playerName} has won the game!</div>
                            <LobbyBtn shouldResetData={true}/>
                        </h4>
                    </Col>
                </Row>
            </Container>
        )
    }

    const currTurn = gameData.playerOrder[0];
    return (
        <Container>
            <Col>
                <h4>Turn:
                    <div className="playerHeader" style={{ color: currTurn.color }}>{currTurn.name.username}</div>
                </h4>
            </Col>
        </Container>
    )
}

export default TurnHeader;