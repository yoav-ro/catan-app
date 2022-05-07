import React from "react";
import { Modal, Button, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";

function UseDevCardMenu({ show, handleClose, gameSocketRef }) {
    const currPlayer = useSelector(state => state.playerReducer);
    const gameData = useSelector(state => state.gameReducer);
    const players = gameData.game.game.players;

    const player = players.find(player => player.playerName.username === currPlayer);
    const doesHaveMonopoly = player.devCards.some(card => card.name === "Monopoly" && !card.isUsed)
    const doesHaveKnight = player.devCards.some(card => card.name === "Knight" && !card.isUsed)
    const doesHaveRoadBuilding = player.devCards.some(card => card.name === "Road Building" && !card.isUsed)
    const doesHaveYoP = player.devCards.some(card => card.name === "Year of Plenty" && !card.isUsed)

    const monopolyClick = () => {

    }

    const yopClick = () => {

    }

    const knightClick = () => {

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
                                <Button onClick={knightClick} disabled={!doesHaveKnight}>Knight</Button>
                                <Button onClick={monopolyClick} disabled={!doesHaveMonopoly}>Monopoly</Button>
                                <Button onClick={yopClick} disabled={!doesHaveYoP}>Year of Plenty</Button>
                                <Button onClick={roadBuildingClick} disabled={!doesHaveRoadBuilding}>Road Building</Button>
                            </Row>
                        </Container>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
            </Modal>
        </div>
    );
}

export default UseDevCardMenu;