import React, { useState } from "react";
import { Button } from "react-bootstrap";
import BuyDevCard from "../modals/purchaseDevCard";

function BuyDevCardBtn({ gameSocketRef }) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    
    const handleClick = () => {
        setShow(true);
    }

    return (
        <>
            <Button onClick={handleClick} variant="success">Dev Card</Button>
            <BuyDevCard gameSocketRef={gameSocketRef} show={show} handleClose={handleClose} />
        </>
    )
}

export default BuyDevCardBtn;