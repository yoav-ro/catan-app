import React, { useEffect, useState } from "react";
import { activeEventTypes, passiveEventTypes } from "../../utils/constants";
import DropResourcesModal from "./dropResourceEvent";
import DevCardEvent from "./devCardEvent";
import DiceRoller from "./diceRoller";

function MainEventComp({ gameSocketRef }) {
    const [event, setEvent] = useState("");

    useEffect(() => {
        gameSocketRef.current.on("game-event", data => {
            console.log(data);
            if (event.type !== passiveEventTypes.dropResources) {
                const eventDuraction = data.type !== activeEventTypes.rollDice ? 3000 : 1500;
                setEvent(data);
                // showForDuration(eventDuraction);
            }
            else {
                setEvent(data);
            }
        })
    })

    const showForDuration = (duration) => {
        setTimeout(() => {
            setEvent("");
        }, duration);
    }

    if (event) {
        if (event.type === activeEventTypes.rollDice) {
            return (
                <DiceRoller event={event} />
            )
        }
        if (event.type === activeEventTypes.activateDevCard) {
            return (
                <DevCardEvent event={event} />
            )
        }
        if (event.type === passiveEventTypes.dropResources) {
            return (
                <DropResourcesModal gameSocketRef={gameSocketRef} />
            )
        }
    }

    return <></>
}

export default MainEventComp;