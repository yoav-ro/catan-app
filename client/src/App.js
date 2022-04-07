import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import JoinGameForm from './components/joinGameForm';
import { setGameData } from "./actions";
import HexagonBoard from './components/hexagonsBoard';

//http://localhost:3008

function App() {
  const socketRef = useRef(null);
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
      <JoinGameForm gameSocketRef={socketRef} />
      <HexagonBoard />
      <svg width="250" height="250">
        <circle fill='white' stroke='black' cx="125" cy="125" r="20" />
        <text x="50%" y="50%" textAnchor="middle"  strokeWidth="2px" dy=".3em">BC</text>
      </svg>
    </div>
  );
}



export default App;
