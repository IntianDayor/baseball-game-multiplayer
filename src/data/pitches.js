
const SPIN_PROFILES = {
  BACKSPIN: {
    spinType: "BACKSPIN",
    spinRate: 1.5,
    spinDirection: 1,
    spinJitter: 0,
  },

  TOPSPIN: {
    spinType: "TOPSPIN",
    spinRate: 1.4,
    spinDirection: 1,
    spinJitter: 0,
  },

  SIDESPIN: {
    spinType: "SIDESPIN",
    spinRate: 1.5,
    spinDirection: 1,
    spinJitter: 0,
  },

  COMBINED: {
    spinType: "COMBINED",
    spinRate: 0.9,
    spinDirection: 1,
    spinJitter: 0,
  },

  UNSTABLE: {
    spinType: "UNSTABLE",
    spinRate: 0.2,
    spinDirection: 1,
    spinJitter: 25,
  },
};

export const PITCH_LIBRARY = {
  fastball: {
    name: "Fastball",
    speed: 10,
    breakX: 0,
    breakY: -1,
    breakTiming: 0,
    fixed: true,

    ...SPIN_PROFILES.BACKSPIN,
    spinRate: 1.8,
  },

  twoSeam: {
    name: "Two-Seam Fastball",
    speed: 9,
    breakX: -2,
    breakY: -2,
    breakTiming: 0.3,

    ...SPIN_PROFILES.BACKSPIN,
    spinRate: 1.6,
  },

  cutter: {
    name: "Cutter",
    speed: 9,
    breakX: 2,
    breakY: -1,
    breakTiming: 0.55,

    ...SPIN_PROFILES.BACKSPIN,
    spinRate: 1.7,
  },

  sinker: {
    name: "Sinker",
    speed: 8,
    breakX: -1,
    breakY: -4,
    breakTiming: 0.3,

    ...SPIN_PROFILES.COMBINED,
    spinRate: 1.0,
  },

  splitter: {
    name: "Splitter",
    speed: 7,
    breakX: 0,
    breakY: -6,
    breakTiming: 0.5,

    ...SPIN_PROFILES.COMBINED,
    spinRate: 0.5,
    spinJitter: 8,
  },

  forkball: {
    name: "Forkball",
    speed: 6,
    breakX: 0,
    breakY: -6,
    breakTiming: 0.45,

    ...SPIN_PROFILES.UNSTABLE,
    spinJitter: 35,
  },

  changeup: {
    name: "Changeup",
    speed: 7,
    breakX: 1,
    breakY: -2,
    breakTiming: 0.25,
    disguised: true,

    ...SPIN_PROFILES.BACKSPIN,
    spinRate: 1.1,
  },

  circleChange: {
    name: "Circle Change",
    speed: 7,
    breakX: -2,
    breakY: -3,
    breakTiming: 0.35,
    disguised: true,

    ...SPIN_PROFILES.BACKSPIN,
    spinRate: 1.1,
  },

  curveball: {
    name: "Curveball",
    speed: 5,
    breakX: 1,
    breakY: -5,
    breakTiming: 0.15,

    ...SPIN_PROFILES.TOPSPIN,
    spinRate: 1.5,
  },

  knuckleCurve: {
    name: "Knuckle Curve",
    speed: 5,
    breakX: 1,
    breakY: -5,
    breakTiming: 0.25,

    ...SPIN_PROFILES.TOPSPIN,
    spinRate: 1.3,
    spinJitter: 4,
  },

  slider: {
    name: "Slider",
    speed: 7,
    breakX: 4,
    breakY: -2,
    breakTiming: 0.5,

    ...SPIN_PROFILES.SIDESPIN,
    spinRate: 1.5,
  },

  sweeper: {
    name: "Sweeper",
    speed: 6,
    breakX: 6,
    breakY: -1,
    breakTiming: 0.45,

    ...SPIN_PROFILES.SIDESPIN,
    spinRate: 1.8,
  },

  slurve: {
    name: "Slurve",
    speed: 6,
    breakX: 3,
    breakY: -3,
    breakTiming: 0.35,

    ...SPIN_PROFILES.COMBINED,
    spinRate: 1.2,
  },

  screwball: {
    name: "Screwball",
    speed: 6,
    breakX: -4,
    breakY: -3,
    breakTiming: 0.35,

    ...SPIN_PROFILES.SIDESPIN,
    spinDirection: -1,
    spinRate: 1.4,
  },

  knuckleball: {
    name: "Knuckleball",
    speed: 3,
    breakX: "random",
    breakY: "random",
    breakTiming: 0,
    chaos: true,

    ...SPIN_PROFILES.UNSTABLE,
    spinRate: 0.1,
    spinJitter: 45,
  },

  eephus: {
    name: "Eephus",
    speed: 2,
    breakX: 0,
    breakY: -1,
    breakTiming: 0,

    ...SPIN_PROFILES.TOPSPIN,
    spinRate: 0.4,
  },
};

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