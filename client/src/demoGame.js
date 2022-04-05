// import catanAPI from "./game-logic/catanAPI/catanAPI";

const players = [
    { name: "yoav", color: "blue" },
    { name: "bob", color: "red" },
    { name: "john", color: "white" },
    { name: "bill", color: "orange" },
]


const game = new catanAPI(players, 70);

export default game;