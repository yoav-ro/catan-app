import React, { useEffect, useState } from "react";
import { Container, Modal, Button } from "react-bootstrap";

function DiceRoller({ event }) {
    const { dice1, dice2, rollerColor, rollerName } = event;

    const [show, setShow] = useState(true);
    const handleClose = () => setShow(false);
    setTimeout(() => {
        setShow(false);
    }, 2000);
    // popCallBack();

    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{rollerName.username} ({rollerColor}) has rolled {dice1 + dice2}!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <img src={require("../../assets/dices/face" + dice1 + ".png")} />
                        <img src={require("../../assets/dices/face" + dice2 + ".png")} />
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default DiceRoller;