export function applyRunnerEngine(state, result, isHost) {
    let {
        runner_first,
        runner_second,
        runner_third,
        score_home,
        score_away
    } = state;

    const score = (n = 1) => {
        if (isHost) score_home += n;
        else score_away += n;
    };

    if (result === 'homerun') {
        if (runner_first) score();
        if (runner_second) score();
        if (runner_third) score();
        score();

        runner_first = runner_second = runner_third = false;
    }

    else if (result === 'double') {
        if (runner_third) score();
        if (runner_second) score();

        runner_third = runner_first;
        runner_second = true;
        runner_first = false;
    }

    else if (result === 'single') {
        if (runner_third) score();

        runner_third = runner_second;
        runner_second = runner_first;
        runner_first = true;
    }

    else if (result === 'sac_bunt') {
        if (runner_third) score();

        runner_third = runner_second;
        runner_second = runner_first;
        runner_first = false;
    }

    else if (result === 'walk') {
        if (!runner_first) runner_first = true;
        else if (!runner_second) {
            runner_second = runner_first;
            runner_first = true;
        }
        else if (!runner_third) {
            runner_third = runner_second;
            runner_second = runner_first;
            runner_first = true;
        }
        else {
            score();
            runner_third = runner_second;
            runner_second = runner_first;
            runner_first = true;
        }
    }

    return {
        runner_first,
        runner_second,
        runner_third,
        score_home,
        score_away
    };
}