import React, { useEffect } from 'react';
import HexagonBoard from './components/hexagonsBoard';
import City from './components/boardPieces/city';
import Settelment from './components/boardPieces/settlement';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
// import game from './demoGame';
import { setGameData } from './actions';
import Robber from './components/boardPieces/robber';
import Port from './components/boardPieces/port';

function App() {
  const dispatch = useDispatch();

  // dispatch(setGameData(game));
  // const currGame = useSelector(state => state.gameReducer);

  // console.log(currGame);

  return (
    <div>
      {/* <HexagonBoard /> */}

      <svg width="1000" height="1000">
        
        {/* <Robber tileCX={300} tileCY={300} />
        <City centerX={100} centerY={100} color="blue" />
        <Settelment centerX={200} centerY={200} color="red" /> */}
        {/* <circle r={100} cx={500} cy={500} fill="transparent" stroke='black'/> */}
        

        <Port x={300} y={300} scale={0.1}/>
      </svg>

    </div>
  );
}



export default App;
