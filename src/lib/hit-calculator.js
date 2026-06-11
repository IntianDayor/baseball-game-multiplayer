function getContactQuality(distance, radius) {
    if (distance > radius) return 'miss';
    if (distance <= radius * 0.25) return 'perfect';
    if (distance <= radius * 0.60) return 'good';
    return 'bad';
}

export function determineHitType(distance, radius, pitchPower, swingType) {

    const quality = getContactQuality(distance, radius);

    const distanceScore = Math.max(0, 100 - (distance * 3));

    const meatballBonus = Math.max(0, 20 - pitchPower);

    const total = distanceScore + meatballBonus;

    if (swingType === 'Q') { // Power
        if (total >= 115) return 'homerun';
        if (total >= 90) return 'double';
        if (total >= 60) return 'single';
        if (total >= 40) return 'foul';
        return 'out';
    }

    if (swingType === 'W') { // Contact
        if (total >= 110) return 'double';
        if (total >= 70) return 'single';
        if (total >= 45) return 'foul';
        return 'out';
    }

    if (swingType === 'E') { // Bunt
        if (total >= 75) return 'single';
        if (total >= 45) return 'sac_bunt';
        return 'foul';
    }
}

export function getTimingQuality(timingOffset, pitchSpeed) {
    const adjusted = timingOffset - (pitchSpeed * 20);

    if (adjusted < -120) return "very_early";
    if (adjusted < -40) return "early";
    if (adjusted < 40) return "perfect";
    if (adjusted < 120) return "late";
    return "very_late";
}