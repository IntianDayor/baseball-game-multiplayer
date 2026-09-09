import MainMenu from "./components/Game/MainMenu";
import Lobby from "./components/Game/Lobby";
import Game from "./components/Game";
import Loading from "./components/Game/Loading";
import GameOver from "./components/Game/GameOver";
import CaptchaGate from "./components/Auth/CaptchaGate";
import { getGameBats } from "./data/bats";
import { useEffect, useState } from "react";
import { getExistingSession, signInAnonymous } from "./lib/supabase";

function App() {
    /* Variables */
    const [screen, setScreen] = useState('menu');
    const [selected, setSelected] = useState('Q');
    
    const [isHost, setIsHost] = useState(false);
    const [roomCode, setRoomCode] = useState('');
    const [uid, setUid] = useState(null);
    const [needsCaptcha, setNeedsCaptcha] = useState(false);
    
    const [myPitches, setMyPitches] = useState(null);
    const [bats] = useState(() => getGameBats());
    const [opponentPitches, setOpponentPitches] = useState(null);
    const [scoreHome, setScoreHome] = useState(0);
    const [scoreAway, setScoreAway] = useState(0);

    // Client Session ID
    useEffect(() => {
        async function init() {
            // Returning player (page reload) — no captcha needed, just resume.
            const existingUid = await getExistingSession();
            if (existingUid) {
                setUid(existingUid);
            } else {
                setNeedsCaptcha(true);
            }
        }

        init();
    }, []);

    async function handleCaptchaVerified(token) {
        const id = await signInAnonymous(token);
        setUid(id);
        setNeedsCaptcha(false);
    }

    /* Screen Selector */
    const renderScreen = () => {
        if (!uid) {
            return needsCaptcha
                ? <CaptchaGate onVerified={handleCaptchaVerified} />
                : <Loading />;
        }
        
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
               Build: {__APP_VERSION__}
            </div>
        </div>
    );
}

export default App;