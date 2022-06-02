import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import JoinGameForm from './components/general/joinGameForm';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GameTab from './components/general/gameTab';
import { setGameData, newChatMsg } from "./actions";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import 'bootstrap/dist/css/bootstrap.min.css';

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

    socketRef.current.on("game-error", data => {
      console.log(data);
      NotificationManager.error(data.toString());
    })

    socketRef.current.on("game-data", data => {
      console.log(data);
      dispatch(setGameData(data));
    })

    socketRef.current.on("chat-data", data => {
      console.log(data);
      dispatch(newChatMsg(data));
    })
  }, [dispatch])

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<JoinGameForm gameSocketRef={socketRef} setCurrUser={setCurrUser} currUser={currUser} />} />
          <Route exact path="/game" element={<GameTab gameSocketRef={socketRef} />} />
        </Routes>
      </BrowserRouter>
      <NotificationContainer />
    </div>
  );
}



export default App;
