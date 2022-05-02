import React, { useEffect, useState } from "react";
import { eventTypes } from "../../utils/constants";
import DiceRoller from "./diceRoller";

function MainEventComp({ gameSocketRef }) {
    const [event, setEvent] = useState("");

    useEffect(() => {
        gameSocketRef.current.on("game-event", data => {
            setEvent(data);
            showForDuration(1500);
        })
    })

    const showForDuration = (duration) => {
        setTimeout(() => {
            setEvent("");
        }, duration);
    }

    if (event) {
        if (event.type === eventTypes.rollDice) {
            return (
                <DiceRoller event={event} />
            )
        }
    }

    return <></>
}

export default MainEventComp;