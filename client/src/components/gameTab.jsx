import React from "react";
import HexagonBoard from "./hexagonsBoard";
import MainNav from "./navbar";

function GameTab() {
    return (
        <div>
            <MainNav />
            <HexagonBoard />
        </div>
    )
}

export default GameTab;