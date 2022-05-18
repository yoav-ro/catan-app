import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { activeEventTypes, passiveEventTypes } from "../../utils/constants";
import DropResourcesModal from "../modals/dropResourceEvent";
import DevCardEvent from "./devCardEvent";
import DiceRoller from "./diceRoller";

function MainEventComp({ gameSocketRef }) {
    const currPlayer = useSelector(state => state.playerReducer);
    const [event, setEvent] = useState("");
    console.log("tender");
    const [showDropModal, setShowDropModal] = useState(false);
    const handleCloseDropModal = () => setShowDropModal(false);

    const [showDiceRoll, setShowDiceRoll] = useState(false);
    const handleCloseDiceRoll = () => setShowDiceRoll(false);

    const [showDevCard, setShowDevCard] = useState(false);
    const handleCloseDevCard = () => setShowDevCard(false);

    const showForDuration = (closeCallBack, duration) => {
        setTimeout(() => {
            closeCallBack();
        }, duration);
    }

    gameSocketRef.current.on("game-event", data => {
        setEvent(data)
    })

    useEffect(() => {
        if (event) {
            if (event.type === activeEventTypes.rollDice) {
                setShowDiceRoll(true);
                showForDuration(handleCloseDiceRoll, 2000);
            }
            if (event.type === activeEventTypes.activateDevCard) {
                setShowDevCard(true);
                showForDuration(handleCloseDevCard, 2000);
            }
            if (event.type === passiveEventTypes.dropResources) {
                const shouldCurrPlayerDrop = event.droppingPlayers.some(droppingPlayer => droppingPlayer.playerName.username === currPlayer);
                if (shouldCurrPlayerDrop) {
                    setShowDropModal(true);
                }
            }
        }
    }, [event])


    return (
        <>
            <DiceRoller show={showDiceRoll} handleClose={handleCloseDiceRoll} event={event} />
            <DevCardEvent show={showDevCard} handleClose={handleCloseDevCard} event={event} />
            <DropResourcesModal show={showDropModal} handleClose={handleCloseDropModal} gameSocketRef={gameSocketRef} />
        </>
    )
}

export default MainEventComp;