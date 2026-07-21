export const PITCH_LIBRARY = {
  fastball: {
    name: "Fastball",
    speed: 10,
    breakX: 0,
    breakY: -1,
    breakTiming: 0,
    fixed: true,
  },

  twoSeam: {
    name: "Two-Seam Fastball",
    speed: 9,
    breakX: -2,
    breakY: -2,
    breakTiming: 0.4,
  },

  cutter: {
    name: "Cutter",
    speed: 9,
    breakX: 2,
    breakY: -1,
    breakTiming: 0.7,
  },

  sinker: {
    name: "Sinker",
    speed: 8,
    breakX: -1,
    breakY: -4,
    breakTiming: 0.6,
  },

  splitter: {
    name: "Splitter",
    speed: 7,
    breakX: 0,
    breakY: -6,
    breakTiming: 0.85,
  },

  forkball: {
    name: "Forkball",
    speed: 6,
    breakX: 0,
    breakY: -6,
    breakTiming: 0.8,
  },

  changeup: {
    name: "Changeup",
    speed: 4,
    breakX: 1,
    breakY: -2,
    breakTiming: 0.3,
    disguised: true,
  },

  circleChange: {
    name: "Circle Change",
    speed: 4,
    breakX: -2,
    breakY: -3,
    breakTiming: 0.5,
    disguised: true,
  },

  curveball: {
    name: "Curveball",
    speed: 5,
    breakX: 1,
    breakY: -5,
    breakTiming: 0,
  },

  knuckleCurve: {
    name: "Knuckle Curve",
    speed: 5,
    breakX: 1,
    breakY: -5,
    breakTiming: 0.4,
  },

  slider: {
    name: "Slider",
    speed: 7,
    breakX: 4,
    breakY: -2,
    breakTiming: 0.7,
  },

  sweeper: {
    name: "Sweeper",
    speed: 6,
    breakX: 6,
    breakY: -1,
    breakTiming: 0.75,
  },

  slurve: {
    name: "Slurve",
    speed: 6,
    breakX: 3,
    breakY: -3,
    breakTiming: 0.5,
  },

  screwball: {
    name: "Screwball",
    speed: 6,
    breakX: -4,
    breakY: -3,
    breakTiming: 0.5,
  },

  knuckleball: {
    name: "Knuckleball",
    speed: 3,
    breakX: "random",
    breakY: "random",
    breakTiming: 0,
    chaos: true,
  },

  eephus: {
    name: "Eephus",
    speed: 2,
    breakX: 0,
    breakY: -1,
    breakTiming: 0,
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