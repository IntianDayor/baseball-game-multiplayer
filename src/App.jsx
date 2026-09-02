import MainMenu from "./components/MainMenu";
import Lobby from "./components/Lobby";
import Game from "./components/Game";
import Loading from "./components/Loading";
import GameOver from "./components/GameOver";
import { getGameBats } from "./data/bats";
import { useEffect, useState } from "react";
import { ensureSession } from "./lib/supabase";

function App() {
    /* Variables */
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

    // Client Session ID
    useEffect(() => {
        async function init() {
            const id = await ensureSession();
            setUid(id);
        }

        init();
    }, []);

    /* Screen Selector */
    const renderScreen = () => {
        if (!uid) return <Loading />;
        
        switch (screen) {
            case 'menu':
                return <MainMenu setScreen={setScreen} />;
            case 'lobby':
                return (
                    <Lobby
                        setScreen={setScreen}
                        isHost={isHost}
                        setIsHost={setIsHost}
                        roomCode={roomCode}
                        setRoomCode={setRoomCode}
                        uid={uid}
                    />
                );
            case 'game':
                return (
                    <Game
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
                );
            case 'gameover':
                return (
                    <GameOver
                        setScreen={setScreen}
                        roomCode={roomCode}
                        scoreHome={scoreHome}
                        scoreAway={scoreAway}
                        isHost={isHost}
                    />
                );
            default:
                return <Loading />;
        }
    };

    return (
        <div className="relative min-h-screen">
            {/* Screen Content */}
            {renderScreen()}

            {/* Persistent Build Version Overlay */}
            <div className="fixed bottom-2 right-2 text-xs font-mono text-white/40 select-none pointer-events-none z-50">
               {/* global __APP_VERSION__ */}
               Build: {__APP_VERSION__}
            </div>
        </div>
    );
}

export default App;