import MainMenu from "./components/MainMenu";
import Lobby from "./components/Lobby";
import Game from "./components/Game";
import Loading from "./components/Loading";
import GameOver from "./components/GameOver";
import { getGameBats } from "./data/bats";
import { useEffect, useState } from "react";
import { ensureSession } from "./lib/supabase";

function App() {
    const [screen, setScreen] = useState('menu');
    const [selected, setSelected] = useState('Q');
    
    const [isHost, setIsHost] = useState(false);
    const [roomCode, setRoomCode] = useState('');
    const [uid, setUid] = useState(null);
    
    const [myPitches, setMyPitches] = useState(null);
    const [bats] = useState(() => getGameBats());
    const [opponentPitches, setOpponentPitches] = useState(null);
    const [scoreHome, setScoreHome] = useState(0);
    const [scoreAway, setScoreAway] = useState(0);

    useEffect(() => {
        async function init() {
            const id = await ensureSession();
            setUid(id);
        }

        init();
        
    }, []);

    console.log(uid);

    if (!uid) return <Loading />

    if (screen === 'menu') return <MainMenu 
        setScreen={setScreen} 
    />
    if (screen === 'lobby') return <Lobby
        setScreen={setScreen}
        isHost={isHost}
        setIsHost={setIsHost}
        roomCode={roomCode}
        setRoomCode={setRoomCode}
        uid={uid}
    />
    if (screen === 'game') return <Game
        setScreen={setScreen}
        uid={uid}
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
