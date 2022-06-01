import React from "react";
import { Modal, Button, Row, Col, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { buildSettelmentDir, setupBuildSettelmetDir } from "../../utils/directiveCreator";

function BuildSettelment({ show, handleClose, x, y, gameSocketRef }) {
    const currPlayer = useSelector(state => state.playerReducer);
    const gameData = useSelector(state => state.gameReducer);
    const players = gameData.game.game.players;

    const player = players.find(player => player.playerName.username === currPlayer);
    const isSetup = gameData.game.game.isSetupPhase;

    const handleConfirm = () => {
        let directive;
        if (isSetup) {
            directive = setupBuildSettelmetDir(x - 30, y - 30, player.color);
        }
        else {
            directive = buildSettelmentDir(x - 30, y - 30, player.color);
        }
        gameSocketRef.current.emit("newDirective", { directive: directive });
        handleClose();
    }

    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Build a settlement</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <div>You are about to build a new {player.color} settlement.</div>
                        <div>It will cost (first two settlements are free):</div>
                        <Row>
                            <Col>
                                1 x Wood
                            </Col>
                            <Col>
                                1 x Brick
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                1 x Sheep
                            </Col>
                            <Col>
                                1 x Wheat
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleConfirm}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default BuildSettelment;