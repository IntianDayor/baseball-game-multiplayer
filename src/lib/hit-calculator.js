export function determineHitType(distance, pitchPower, swingType) {

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