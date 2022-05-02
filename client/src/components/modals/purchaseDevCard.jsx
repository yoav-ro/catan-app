import React from "react";
import { Modal, Button, Row, Col, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { buyDevCardDir } from "../../utils/directiveCreator";

function BuyDevCard({ show, handleClose, gameSocketRef }) {
    const currPlayer = useSelector(state => state.playerReducer);
    const gameData = useSelector(state => state.gameReducer);
    const players = gameData.game.game.players;

    const player = players.find(player => player.playerName.username === currPlayer);
    const isSetup = player.settelments.length < 2;

    const handleConfirm = () => {
        const directive = buyDevCardDir(player.color);
        gameSocketRef.current.emit("newDirective", { directive: directive });
        handleClose();
    }

    if (isSetup) {
        return <></>
    }

    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Get a new development card</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <div>You are about to purchese a new development card.</div>
                        <div>It will cost:</div>
                        <Row>
                            <Col>
                                1 x Wheat
                            </Col>
                            <Col>
                                1 x Iron
                            </Col>
                            <Col>
                                1 x Sheep
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

export default BuyDevCard;