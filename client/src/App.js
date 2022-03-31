import React, { useEffect } from 'react';
import HexagonBoard from './components/hexagonsBoard';
import City from './components/boardPieces/city';
import Settelment from './components/boardPieces/settlement';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
// import game from './demoGame';
import { setGameData } from './actions';

function App() {
  const dispatch = useDispatch();

  // dispatch(setGameData(game));
  // const currGame = useSelector(state => state.gameReducer);

  // console.log(currGame);

  return (
    <div>
      <HexagonBoard />
      {/* <svg width={1000} height={1000}>
        <City centerX={500} centerY={500} color="blue" />
        <Settelment centerX={400} centerY={400} color="red" />
      </svg> */}

    </div>
  );
}



export default App;
