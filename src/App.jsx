import { useState, useEffect } from "react"
import PitchSelector from "./components/PitchSelector"
import StrikeZone from "./components/StrikeZone"
import { getGamePitches } from "./data/pitches"

function App () {
  const [selected, setSelected] = useState('Q')
  const [pitches] = useState(() => getGamePitches())

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h1 className="text-4xl font-bold text-white mb-8">Strike Zone</h1>
      <StrikeZone pitches={pitches} selected = {selected} />
      <PitchSelector pitches={pitches} selected={selected} setSelected={setSelected} />
    </div>
  )
}

export default App