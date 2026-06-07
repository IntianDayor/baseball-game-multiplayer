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
    
    if(error) console.error('startGame error:', error);
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

    const {data, error} = await supabase
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
    const {data, error} = await supabase
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
export async function updateGameState(roomCode, result, isStrike) {
    // Fetch First Current State:
    const current = await checkRoomStatus(roomCode);

    let { strikes, balls, outs, inning } = current;

    // Count Manager
    if (result === 'hit') {
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

            // TODO: Walk Handler
        }
    }

    if (outs >= 3) {
        inning += 1;
        outs = 0;
        
        await swapRoles(roomCode, current.current_role_p1);
    }

    // Write to Database
    const {data, error} = await supabase 
        .from('rooms')
        .update({ strikes, balls, outs, inning })
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
        })
        .eq('id', roomCode)
        .select()
        .single()

    if (error) console.error('swapRoles error:', error);
    return data;
}