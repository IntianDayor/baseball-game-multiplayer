export const BAT_LIBRARY = {
  power_bat: {
    name: "Power",
    key: "Q",
    desc: "Less Accurate, More Power"
  },
  contact_bat: {
    name: "Contact",
    key: "W",
    desc: "Less Power, More Accurate"
  },
  bunt_bat: {
    name: "Bunt",
    key: "E",
    desc: "Cannot miss. No Power"
  }
}

export function getGameBats() {
    return {
        Q: {...BAT_LIBRARY.power_bat, key: "Q"},
        W: {...BAT_LIBRARY.contact_bat, key: "W"},
        E: {...BAT_LIBRARY.bunt_bat, key: "E"}
    }
}