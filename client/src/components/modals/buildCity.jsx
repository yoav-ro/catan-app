import React from "react";
import { Modal, Button, Row, Col, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { buildCityDir } from "../../utils/directiveCreator";

function BuildCity({ show, handleClose, x, y, gameSocketRef }) {
    const currPlayer = useSelector(state => state.playerReducer);
    const gameData = useSelector(state => state.gameReducer);
    const players = gameData.game.game.players;

    const player = players.find(player => player.playerName.username === currPlayer);
    const isSetup= gameData.game.game.isSetupPhase;

    const handleConfirm = () => {
        let directive;
        directive = buildCityDir(x - 30, y - 30, player.color);
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
                    <Modal.Title>Build a city</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <div>You are about to upgrade a {player.color} settlement to a city.</div>
                        <div>It will cost:</div>
                        <Row>
                            <Col>
                                2 x Wheat
                            </Col>
                            <Col>
                                3 x Iron
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

export default BuildCity;