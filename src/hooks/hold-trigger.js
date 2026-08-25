import { useEffect, useState, useRef } from "react";
import { clamp } from "../lib/math";

export function useHoldTrigger (callback, durationMs) {
    
    const [isHolding, setIsHolding] = useState(false);
    const [progress, setProgress] = useState(0);

    const holdTimeOutRef = useRef(null);
    const isHoldingRef = useRef(false);
    const rafRef = useRef(null);
    const startTimeRef = useRef(null);

    function animateProgress() {
        const elapsed = Date.now() - startTimeRef.current;
        const t = clamp(elapsed / durationMs, 0, 1)
        setProgress(t);

        if (isHoldingRef.current && t < 1) {
            rafRef.current = requestAnimationFrame(animateProgress);
        }
    }

    function startHold() {
        
        if(isHoldingRef.current) return;

        isHoldingRef.current = true;
        setIsHolding(true);
        startTimeRef.current = Date.now();

        holdTimeOutRef.current = setTimeout(() => {
            callback()
            resetHoldState()
        }, durationMs);

        animateProgress();
    }

    function cancelHold() {
        if (!isHoldingRef.current) return;

        clearTimeout(holdTimeOutRef.current);

        cancelAnimationFrame(rafRef.current);

        resetHoldState();
    }

    function resetHoldState() {
        isHoldingRef.current = false;
        setIsHolding(false);
        setProgress(0);
        holdTimeOutRef.current = null;
    }

    useEffect(() => {
        return () => cancelHold();
    }, []);



    return { startHold, cancelHold, isHolding, progress }

} 