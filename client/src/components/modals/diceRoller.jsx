import React from "react";
import { Container, Modal, Button } from "react-bootstrap";


function DiceRoller({ show, handleClose, number }) {
    const numPart = Math.floor(Math.random() * (number - 1) + 1);
    const fillerNum = number - numPart;

    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Roll Results</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <h2>You rolled {number}!</h2>
                        <img src={require("../../assets/dices/face" + numPart + ".png")} />
                        <img src={require("../../assets/dices/face" + fillerNum + ".png")} />
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose()}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default DiceRoller;