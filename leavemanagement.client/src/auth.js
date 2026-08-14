// Very small localStorage-backed "session" for the demo app.
// Stores the JWT plus a bit of profile info returned by the
// login endpoints so pages can greet the user and guard routes.

const STORAGE_KEY = 'lms_session';

export function saveSession(session) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function getSession() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function clearSession() {
    localStorage.removeItem(STORAGE_KEY);
}

export function isLoggedInAs(role) {
    const session = getSession();
    return !!session?.token && session.role === role;
}
