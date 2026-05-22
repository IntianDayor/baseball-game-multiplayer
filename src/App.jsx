import { supabase } from "./lib/supabase"
import { useState, useEffect } from "react"
import PitchSelector from "./components/PitchSelector"
import { getGamePitches } from "./data/pitches"
import PitchingField from "./components/PitchingField"

function App () {
  const [selected, setSelected] = useState('Q');
  const [pitches] = useState(() => getGamePitches());

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <PitchSelector pitches={pitches} selected={selected} setSelected={setSelected} />
      <PitchingField pitches={pitches} selected={selected} />
    </div>
  );
}

export default App