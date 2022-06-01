import React from "react";
import "../styles/playerDeck.css";
import { Container, Row, Col } from "react-bootstrap";

function TurnHeader({ gameData }) {

    const isSetup = gameData.isSetupPhase;

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