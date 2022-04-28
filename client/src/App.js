import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import JoinGameForm from './components/joinGameForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GameTab from './components/gameTab';
import { setGameData } from "./actions";
import DiceRoller from './components/diceRoller';

//http://localhost:3008

function App() {
  const socketRef = useRef(null);
  const [currUser, setCurrUser] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    socketRef.current = io.connect("http://localhost:3008");

    socketRef.current.on("lobby", data => {
      console.log(data);
    })

    socketRef.current.on("game-data", data => {
      console.log("New game update")
      console.log(data)
      dispatch(setGameData(data));
    })
  }, [])

  return (
    <div>
      {/* <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<JoinGameForm gameSocketRef={socketRef} setCurrUser={setCurrUser} currUser={currUser} />} />
          <Route exact path="/game" element={<GameTab gameSocketRef={socketRef} />} />
        </Routes>
      </BrowserRouter> */}
      <DiceRoller number={7}/>
    </div>
  );
}



export default App;
