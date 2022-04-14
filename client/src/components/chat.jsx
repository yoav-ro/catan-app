import React from "react";
import "./styles/playerDeck.css";
import { Container, Row, Col } from "react-bootstrap";

function Chat({ gameData }) {
    const currTurn = gameData.setupOrder[0];
    const isSetup = gameData.isSetupPhase;
    console.log(isSetup)
    if (isSetup) {
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