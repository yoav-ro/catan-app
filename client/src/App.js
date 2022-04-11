import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import JoinGameForm from './components/joinGameForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GameTab from './components/gameTab';
import { setGameData } from "./actions";
import { setGameData } from "./actions";
import HexagonBoard from './components/hexagonsBoard';

//http://localhost:3008

function App() {
  const socketRef = useRef(null);
  const [currUser, setCurrUser] = useState("");
  console.log(currUser);
  const dispatch = useDispatch();

  useEffect(() => {
    socketRef.current = io.connect("http://localhost:3008");

    socketRef.current.on("lobby", data => {
      console.log(data);
    })

    socketRef.current.on("game-data", data => {
      console.log("New game update")
      dispatch(setGameData(data));
    })
  }, [])

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<JoinGameForm gameSocketRef={socketRef} setCurrUser={setCurrUser} currUser={currUser} />} />
          <Route exact path="/game" element={<GameTab gameSocketRef={socketRef} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}



export default App;
