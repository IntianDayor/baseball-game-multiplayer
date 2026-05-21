import { useState, useEffect } from "react"
import PitchSelector from "./components/PitchSelector"
import { getGamePitches } from "./data/pitches"
import PitchingField from "./components/PitchingField"

function App () {
  const [selected, setSelected] = useState('Q')
  const [pitches] = useState(() => getGamePitches())

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h1 className="text-4xl font-bold text-white mb-8">Strike Zone</h1>
      <PitchSelector pitches={pitches} selected={selected} setSelected={setSelected} />
      <PitchingField pitches={pitches} selected={selected} />
    </div>
  )
}

export default App