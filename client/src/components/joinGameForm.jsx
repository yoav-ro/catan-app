import React, { useState } from "react";

function JoinGameForm() {
    const [userName, setUserName] = useState("");

    const handleClick = (e) => {
        e.preventDefault();
        if (!userName) {
            alert("Invalid input!")
        } else {
            //joinsocket
        }

    }

    return (
        <form>
            <input type="text" placeholder="Enter player name" onChange={(e) => setUserName(e.target.value)} />
            <button type="submit" onClick={handleClick(e)} />
        </form>
    )
}