export function applyInningEngine(state) {
    let {
        outs,
        inning,
        inning_frame,
        runner_first,
        runner_second,
        runner_third
    } = state;

    let swapped = false;

    if (outs >= 3) {
        outs = 0;

        runner_first = false;
        runner_second = false;
        runner_third = false;

        if (inning_frame === 'bottom') {
            inning += 1;
            inning_frame = 'top';
        } else {
            inning_frame = 'bottom';
        }

        swapped = true;
    }

    return {
        state: {
            ...state,
            outs,
            inning,
            inning_frame,
            runner_first,
            runner_second,
            runner_third
        },
        swapped
    };
}

export function formatInning(inning, inningFrame) {

    if (inning === 0) throw new Error("There was an error in the system. Please try again later.")

    let suffix;

    if (inning === 1) suffix = "st";
    else if (inning === 2) suffix = "nd";
    else if (inning === 3) suffix = "rd";
    else if (inning >= 4) suffix = "th"; 
    else suffix = "";

    return inning > 9 
    ? `${inningFrame.toUpperCase()} OF THE EXTRA INNING!` 
    : `${inningFrame.toUpperCase()} OF THE ${inning}${suffix.toUpperCase()}`;

}