import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { dropResourcesDir } from "../../utils/directiveCreator";
import DropResourcesForm from "../dropResourcesForm";

function DropResourcesModal({ gameSocketRef }) {
    const [selectedResources, setSelectedResources] = useState([]);
    const currPlayer = useSelector(state => state.playerReducer);
    const gameData = useSelector(state => state.gameReducer);
    const players = gameData.game.game.players;

    const player = players.find(player => player.playerName.username === currPlayer);
    const isSetup = gameData.game.game.isSetupPhase;

    const handleConfirm = () => {
        const directive = dropResourcesDir(player.color, selectedResources.map(item=>item.toLowerCase()));
        gameSocketRef.current.emit("newDirective", { directive: directive });
    }

    const [show, setShow] = useState(true);
    const handleClose = () => setShow(false);

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
                    <DropResourcesForm selectedResources={selectedResources} setSelectedResources={setSelectedResources} />
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

export default DropResourcesModal;