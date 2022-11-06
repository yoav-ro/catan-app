import React from "react";
import { Container, Modal, Button } from "react-bootstrap";
import { activeEventTypes } from "../../utils/constants";
import "../styles/playerDeck.css";

function VictoryEvent({ show, handleClose, event }) {
    if (event.type !== activeEventTypes.victory) {
        return <></>
    }

    const { winnerName, winnerColor, points } = event;

    const handleConfirm = () => {
        console.log("confirm victory")
    }

    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Victory!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <h2>
                            <div style={{ color: winnerColor }} className="playerHeader">{winnerName} ({winnerColor}) won with {points} points!</div>
                        </h2>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleConfirm}>
                        Return to lobby
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default VictoryEvent;