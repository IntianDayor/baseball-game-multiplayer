import { useState, useEffect } from "react";
import PitchingField from "./PitchingField";
import PitchSelector from "./PitchSelector";
import BattingField from "./BattingField";
import BattingSelector from "./BattingSelector";
import ScoreBoard from "./ScoreBoard";
import MiniMap from "./MiniMap";
import Lobby from "./Lobby";
import Loading from "./Loading";
import { coinChoice, gameOver, updateCoinTossRes, updatePlayerRole } from "../lib/rooms";
import { supabase } from "../lib/supabase";

function Game({ setScreen, bats, pitches, selected, setSelected, isHost, roomCode, setScoreAway, setScoreHome, scoreAway, scoreHome }) {

    /* COIN TOSS FUNCTION */
    function coinToss() {
        const coin = Math.floor(Math.random() * 2);
        return (coin === 1) ? 'HEADS' : 'TAILS';
    }

    /* VARIABLES */

    // Variables for Game State/Role Assignment //
    const [role, setRole] = useState('choosing');
    const [coinRes, setCoinRes] = useState(() => coinToss());
    const [chosenCoin, setChosenCoin] = useState('');
    const [mySide, setMySide] = useState(''); // Coin toss
    const [tossWinner, setTossWinner] = useState(null);
    const [roleChosen, setRoleChosen] = useState(''); // Play Order determined by the winner of the coin toss.
    const [opponentRole, setOpponentRole] = useState(''); // Always the opposite of the Winner Role.

    // Variables for ScoreBoard //
    const [outs, setOuts] = useState(0);
    const [strikes, setStrikes] = useState(0);
    const [balls, setBalls] = useState(0);
    const [inning, setInning] = useState(1);
    const [inningFrame, setInningFrame] = useState('top');

    // Variables for MainGame //
    const [runners, setRunners] = useState({
        first: false,
        second: false,
        third: false
    });

    // Database Listener
    useEffect(() => {
        if (!roomCode) return;

        const channel = supabase
            .channel('game' + roomCode)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'rooms',
                filter: `id=eq.${roomCode}`
            }, (payload) => {
                const room = payload.new

                /* Coin Toss and Role Assignment */

                // Coin Toss Result
                if (room.coin_result) {
                    setCoinRes(room.coin_result);
                    // Determine Winner of CoinToss
                    const chooserWon = room.coin_result === room.coin_choice.toUpperCase();
                    setTossWinner(isHost ? !chooserWon : chooserWon)
                }

                // Coin Choice of Players
                if (room.coin_choice) {
                    if (isHost) {
                        setChosenCoin(room.coin_choice);
                        setMySide(room.coin_choice === 'heads' ? 'TAILS' : 'HEADS');
                    }
                }

                // Play Order
                if (room.current_role_p1 && room.current_role_p2) {
                    const myRole = isHost ? room.current_role_p1 : room.current_role_p2;
                    setRole(myRole);
                }

                /* Game State Assignment */

                // Data Update
                setStrikes(room.strikes);
                setOuts(room.outs);
                setBalls(room.balls);
                setInning(room.inning);
                setInningFrame(room.inning_frame);
                setScoreHome(room.score_home);
                setScoreAway(room.score_away);

                // Runners data
                setRunners({
                    first: room.runner_first ?? false,
                    second: room.runner_second ?? false,
                    third: room.runner_third ?? false
                });

                // END GAME
                if (room.inning > 9) {
                    async function endGame() {
                        await gameOver(roomCode)
                        setScreen('gameover')
                    }
                    if (scoreHome > scoreAway || scoreAway > scoreHome) endGame();
                }
            })
            .subscribe()

        return () => supabase.removeChannel(channel);
    }, [roomCode]);


    /* COIN TOSS SCREEN BEFORE GAME */
    if (role === 'choosing') return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
            {/* COIN SPRITE  - SUBJECT TO CHANGE */}
            <div className="relative flex items-center justify-center w-45 h-45 rounded-full 
              bg-linear-to-tr from-yellow-600 via-yellow-400 to-yellow-200 
              shadow-[0_10px_20px_rgba(0,0,0,0.3),inset_0_-4px_8px_rgba(0,0,0,0.5),inset_0_4px_8px_rgba(255,255,255,0.8)] 
              border-4 border-yellow-700">
                <div className="absolute inset-2 rounded-full border-2 border-dashed border-yellow-600/30"></div>
                <span className="text-4xl font-bold text-yellow-900 drop-shadow-md select-none">{coinRes}</span>
            </div>

            {/* If not host Choose if Tails or Heads */}
            {!isHost ? (
                chosenCoin ? (
                    <div className="text-white p-4">You chose: {mySide}</div>
                ) : (
                    <div className="flex gap-4 p-4 m-4">
                        <button
                            onClick={async () => {
                                setChosenCoin('heads');
                                setMySide('HEADS')
                                await coinChoice(roomCode, 'heads');
                                await updateCoinTossRes(roomCode, coinRes);
                            }}
                            className="bg-gray-300 border-2 border-gray-700 border-b-12 rounded-4xl px-6 py-4 cursor-pointer font-bold text-gray-900 text-center w-50 -translate-y-1 active:translate-y-0 active:border-b-0"
                        >
                            Choose Heads ?
                        </button>
                        <button
                            onClick={async () => {
                                setChosenCoin('tails');
                                setMySide('TAILS')
                                await coinChoice(roomCode, 'tails');
                                await updateCoinTossRes(roomCode, coinRes);
                            }}
                            className="bg-gray-300 border-2 border-gray-700 border-b-12 rounded-4xl px-6 py-4 cursor-pointer font-bold text-gray-900 text-center w-50 -translate-y-1 active:translate-y-0 active:border-b-0"
                        >
                            Choose Tails ?
                        </button>
                    </div>
                )
            ) : (chosenCoin ? (
                <div className="text-white p-4">You Got: {mySide}</div>
            ) : (
                <div className="text-white p-4">Waiting for opponent to choose...</div>)
            )}

            {/* Win/Lose Result */}
            {tossWinner !== null && (
                <div className="p-4 m-4 bg-gray-800 rounded-2xl border-2 border-s-gray-300 text-white text-xl font-bold mt-4 text-center"
                >
                    {tossWinner ? (
                        <>
                            <div>🏆 You Win the Toss! Choose Play Order</div>
                            <div className="flex gap-4 p-4 m-4">
                                <button
                                    className="bg-gray-300 border-2 border-gray-700 border-b-12 rounded-4xl px-6 py-4 cursor-pointer font-bold text-gray-900 text-center w-50 -translate-y-1 active:translate-y-0 active:border-b-0"
                                    onClick={async () => {
                                        setRoleChosen('pitcher');
                                        await updatePlayerRole(roomCode, 'pitcher', isHost) // Checks Roomcode, Determines role, Checks if Player 1 or 2
                                    }}
                                >
                                    Pitcher First
                                </button>
                                <button
                                    className="bg-gray-300 border-2 border-gray-700 border-b-12 rounded-4xl px-6 py-4 cursor-pointer font-bold text-gray-900 text-center w-50 -translate-y-1 active:translate-y-0 active:border-b-0"
                                    onClick={async () => {
                                        setRoleChosen('batter');
                                        await updatePlayerRole(roomCode, 'batter', isHost) // Checks Roomcode, Determines role, Checks if Player 1 or 2
                                    }}
                                >
                                    Batter First
                                </button>
                            </div>
                        </>
                    ) : (
                        <div>😔 You Lost the Toss! Opponent is Choosing Play Order</div>
                    )}
                </div>
            )}
        </div>
    );

    /* GAME SCREEN - PITCHER */
    if (role === 'pitcher') return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-green-900">

            {/* Scoreboard */}
            <div className="absolute left-4 top-4">
                <ScoreBoard
                    inning={inning}
                    inningFrame={inningFrame}
                    strikes={strikes}
                    balls={balls}
                    outs={outs}
                    scoreHome={scoreHome}
                    scoreAway={scoreAway}
                    roomCode={roomCode}
                />
            </div>

            {/* Minimap */}
            <div className="absolute right-4 top-4">
                <MiniMap runners={runners} />
            </div>

            {/* Current Role */}
            <div className="size-10 rounded-2xl bg-radial-[at_25%_25%] from-orange-300 to-yellow-950 to-75% w-70 text-2xl text-center text-white font-extrabold text-shadow-black"
            >
                Pitching
            </div>

            <PitchingField
                pitches={pitches}
                selected={selected}
                roomCode={roomCode}
                outs={outs}
                balls={balls}
                strikes={strikes}
                inning={inning}
                scoreHome={scoreHome}
                scoreAway={scoreAway}
            />
            <PitchSelector
                pitches={pitches}
                selected={selected}
                setSelected={setSelected}
            />

        </div>
    );

    /* GAME SCREEN - BATTER */
    if (role === 'batter') return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-green-900">

            {/* Scoreboard */}
            <div className="absolute left-4 top-4">
                <ScoreBoard
                    inning={inning}
                    inningFrame={inningFrame}
                    strikes={strikes}
                    balls={balls}
                    outs={outs}
                    scoreHome={scoreHome}
                    scoreAway={scoreAway}
                    roomCode={roomCode}
                />
            </div>

            {/* Minimap */}
            <div className="absolute right-4 top-4">
                <MiniMap runners={runners} />
            </div>

            {/* Current Role */}
            <div className="size-10 rounded-2xl bg-radial-[at_25%_25%] from-orange-300 to-yellow-950 to-75% w-70 text-2xl text-center text-white font-extrabold text-shadow-black"
            >
                Batting
            </div>

            <BattingField
                bats={bats}
                selected={selected}
                setSelected={setSelected}
                pitches={pitches}
                roomCode={roomCode}
                strikes={strikes}
                balls={balls}
                outs={outs}
                inning={inning}
                scoreHome={scoreHome}
                scoreAway={scoreAway}
                isHost={isHost}
            />
            <BattingSelector
                bats={bats}
                selected={selected}
                setSelected={setSelected}
            />

        </div>
    );

    /* FAIL SAFE RETURN / LOADING SCREEN */
    return (
        <Loading />
    );
}

export default Game;