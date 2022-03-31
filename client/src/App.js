import React from 'react';
import HexagonBoard from './components/hexagonsBoard';
import City from './components/boardPieces/city';
import Settelment from './components/boardPieces/settlement';

function App() {
  return (
    <div>
      {/* <HexagonBoard /> */}
      <svg width={1000} height={1000}>
        <City centerX={500} centerY={500} color="blue" />
        <Settelment centerX={400} centerY={400} color="red" />
      </svg>

    </div>
  );
}



export default App;
