import { useKeySelector } from "../hooks/key-selector";

function BattingSelector ({ bats, selected, setSelected }) {

    useKeySelector(setSelected);

    return (
        <div className="flex gap-4 mt-8">
                {Object.entries(bats).map(([key, bat]) => (
                    <div key={key}
                    className={`p-4 rounded border-2 cursor-pointer text-white text-center w-32 ${
                        selected === key
                            ? 'border-yellow-400 bg-gray-700'
                            : 'border-gray-600 bg-gray-800'
                    }`}
                    onClick={() => setSelected(key)}
                    >
                        <div className="text-yellow-400 font-bold">{key}</div>
                        <div className="text-sm">{bat.name}</div>
                        <div className="text-xs text-gray-400">FEAT: {bat.desc}</div>
                    </div>
                ))}
        </div>
    );
}

export default BattingSelector;