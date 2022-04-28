import React from "react";
import Dice from "react-dice-roll";

function DiceRoller({ number }) {
    const numPart = Math.floor(Math.random() * (number - 1) + 1);
    const fillerNum = number - numPart;

    return (
        <div>
            <Dice cheatValue={numPart} rollingTime={500} triggers="['click']"/>
            <Dice cheatValue={fillerNum} rollingTime={500} triggers="['click']"/>
        </div>
    )
}

export default DiceRoller;