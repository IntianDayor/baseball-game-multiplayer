import { supabase } from './supabase'

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

    if (error) console.error('createRoom error:', error)
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

    if (error) console.error('joinRoom error:', error)
    return data;
}

// CHECK ROOM STATUS
export async function checkRoomStatus(roomCode) {
    const { data, error } = await supabase
        .from('rooms')
        .select()
        .eq('id', roomCode)
        .single()
    
    if (error) console.error('checkRoomStatus error:', error)
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
    
    if(error) console.error('startGame error:', error)
    return data;
}

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

    if (error) console.error('coinChoice error:', error)
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

    if (error) console.error('coinTossRes error:', error)
    return data;
}