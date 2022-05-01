import React, { useState } from "react";
import { eventTypes } from "../../utils/constants";
import DiceRoller from "./diceRoller";

function MainEventComp({ gameSocketRef }) {
    const [event, setEvent] = useState("");

    gameSocketRef.current.on("game-event", data => {
        setEvent(data);
    })

    if (event) {
        if (event.type === eventTypes.rollDice) {
            const { dice1, dice2, rollerColor, rollerName } = event;
            return (
                <DiceRoller dice1={dice1} dice2={dice2} rollerColor={rollerColor} rollerName={rollerName} />
            )
        }
    }

    return <></>
}

export default MainEventComp;