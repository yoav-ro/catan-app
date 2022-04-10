import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import JoinGameForm from './components/joinGameForm';
import MainNav from './components/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

//http://localhost:3008

function App() {
  const socketRef = useRef(null);
  const [currUser, setCurrUser] = useState("");
  console.log(currUser);
  useEffect(() => {
    socketRef.current = io.connect("http://localhost:3008");

    socketRef.current.on("lobby", data => {
      console.log(data);
    })

    socketRef.current.on("game-data", data => {
      console.log("here")
      console.log(data);
    })
  }, [])

  return (
    <div>
      <MainNav />
      <JoinGameForm gameSocketRef={socketRef} setCurrUser={setCurrUser} currUser={currUser}/>
    </div>
  );
}



export default App;
