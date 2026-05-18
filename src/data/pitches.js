export const PITCH_LIBRARY = {
  fastball: {
    name: "Fastball",
    key: "Q",
    speed: 10,
    breakX: 0,
    breakY: -1,
    breakTiming: 0,    // 0 = immediate, 1 = late
    color: "#ff4444",
    fixed: true,       // Always assigned to Q
  },
  curveball: {
    name: "Curveball",
    speed: 5,
    breakX: 1,
    breakY: -5,
    breakTiming: 0,
    color: "#ffffff",
  },
  slider: {
    name: "Slider",
    speed: 7,
    breakX: 4,
    breakY: -2,
    breakTiming: 0.7,  // Snaps late
    color: "#00cfff",
  },
  slurve: {
    name: "Slurve",
    speed: 6,
    breakX: 3,
    breakY: -3,
    breakTiming: 0,
    color: "#a78bfa",
  },
  knuckleball: {
    name: "Knuckleball",
    speed: 3,
    breakX: "random",
    breakY: "random",
    breakTiming: 0,
    color: "#fbbf24",
    chaos: true,       // Special behaviour
  },
  screwball: {
    name: "Screwball",
    speed: 6,
    breakX: -4,        // Opposite direction
    breakY: -3,
    breakTiming: 0,
    color: "#f97316",
  },
  changeup: {
    name: "Changeup",
    speed: 4,
    breakX: 0,
    breakY: -2,
    breakTiming: 0,
    color: "#84cc16",
    disguised: true,   // Looks like fastball to batter
  },
  forkball: {
    name: "Forkball",
    speed: 6,
    breakX: 0,
    breakY: -5,
    breakTiming: 0.8,  // Sudden late drop
    color: "#ec4899",
  },
}

export function getGamePitches() {
    const fixed = PITCH_LIBRARY.fastball

    // Get all pitches except fastball
    const pool = Object.values(PITCH_LIBRARY).filter(p => !p.fixed);

    // Shuffle pool
    const shuffled = pool.sort(()=> Math.random() - 0.5);

    // Pick random ones
    return {
        Q: {...fixed, key: "Q" },
        W: {...shuffled[0], key: "W"},
        E: {...shuffled[1], key: "E"},
    }
}