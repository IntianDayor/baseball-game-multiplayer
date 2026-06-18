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