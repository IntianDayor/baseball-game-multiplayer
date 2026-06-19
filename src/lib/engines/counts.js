export function applyCountEngine(state, result) {
    let { strikes, balls, outs } = state;

    if (result === 'single' || result === 'double' || result === 'homerun') {
        strikes = 0;
        balls = 0;
    }

    else if (result === 'swing_miss' || result === 'called_strike') {
        strikes += 1;
        if (strikes >= 3) {
            strikes = 0;
            balls = 0;
            outs += 1;
        }
    }

    else if (result === 'ball') {
        balls += 1;
    }

    else if (result === 'foul') {
        if (strikes < 2) strikes += 1;
    }

    else if (result === 'out' || result === 'sac_bunt') {
        outs += 1;
        strikes = 0;
        balls = 0;
    }

    return { strikes, balls, outs };
}