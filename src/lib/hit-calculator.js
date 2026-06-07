/* 
    HIT FORMULA: 

    hit quality = distance from hint (closer = better)
    pitch difficulty = pitcher's power (lower power = meatball = easier to hit well)

    final hit type formula:
    base_quality from distance + bonus if pitcher power was low (meatball)

*/

export function determineHitType(distance, pitchPower, swingType) {
    
    // Base score from distance (0-100 lower distance = higher score)
    const distanceScore = Math.max(0, 100 - (distance * 2));

    // Meatball bonus (low pitcher power = higher bonus)
    const meatballBonus = Math.max(0, 50 - pitchPower);

    // Total Score
    const total = distanceScore + meatballBonus;

    // Swing modifiers
    if (swingType === 'Q') { // Power Swing
        if (total >= 120) return 'homerun';
        if (total >= 80 && total < 120) return 'double';
        if (total >= 50 && total < 80) return 'single';
        return 'out';
    }
    if (swingType === 'W') { // Contact Swing 
        if (total >= 130) return 'double';
        if (total >= 60 && total < 130) return 'single';
        return 'out'; 
    }
    if (swingType === 'E') { // Bunt
        if (total >= 40) return 'single';
        return 'out';
    }
}