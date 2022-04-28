import React from "react";
import "./styles/playerDeck.css";
import { Container, Row, Col } from "react-bootstrap";

function Chat({ gameData }) {

    const isSetup = gameData.isSetupPhase;

    if (isSetup) {
        const currTurn = gameData.setupOrder[0];
        console.log(gameData.setupOrder);
        return (
            <div className="chat">
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
            </div>
        )
    }

    const currTurn = gameData.playerOrder[0];
    return (
        <div className="chat">
            <Container>
                <Col>
                    <h4>Turn:
                        <div className="playerHeader" style={{ color: currTurn.color }}>{currTurn.name.username}</div>
                    </h4>
                </Col>
            </Container>
        </div>
    )
}

export default Chat;