import React from "react";
import Hexagon from "react-hexagon"
import "./styles/hexagon.css"

function ResourceTile({ resourceType }) {

    const handleClick=()=>{
        console.log(resourceType.name)
    }

    return (
        // <div className="hexagon">
        //     {resourceType}
        // </div>
        <img src={resourceType.ref} className="hex" onClick={handleClick}></img>
    )
}

export default ResourceTile;