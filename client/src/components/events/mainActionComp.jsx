import React, { useEffect, useState } from "react";
import { eventTypes } from "../../utils/constants";
import DevCardEvent from "./devCardEvent";
import DiceRoller from "./diceRoller";

function MainEventComp({ gameSocketRef }) {
    const [event, setEvent] = useState("");

    useEffect(() => {
        gameSocketRef.current.on("game-event", data => {
            console.log(data);
            const eventDuraction = data.type !== eventTypes.rollDice ? 3000 : 1500;
            setEvent(data);
            showForDuration(eventDuraction);
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
        if (event.type === eventTypes.activateDevCard) {
            return (
                <DevCardEvent event={event} />
            )
        }
    }

    return <></>
}

export default MainEventComp;