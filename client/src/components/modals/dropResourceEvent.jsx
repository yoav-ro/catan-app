import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { dropResourcesDir } from "../../utils/directiveCreator";
import DropResourcesForm from "../general/dropResourcesForm";

function DropResourcesModal({ show, handleClose, gameSocketRef }) {
    const [selectedResources, setSelectedResources] = useState([]);
    const currPlayer = useSelector(state => state.playerReducer);
    const gameData = useSelector(state => state.gameReducer);
    const players = gameData.game.game.players;

    const player = players.find(player => player.playerName.username === currPlayer);
    const isSetup = gameData.game.game.isSetupPhase;

    const handleConfirm = () => {
        const directive = dropResourcesDir(player.color, selectedResources.map(item => item.toLowerCase()));
        gameSocketRef.current.emit("newDirective", { directive: directive });
        setSelectedResources([]);
        handleClose();
    }

    if (isSetup) {
        return <></>
    }

    return (
        <div>
            <Modal show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Drop Resources</Modal.Title>
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