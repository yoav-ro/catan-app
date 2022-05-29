import React from "react";
import { Container, Modal, Button } from "react-bootstrap";
import { activeEventTypes } from "../../utils/constants";

function DevCardEvent({ show, handleClose, event }) {
    if (event.type !== activeEventTypes.activateDevCard) {
        return <></>
    }
    const { card, activatingPlayerName, activatingPlayerColor } = event;

    let cardInfo;
    switch (card.type) {
        case "Monopoly":
            cardInfo = [
                `${activatingPlayerName.username} (${activatingPlayerColor}) used a ${card.resource} Monopoly!`,
                `All ${card.resource} resources from the opponent players will be transfered to ${activatingPlayerName.username}`
            ];
            break;
        case "Year of Plenty":
            cardInfo = [
                `${activatingPlayerName.username} (${activatingPlayerColor}) used a Year of Plenty card!`,
                `He recieved ${card.resourceA} and ${card.resourceB}`
            ]
            break;
        case "Knight":
            cardInfo = [
                `${activatingPlayerName.username} (${activatingPlayerColor}) used a knight card!`,
                `He is able to move the knight and rob another player`,
            ]
            break;
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