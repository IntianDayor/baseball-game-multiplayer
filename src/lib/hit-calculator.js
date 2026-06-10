
export function determineHitType(distance, pitchPower, swingType) {

    // Base score from distance (0-100 lower distance = higher score)
    const distanceScore = Math.max(0, 100 - (distance * 2));

    // Meatball bonus (low pitcher power = higher bonus)
    const meatballBonus = Math.max(0, 50 - pitchPower);

    const total = distanceScore + meatballBonus;

    // Swing modifiers
    if (swingType === 'Q') { // Power Swing
        if (total >= 120) return 'homerun';
        if (total >= 80 && total < 120) return 'double';
        if (total >= 50 && total < 80) return 'single';
        if (total >= 30) return 'foul';
        return 'out';
    }
    if (swingType === 'W') { // Contact Swing 
        if (total >= 130) return 'double';
        if (total >= 60 && total < 130) return 'single';
        if (total >= 40) return 'foul';
        return 'out';
    }
    if (swingType === 'E') {
        if (total >= 80) return 'single';
        if (total >= 40) return 'sac_bunt';
        return 'foul';
    }
}