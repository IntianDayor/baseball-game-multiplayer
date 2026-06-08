import MainMenu from "./components/MainMenu"
import Lobby from "./components/Lobby"
import Game from "./components/Game"
import Loading from "./components/Loading"
import GameOver from "./components/GameOver"
import { useState, useEffect } from "react"
import { getGamePitches } from "./data/pitches"
import { getGameBats } from "./data/bats"

function App() {
    /* Variables */
    const [screen, setScreen] = useState('menu');
    const [selected, setSelected] = useState('Q');
    const [pitches] = useState(() => getGamePitches());
    const [bats] = useState(() => getGameBats());
    const [isHost, setIsHost] = useState(false);
    const [roomCode, setRoomCode] = useState('');
    const [scoreAway, setScoreAway] = useState(0);
    const [scoreHome, setScoreHome] = useState(0);

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
        pitches={pitches}
        bats={bats}
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