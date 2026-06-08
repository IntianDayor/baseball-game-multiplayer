import { supabase } from './supabase'

// =============== LOBBY =============== //

// ROOM CREATE
export async function createRoom(roomCode) {
    const { data, error } = await supabase
        .from('rooms')
        .insert({
            id: roomCode,
            status: 'waiting',
            player1_id: roomCode + '_p1',
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
        .insert({
            room_id: roomCode,
            pitch_type: pitchData.pitch_type,
            aim_x: pitchData.aim_x,
            aim_y: pitchData.aim_y,
            power: pitchData.power,
            is_strike: pitchData.is_strike,
            thrown_at: pitchData.thrown_at
        })
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

    // Runner Advancement Logic
    let { runner_first, runner_second, runner_third, score_home, score_away } = current;

    if (result === 'homerun') {
        if (runner_third) isHost ? score_home += 1 : score_away += 1
        if (runner_second) isHost ? score_home += 1 : score_away += 1
        if (runner_first) isHost ? score_home += 1 : score_away += 1
        isHost ? score_home += 1 : score_away += 1
        runner_first = false
        runner_second = false
        runner_third = false
    } else if (result === 'double') {
        if (runner_third) isHost ? score_home += 1 : score_away += 1
        if (runner_second) isHost ? score_home += 1 : score_away += 1
        runner_third = runner_first
        runner_second = true
        runner_first = false
    } else if (result === 'single') {
        if (runner_third) isHost ? score_home += 1 : score_away += 1
        runner_third = runner_second
        runner_second = runner_first
        runner_first = true
    }

    // Count Manager
    let { strikes, balls, outs, inning } = current;

    if (result === 'single' || result === 'double' || result === 'homerun') {
        strikes = 0;
        balls = 0;
    } else if (result === 'swing_miss' || result === 'called_strike') {
        strikes += 1;
        if (strikes >= 3) {
            strikes = 0;
            balls = 0;
            outs += 1;
        }
    } else if (result === 'ball') {
        balls += 1;
        if (balls >= 4) {
            strikes = 0;
            balls = 0;

            // Walk if there is 4 balls
            runner_third = runner_second;
            runner_second = runner_first;
            runner_first = true;
            if (runner_third) isHost ? score_home += 1 : score_away += 1 // Scores if bases are loaded
        }
    } else if (result === 'out') {
        outs += 1;
    }

    // Reset after inning
    if (outs >= 3) {
        inning += 1;
        outs = 0;

        runner_first = false;
        runner_second = false;
        runner_third = false;

        await swapRoles(roomCode, current.current_role_p1);
    }

    // Write to Database
    const { data, error } = await supabase
        .from('rooms')
        .update({
            strikes,
            balls,
            outs,
            inning,
            runner_first,
            runner_second,
            runner_third,
            score_home,
            score_away
        })
        .eq('id', roomCode)
        .select()
        .single()

    if (error) console.error('updateGameState error:', error);
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