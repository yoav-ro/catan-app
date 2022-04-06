import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import JoinGameForm from './components/joinGameForm';

//http://localhost:3008

function App() {
  const socketRef = useRef(null);

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
      <JoinGameForm gameSocketRef={socketRef} />
    </div>
  );
}



export default App;
