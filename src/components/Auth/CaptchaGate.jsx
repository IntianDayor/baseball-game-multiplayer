import { useEffect, useRef } from "react";

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

// Renders the Cloudflare Turnstile widget and calls onVerified(token) once
// solved. The Turnstile script itself is loaded via a <script> tag in
// index.html (no npm package needed) — this component just waits for
// window.turnstile to exist, then renders into containerRef.
function CaptchaGate({ onVerified }) {
    const containerRef = useRef(null);
    const widgetIdRef = useRef(null);

    useEffect(() => {
        let cancelled = false;
        let pollInterval = null;

        function renderWidget() {
            if (cancelled || !containerRef.current) return;

            widgetIdRef.current = window.turnstile.render(containerRef.current, {
                sitekey: TURNSTILE_SITE_KEY,
                callback: (token) => onVerified(token),
            });
        }

        if (window.turnstile) {
            renderWidget();
        } else {
            // index.html's script tag is async/defer, so on a fast reload it
            // may not have finished loading yet. Poll briefly until it has.
            pollInterval = setInterval(() => {
                if (window.turnstile) {
                    clearInterval(pollInterval);
                    renderWidget();
                }
            }, 50);
        }

        return () => {
            cancelled = true;
            if (pollInterval) clearInterval(pollInterval);
            if (widgetIdRef.current && window.turnstile) {
                window.turnstile.remove(widgetIdRef.current);
            }
        };
    }, [onVerified]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 gap-6">
            <h1 className="text-white text-xl font-bold">Just a quick check...</h1>
            <div ref={containerRef} />
        </div>
    );
}

export default CaptchaGate;
