import React, { useState } from "react";
import "./styles/road.css"

function Road({ x1, y1, x2, y2 }) {
    const [status, setStatus]=useState("free");

    const handleClick=()=>{
        console.log(`Road, status: ${status}, from (${x1}, ${y1}) to (${x2, y2})`);
    }

    return (
        <line x1={x1} y1={y1} x2={x2} y2={y2} className="road" onClick={handleClick}/>
    )
}

export default Road;