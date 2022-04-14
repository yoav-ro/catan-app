import React from "react";
import { Modal, Button, Row, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { setupBuildRoadDir, buildRoadDir } from "../../utils/directiveCreator";

function BuildRoad({ show, handleClose, x1, y1, x2, y2, gameSocketRef }) {
    const currPlayer = useSelector(state => state.playerReducer);
    const gameData = useSelector(state => state.gameReducer);
    const players = gameData.game.game.players;


    const player = players.find(player => player.playerName.username === currPlayer);
    const isSetup = player.roads.length < 2;

    const handleConfirm = () => {
        let directive;
        if (isSetup) {
            directive = setupBuildRoadDir(x1 - 30, y1 - 30, x2 - 30, y2 - 30, player.color);
        }
        else {
            directive = buildRoadDir(x1 - 30, y1 - 30, x2 - 30, y2 - 30, player.color);
        }
        gameSocketRef.current.emit("newDirective", { directive: directive });
        handleClose();
    }

    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Build a road</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <div>You are about to build a new {player.color} road.</div>
                        <div>It will cost (first two roads are free):</div>
                        <Row>
                            1 x Wood
                        </Row>
                        <Row>
                            1 x Brick
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

export default BuildRoad;