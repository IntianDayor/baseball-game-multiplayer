export const PERFECT_WINDOW_MS = 40;

export function getTrajectory(verticalOffset, radius) {
    const threshold = radius * 0.3;

    if (verticalOffset < -threshold) return 'grounder';
    if (verticalOffset > threshold) return 'flyball';

    return 'liner';
}

function getContactQuality(distance, radius) {
    if (distance > radius) return 'miss';
    if (distance <= radius * 0.25) return 'perfect';
    if (distance <= radius * 0.60) return 'good';
    return 'bad';
}

export function getTimingQuality(timingOffset, reactionTime) {
    const adjusted = timingOffset - reactionTime;

    if (adjusted < -120) return "very_early";
    if (adjusted < -PERFECT_WINDOW_MS) return "early";
    if (adjusted < PERFECT_WINDOW_MS) return "perfect";
    if (adjusted < 120) return "late";
    return "very_late";
}

function applyTimingModifier(baseResult, timingQuality) {
    const roll = Math.random();

    if (timingQuality === 'perfect') return baseResult;

    if (timingQuality === 'early' || timingQuality === 'late') {
        if (baseResult === 'homerun') return 'double';
        if (baseResult === 'double') return roll < 0.40 ? 'foul' : 'single';
        if (baseResult === 'single') return roll < 0.60 ? 'foul' : 'single';

        return baseResult;
    }

    if (timingQuality === 'very_early' || timingQuality === 'very_late') {
        if (roll < 0.25) return 'swing_miss';
        if (baseResult === 'homerun') return 'single';
        if (baseResult === 'double') return 'foul';
        if (baseResult === 'single') return 'foul';

        return baseResult;
    }

    return baseResult;
}

export function determineHitType(distance, radius, trajectory, timingOffset, reactionTime, pitchSpeed, pitchPower, swingType) {

    const quality = getContactQuality(distance, radius);

    const distanceScore = Math.max(0, 100 - (distance * 3));

    const meatballBonus = Math.max(0, 20 - pitchPower);

    const total = distanceScore + meatballBonus;

    let timingQuality = getTimingQuality(timingOffset, reactionTime);

    let baseResult;

    if (swingType === 'Q') {
        if (total >= 115) baseResult = 'homerun';
        else if (total >= 90) baseResult = 'double';
        else if (total >= 60) baseResult = 'single';
        else if (total >= 40) baseResult = 'foul';
        else baseResult = 'out';
    }

    if (swingType === 'W') {
        if (total >= 110) baseResult = 'double';
        else if (total >= 70) baseResult = 'single';
        else if (total >= 45) baseResult = 'foul';
        else baseResult = 'out';
    }

    if (swingType === 'E') {
        if (total >= 75) baseResult = 'single';
        else if (total >= 45) baseResult = 'sac_bunt';
        else baseResult = 'foul'
    }

     if (trajectory === 'grounder') {
        if (baseResult === 'homerun') baseResult = 'single';
    }

    if (quality === 'bad') {
        if (baseResult === 'homerun') baseResult = 'single';
    }

    if (quality === 'good') {
        if (baseResult === 'homerun') baseResult = 'double';
    }

    return applyTimingModifier(baseResult, timingQuality);
}

export function effectivePitchSpeed(baseSpeed, power) {

    return baseSpeed * 0.5 + baseSpeed * 0.5 * (power / 100);
}