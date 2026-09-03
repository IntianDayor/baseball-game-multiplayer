const catchChance = {
    single: { Q: 0.30, W: 0.45, E: 0.80 },
    double: { Q: 0.15, W: 0.25, E: 0.00 },
    homerun: { Q: 0.00, W: 0.00, E: 0.00 },
    out: { Q: 1.00, W: 1.00, E: 1.00 }
};

const depthModifiers = {
    long: 0.12,
    medium: 0.00,
    short: -0.10,
};

export function rollFielder(hitType, swingType, conditions = {}) {
    const baseChance = catchChance[hitType]?.[swingType] ?? 0;
    const modifier = conditions.hitDepth ? depthModifiers[conditions.hitDepth] ?? 0 : 0;
    const chance = Math.max(0, Math.min(1, baseChance + modifier));
    const caught = Math.random() < chance;

    return {
        caught,
        result: caught ? 'out' : hitType
    };
}
