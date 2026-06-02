import { useEffect } from "react";

export function useKeySelector(setSelected) {
    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === 'q' || e.key === 'Q') setSelected('Q')
            if (e.key === 'w' || e.key === 'W') setSelected('W')
            if (e.key === 'e' || e.key === 'E') setSelected('E')
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [setSelected])
}