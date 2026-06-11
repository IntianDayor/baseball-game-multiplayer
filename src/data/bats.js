export const BAT_LIBRARY = {
  power_bat: {
    name: "Power",
    key: "Q",
    desc: "+ P, - A",
    radius: 10
  },
  contact_bat: {
    name: "Contact",
    key: "W",
    desc: "+ A, - P",
    radius: 20
  },
  bunt_bat: {
    name: "Bunt",
    key: "E",
    desc: "++ A, --P, Out",
    radius: 30
  }
}

export function getGameBats() {
    return {
        Q: {...BAT_LIBRARY.power_bat, key: "Q"},
        W: {...BAT_LIBRARY.contact_bat, key: "W"},
        E: {...BAT_LIBRARY.bunt_bat, key: "E"}
    }
}