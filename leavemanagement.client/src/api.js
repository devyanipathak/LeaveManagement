// Small fetch wrapper shared by every component.
// Attaches the JWT (if present) and normalizes error handling so
// components can just `try { await apiFetch(...) } catch (err) { ... }`.

import { getSession } from './auth';

const API_BASE = '/api';

export async function apiFetch(path, options = {}) {
    const session = getSession();

    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };

    if (session?.token) {
        headers['Authorization'] = `Bearer ${session.token}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers
    });

    let body = null;
    const text = await response.text();
    if (text) {
        try {
            body = JSON.parse(text);
        } catch {
            body = text;
        }
    }

    if (!response.ok) {
        const message =
            (body && (body.message || body.Message)) ||
            (typeof body === 'string' ? body : null) ||
            `Request failed with status ${response.status}`;
        throw new Error(message);
    }

    return body;
}

export default apiFetch;
