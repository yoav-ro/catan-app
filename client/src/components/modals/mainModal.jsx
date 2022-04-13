import React from "react";
import { Modal } from "react-bootstrap";
import { modalTypes } from "../../utils/constants";
import { useSelector } from "react-redux";
import BuildSettelment from "./buildSettelment";

function MainModal({ show, setShow, handleClose, handleShow }) {
    const currModal = useSelector(state => state.modalReducer);

    if (currModal === modalTypes.buildSettelment) {
        return (
            <Modal show={show} onHide={handleClose}>
                <BuildSettelment onHide={handleClose} />
            </Modal>
        )
    }

    return(<></>)
}

export default MainModal;