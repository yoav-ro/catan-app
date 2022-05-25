import React, { useState } from "react";
import { Modal, Button, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import UseKnight from "./useKnight";
import UseMonopoly from "./useMonopoly";
import UseYoP from "./useYoP";

function UseDevCardMenu({ show, handleClose, gameSocketRef }) {
    const [showYoP, setShowYoP] = useState(false);
    const [showMonopoly, setShowMonopoly] = useState(false);
    const [showKnight, setShowKnight] = useState(false);
    const currPlayer = useSelector(state => state.playerReducer);
    const gameData = useSelector(state => state.gameReducer);
    const didDiceRoll = !gameData.game.game.directiveExpectation.includes("rollDice");
    const players = gameData.game.game.players;

    const player = players.find(player => player.playerName.username === currPlayer);
    const canUseMonopoly = player.playerDevCards.some(card => card.name === "Monopoly" && !card.isUsed && card.isUseAble && didDiceRoll);
    const canUseKnight = player.playerDevCards.some(card => card.name === "Knight" && !card.isUsed && card.isUseAble);
    const canUseRoadBuilding = player.playerDevCards.some(card => card.name === "Road Building" && !card.isUsed && card.isUseAble && didDiceRoll);
    const canUseYoP = player.playerDevCards.some(card => card.name === "Year of Plenty" && !card.isUsed && card.isUseAble && didDiceRoll);

    const handleCloseMonopoly = () => {
        setShowMonopoly(false);
    }
    const handleCloseYoP = () => {
        setShowYoP(false);
    }
    const handleCloseKnight = () => {
        setShowKnight(false);
    }

    const monopolyClick = () => {
        handleClose();
        setShowMonopoly(true);
    }

    const yopClick = () => {
        handleClose();
        setShowYoP(true);
    }

    const knightClick = () => {
        handleClose();
        setShowKnight(true);
    }

    const roadBuildingClick = () => {

    }

    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Use a development card</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <div>Choose a development card to use:</div>
                        <Row>
                            <Button onClick={knightClick} disabled={!canUseKnight}>Knight</Button>
                            <Button onClick={monopolyClick} disabled={!canUseMonopoly}>Monopoly</Button>
                            <Button onClick={yopClick} disabled={!canUseYoP}>Year of Plenty</Button>
                            <Button onClick={roadBuildingClick} disabled={!canUseRoadBuilding}>Road Building</Button>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <UseMonopoly show={showMonopoly} handleClose={handleCloseMonopoly} gameSocketRef={gameSocketRef} />
            <UseYoP show={showYoP} handleClose={handleCloseYoP} gameSocketRef={gameSocketRef} />
            <UseKnight show={showKnight} handleClose={handleCloseKnight} gameSocketRef={gameSocketRef} />
        </div>
    );
}

export default UseDevCardMenu;