import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getExistingSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session ? session.user.id : null;
}

export async function signInAnonymous(captchaToken) {
    const { data, error } = await supabase.auth.signInAnonymously({
        options: { captchaToken }
    });

    if (error) {
        console.error('signInAnonymous error', error);
        return null;
    }

    return data.user.id;
}
