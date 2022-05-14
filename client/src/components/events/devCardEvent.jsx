import React, { useEffect, useState } from "react";
import { Container, Modal, Button } from "react-bootstrap";

function DevCardEvent({ event }) {
    const { card, activatingPlayerName, activatingPlayerColor } = event;

    const [show, setShow] = useState(true);
    const handleClose = () => setShow(false);
    setTimeout(() => {
        setShow(false);
    }, 2000);

    let cardInfo;
    switch (card.type) {
        case "Monopoly":
            cardInfo = [
                `${activatingPlayerName.username} (${activatingPlayerColor}) used a ${card.resource} Monopoly!`,
                `All ${card.resource} resources from the opponent players will be transfered to ${activatingPlayerName.username}`
            ];
            break;
        case "Year of Plenty":
            cardInfo=[
                `${activatingPlayerName.username} (${activatingPlayerColor}) used a Year of Plenty card!`,
                `He recieved ${card.resourceA} and ${card.resourceB}`
            ]
        default:
            break;
    }

    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Development card activated!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        {cardInfo.map((item, key) => {
                            return <div key={key}>{item}</div>
                        })}
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

export default DevCardEvent;