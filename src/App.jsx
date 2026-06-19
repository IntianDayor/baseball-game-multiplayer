import MainMenu from "./components/MainMenu";
import Lobby from "./components/Lobby";
import Game from "./components/Game";
import Loading from "./components/Loading";
import GameOver from "./components/GameOver";
import { getGameBats } from "./data/bats";
import { useState } from "react";

function App() {
    /* Variables */
    const [screen, setScreen] = useState('menu');
    const [selected, setSelected] = useState('Q');
    const [bats] = useState(() => getGameBats());
    const [isHost, setIsHost] = useState(false);
    const [roomCode, setRoomCode] = useState('');
    const [scoreAway, setScoreAway] = useState(0);
    const [scoreHome, setScoreHome] = useState(0);

    const [myPitches, setMyPitches] = useState(null);
    const [opponentPitches, setOpponentPitches] = useState(null);

    /* Screen Handler */
    if (screen === 'menu') return <MainMenu setScreen={setScreen} />
    if (screen === 'lobby') return <Lobby
        setScreen={setScreen}
        isHost={isHost}
        setIsHost={setIsHost}
        roomCode={roomCode}
        setRoomCode={setRoomCode}
    />
    /* Main Game */
    if (screen === 'game') return <Game
        setScreen={setScreen}
        bats={bats}
        myPitches={myPitches}
        setMyPitches={setMyPitches}
        opponentPitches={opponentPitches}
        setOpponentPitches={setOpponentPitches}
        setSelected={setSelected}
        selected={selected}
        isHost={isHost}
        roomCode={roomCode}
        setScoreAway={setScoreAway}
        setScoreHome={setScoreHome}
        scoreAway={scoreAway}
        scoreHome={scoreHome}
    />

    /* Game Over */
    if (screen === 'gameover') return <GameOver
        setScreen={setScreen}
        roomCode={roomCode}
        scoreHome={scoreHome}
        scoreAway={scoreAway}
        isHost={isHost}
    />

    return <Loading />
}

export default App;