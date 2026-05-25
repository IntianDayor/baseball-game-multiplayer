import MainMenu from "./components/MainMenu"
import Lobby from "./components/Lobby"
import { useState, useEffect } from "react"
import PitchSelector from "./components/PitchSelector"
import { getGamePitches } from "./data/pitches"
import PitchingField from "./components/PitchingField"

function App () {
  /* Variables */
  const [screen, setScreen] = useState('menu');
  const [selected, setSelected] = useState('Q');
  const [pitches] = useState(() => getGamePitches());

  /* Screen Handler */
  if (screen === 'menu') return <MainMenu setScreen={setScreen} />
  if (screen === 'lobby') return <Lobby setScreen={setScreen} />
  if (screen === 'game') return <Game setScreen={setScreen} selected={selected} pitches={pitches} />

  return null
}

export default App