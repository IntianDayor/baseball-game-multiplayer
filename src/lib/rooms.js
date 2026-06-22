import { supabase } from './supabase'
import { getGamePitches } from '../data/pitches';
import { applyCountEngine } from './engines/counts';
import { applyInningEngine } from './engines/innings';
import { applyRunnerEngine } from './engines/runners';
import { applyWalkEngine } from './engines/walks';

// =============== LOBBY =============== //

// ROOM CREATE
export async function createRoom(roomCode) {
    const { data, error } = await supabase
        .from('rooms')
        .insert({
            id: roomCode,
            status: 'waiting',
            player1_id: roomCode + '_p1',
            pitch_set_p1: getGamePitches(),
            pitch_set_p2: getGamePitches(),
        })
        .select()
        .single()

    if (error) console.error('createRoom error:', error);
    return data;

}

// ROOM JOIN
export async function joinRoom(roomCode) {
    const { data, error } = await supabase
        .from('rooms')
        .update({
            player2_id: roomCode + '_p2',
            status: 'active'
        })
        .eq('id', roomCode)
        .select()
        .single()

    if (error) console.error('joinRoom error:', error);
    return data;
}

// START GAME
export async function startGame(roomCode) {
    const { data, error } = await supabase
        .from('rooms')
        .update({
            status: 'playing'
        })
        .select()
        .eq('id', roomCode)
        .single()

    if (error) console.error('startGame error:', error);
    return data;
}

// Game Over
export async function gameOver(roomCode) {
    const { data, error } = await supabase
        .from('rooms')
        .update({
            status: 'gameover'
        })
        .select()
        .eq('id', roomCode)
        .single()

    if (error) console.error('gameOver error:', error);
    return data;
}

// =============== COIN TOSS MECHANIC =============== //

// CHOSEN COIN
export async function coinChoice(roomCode, chosenCoin) {
    const { data, error } = await supabase
        .from('rooms')
        .update({
            coin_choice: chosenCoin
        })
        .select()
        .eq('id', roomCode)
        .single()

    if (error) console.error('coinChoice error:', error);
    return data;
}

// COIN TOSS RESULT
export async function updateCoinTossRes(roomCode, coinRes) {
    const { data, error } = await supabase
        .from('rooms')
        .update({
            coin_result: coinRes
        })
        .select()
        .eq('id', roomCode)
        .single()

    if (error) console.error('coinTossRes error:', error);
    return data;
}

// =============== ROOM STATS =============== //

// CHECK ROOM STATUS
export async function checkRoomStatus(roomCode) {
    const { data, error } = await supabase
        .from('rooms')
        .select()
        .eq('id', roomCode)
        .single()

    if (error) console.error('checkRoomStatus error:', error);
    return data;
}

// =============== PLAY ORDER - PITCHING OR BATTING =============== //

// UPDATE ROLE
export async function updatePlayerRole(roomCode, chosenRole, isHost) {
    const oppposite = chosenRole === 'pitcher' ? 'batter' : 'pitcher'; // Opposite of winner chosen role

    const { data, error } = await supabase
        .from('rooms')
        .update({
            current_role_p1: isHost ? chosenRole : oppposite,
            current_role_p2: isHost ? oppposite : chosenRole
        })
        .select()
        .eq('id', roomCode)
        .single()

    if (error) console.error('updatePlayerRole error:', error);
    return data;
}

// PITCH THROWING
export async function throwPitch(roomCode, pitchData) {
    const { data, error } = await supabase
        .from('pitches')
        .insert([{
            room_id: roomCode,
            aim_x: pitchData.aim_x,
            aim_y: pitchData.aim_y,
            final_x: pitchData.final_x,
            final_y: pitchData.final_y,
            hint_x: pitchData.hint_x,
            hint_y: pitchData.hint_y,
            break_scale: pitchData.break_scale,
            power: pitchData.power,
            pitch_type: pitchData.pitch_type,
            is_strike: pitchData.is_strike,
            thrown_at: pitchData.thrown_at
        }])
        .select()
        .single()

    if (error) console.error('throwPitch error:', error);
    return data;
}

// SWING DETECTION
export async function swingAt(pitchId, roomCode, swingData) {
    const { data, error } = await supabase
        .from('swings')
        .insert({
            pitch_id: pitchId,
            room_id: roomCode,
            swing_x: swingData.swing_x,
            swing_y: swingData.swing_y,
            swing_type: swingData.swing_type,
            swing_at: new Date().toISOString(),
            result: swingData.result
        })
        .select()
        .single()

    if (error) console.error('swingAt error:', error);
    return data
}

// =============== GAME STATE MANAGER =============== //

// UPDATING GAME STATE
export async function updateGameState(roomCode, result, isStrike, isHost) {
    // Fetch First Current State:
    const current = await checkRoomStatus(roomCode);

    // Count Manager
    let state = {
        ...current,
        ...applyCountEngine(current, result)
    };

    // Walk Mechanic Manager
    const walk = applyWalkEngine(state, result);
    state = walk.state;
    result = walk.result;

    // Runner Advancement Manager
    state = {
        ...state,
        ...applyRunnerEngine(state, result, isHost)
    };

    // Inning / Inning Frame Manager
    const inning = applyInningEngine(state);
    state = inning.state;

    if (inning.swapped) {
        await swapRoles(roomCode, state.current_role_p1);
    }

    const { data, error } = await supabase
        .from('rooms')
        .update({
            strikes: state.strikes,
            balls: state.balls,
            outs: state.outs,
            inning: state.inning,
            inning_frame: state.inning_frame,
            runner_first: state.runner_first,
            runner_second: state.runner_second,
            runner_third: state.runner_third,
            score_home: state.score_home,
            score_away: state.score_away
        })
        .eq('id', roomCode)
        .select()
        .single();

    if (error) console.error("updateGameState error:", error);

    return data;
}

// ROLE SWITCHING
export async function swapRoles(roomCode, currentRoleP1) {
    const newRoleP1 = currentRoleP1 === 'pitcher' ? 'batter' : 'pitcher';
    const newRoleP2 = currentRoleP1 === 'pitcher' ? 'pitcher' : 'batter';

    const { data, error } = await supabase
        .from('rooms')
        .update({
            current_role_p1: newRoleP1,
            current_role_p2: newRoleP2,
            runner_first: false,
            runner_second: false,
            runner_third: false
        })
        .eq('id', roomCode)
        .select()
        .single()

    if (error) console.error('swapRoles error:', error);
    return data;
}