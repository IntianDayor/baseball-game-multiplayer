import { useState } from "react";
import { PITCH_LIBRARY } from "../data/pitches";
import { gameOver, updateDevGameState, updateDevPitchSet } from "../lib/rooms";

const PITCHES = Object.entries(PITCH_LIBRARY);

function DevSettings({ roomCode, isHost, pitches, gameState, onClose, setScreen }) {
    const [loadout, setLoadout] = useState(() => ({
        Q: pitches?.Q?.name ?? PITCH_LIBRARY.fastball.name,
        W: pitches?.W?.name ?? PITCH_LIBRARY.slider.name,
        E: pitches?.E?.name ?? PITCH_LIBRARY.curveball.name
    }));
    const [state, setState] = useState(gameState);
    const [message, setMessage] = useState('');

    const changeState = (key, value) => setState(current => ({ ...current, [key]: value }));

    const saveScenario = async () => {
        setMessage('Saving scenario...');
        const result = await updateDevGameState(roomCode, {
            inning: Math.max(1, Number(state.inning) || 1),
            inning_frame: state.inning_frame,
            strikes: Math.min(2, Math.max(0, Number(state.strikes) || 0)),
            balls: Math.min(3, Math.max(0, Number(state.balls) || 0)),
            outs: Math.min(2, Math.max(0, Number(state.outs) || 0)),
            score_home: Math.max(0, Number(state.score_home) || 0),
            score_away: Math.max(0, Number(state.score_away) || 0),
            runner_first: state.runner_first,
            runner_second: state.runner_second,
            runner_third: state.runner_third,
            game_frozen: state.game_frozen ?? false
        });
        setMessage(result ? 'Scenario applied to this room.' : 'Could not save. Check the console/Supabase policy.');
    };

    const savePitchLoadout = async () => {
        const byName = Object.values(PITCH_LIBRARY).reduce((map, pitch) => {
            map[pitch.name] = pitch;
            return map;
        }, {});

        const testPitches = Object.fromEntries(
            Object.entries(loadout).map(([key, name]) => [key, { ...byName[name], key }])
        );
        setMessage('Saving pitch loadout...');
        const result = await updateDevPitchSet(roomCode, isHost, testPitches);
        setMessage(result ? 'Test loadout applied. Your next pitch uses it.' : 'Could not save pitch loadout.');
    };

    const finishGame = async () => {
        await gameOver(roomCode);
        setScreen('gameover');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <section className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border-2 border-amber-400 bg-gray-900 p-5 text-white shadow-2xl">
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-black text-amber-300">Developer Settings</h2>
                        <p className="text-xs text-gray-400">Changes apply to everyone in room {roomCode}.</p>
                    </div>
                    <button onClick={onClose} className="rounded bg-gray-700 px-3 py-1 text-sm hover:bg-gray-600">Close</button>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                    <div className="rounded-xl bg-gray-800 p-4">
                        <h3 className="mb-3 font-bold text-amber-200">My test pitch loadout</h3>
                        <p className="mb-3 text-xs text-gray-400">Overrides only your random Q/W/E pitches. Rejoin/create a room to return to normal random generation.</p>
                        {['Q', 'W', 'E'].map(key => (
                            <label key={key} className="mb-2 flex items-center gap-2 text-sm">
                                <span className="w-5 font-bold">{key}</span>
                                <select value={loadout[key]} onChange={event => setLoadout(current => ({ ...current, [key]: event.target.value }))} className="min-w-0 flex-1 rounded bg-gray-700 p-2">
                                    {PITCHES.map(([id, pitch]) => <option key={id} value={pitch.name}>{pitch.name}</option>)}
                                </select>
                            </label>
                        ))}
                        <button onClick={savePitchLoadout} className="mt-2 rounded bg-amber-500 px-3 py-2 text-sm font-bold text-gray-950 hover:bg-amber-400">Apply test pitches</button>
                    </div>

                    <div className="rounded-xl bg-gray-800 p-4">
                        <h3 className="mb-3 font-bold text-amber-200">Game scenario</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <label>Inning<input type="number" min="1" value={state.inning} onChange={event => changeState('inning', event.target.value)} className="mt-1 w-full rounded bg-gray-700 p-2" /></label>
                            <label>Half<select value={state.inning_frame} onChange={event => changeState('inning_frame', event.target.value)} className="mt-1 w-full rounded bg-gray-700 p-2"><option value="top">Top</option><option value="bottom">Bottom</option></select></label>
                            <label>Home score<input type="number" min="0" value={state.score_home} onChange={event => changeState('score_home', event.target.value)} className="mt-1 w-full rounded bg-gray-700 p-2" /></label>
                            <label>Away score<input type="number" min="0" value={state.score_away} onChange={event => changeState('score_away', event.target.value)} className="mt-1 w-full rounded bg-gray-700 p-2" /></label>
                            <label>Outs<input type="number" min="0" max="2" value={state.outs} onChange={event => changeState('outs', event.target.value)} className="mt-1 w-full rounded bg-gray-700 p-2" /></label>
                            <label>Strikes<input type="number" min="0" max="2" value={state.strikes} onChange={event => changeState('strikes', event.target.value)} className="mt-1 w-full rounded bg-gray-700 p-2" /></label>
                            <label>Balls<input type="number" min="0" max="3" value={state.balls} onChange={event => changeState('balls', event.target.value)} className="mt-1 w-full rounded bg-gray-700 p-2" /></label>
                        </div>
                        <div className="mt-3 flex gap-3 text-sm">
                            {['first', 'second', 'third'].map(base => <label key={base} className="flex items-center gap-1"><input type="checkbox" checked={state[`runner_${base}`]} onChange={event => changeState(`runner_${base}`, event.target.checked)} /> {base}</label>)}
                        </div>
                        <label className="mt-3 flex items-center gap-2 rounded bg-gray-700 p-2 text-sm font-bold">
                            <input type="checkbox" checked={state.game_frozen ?? false} onChange={event => changeState('game_frozen', event.target.checked)} />
                            Freeze game progression
                        </label>
                        <p className="mt-2 text-xs text-gray-400">When enabled, pitches won't advance counts, outs, or innings.</p>
                        <button onClick={saveScenario} className="mt-4 rounded bg-amber-500 px-3 py-2 text-sm font-bold text-gray-950 hover:bg-amber-400">Apply scenario</button>
                    </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-gray-700 pt-4">
                    <span className="text-xs text-gray-400">{message}</span>
                    <button onClick={finishGame} className="rounded bg-red-700 px-3 py-2 text-sm font-bold hover:bg-red-600">Force game over</button>
                </div>
            </section>
        </div>
    );
}

export default DevSettings;
