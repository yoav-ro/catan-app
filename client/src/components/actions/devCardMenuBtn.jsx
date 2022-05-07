import React, { useState } from "react";
import { Button } from "react-bootstrap";
import UseDevCardMenu from "../modals/useDevCardMenu";

function DevCardMenuBtn({ gameSocketRef }) {
    const [show, setShow] = useState(false);

    const handleClick = () => {
        setShow(true);
    }

    const handleClose = () => setShow(false);

    return (
        <>
            <Button onClick={handleClick}>Activate Development Card</Button>
            <UseDevCardMenu show={show} handleClose={handleClose} gameSocketRef={gameSocketRef} />
        </>
    )
}

export default DevCardMenuBtn;