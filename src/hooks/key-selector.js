import { useEffect } from "react";

export function useKeySelector(setSelected, disabled = false) {
    useEffect(() => {
        function handleKeyDown(e) {
            if (disabled) return;

            if (e.key === 'q' || e.key === 'Q') setSelected('Q')
            if (e.key === 'w' || e.key === 'W') setSelected('W')
            if (e.key === 'e' || e.key === 'E') setSelected('E')
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [setSelected, disabled])
}