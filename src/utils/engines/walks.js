export function applyWalkEngine(state, result) {
    let { balls, runner_first, runner_second, runner_third, score_home, score_away } = state;

    if (balls < 4) return { state, result };

    balls = 0;
    const strikes = 0;
    result = 'walk';

    return {
        state: {
            ...state,
            balls,
            strikes,
            runner_first,
            runner_second,
            runner_third,
            score_home,
            score_away
        },
        result
    };
}
