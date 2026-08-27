// src/api/account.js
const API_BASE = import.meta.env.VITE_USER_SERVICE_URL ?? 'http://localhost:8081';

function authHeaders() {
    const token = localStorage.getItem('hermes_token');
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };
}

export async function getMyAccount() {
    const res = await fetch(`${API_BASE}/users/me`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to load account');
    return res.json();
}

export async function updateMyAddress(address, phoneNumber) {
    const res = await fetch(`${API_BASE}/users/me/address`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ address, phoneNumber }),
    });
    if (!res.ok) throw await parseError(res);
}

export async function changeMyPassword(currentPassword, newPassword) {
    const res = await fetch(`${API_BASE}/users/me/password`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (res.status === 401) {
        throw new Error('Current password is incorrect.');
    }
    if (!res.ok) throw await parseError(res);
}

async function parseError(res) {
    const text = await res.text();
    return new Error(text || `Request failed (${res.status})`);
}