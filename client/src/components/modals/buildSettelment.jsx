import React from "react";
import { Modal, Button, Row, Col, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { buildSettelmentDir } from "../../utils/directiveCreator";

function BuildSettelment({ show, handleClose, x, y }) {
    const currPlayer = useSelector(state => state.playerReducer);
    const gameData = useSelector(state => state.gameReducer);
    const players = gameData.game.game.players;

    const player = players.find(player => player.playerName.username === currPlayer);


    const handleConfirm = () => {
        const buildDir = buildSettelmentDir(x, y, player.color);
        handleClose();
    }

    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Build a settelment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <div>You are about to build a new {player.color} settelment.</div>
                        <div>It will cost:</div>
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