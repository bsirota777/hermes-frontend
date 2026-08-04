// src/components/PasswordForm.jsx
import { useState } from 'react';
import { changeMyPassword } from '../api/account';

export default function PasswordForm() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setStatus('saving');
        setError(null);
        try {
            await changeMyPassword(currentPassword, newPassword);
            setStatus('saved');
            setCurrentPassword('');
            setNewPassword('');
        } catch (err) {
            setError(err.message);
            setStatus('error');
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current password</label>
                <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full border rounded px-3 py-2 text-sm"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full border rounded px-3 py-2 text-sm"
                />
            </div>
            <button
                type="submit"
                disabled={status === 'saving'}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
            >
                {status === 'saving' ? 'Saving...' : 'Change password'}
            </button>
            {status === 'saved' && <p className="text-green-600 text-sm">Password changed.</p>}
            {status === 'error' && <p className="text-red-600 text-sm">{error}</p>}
        </form>
    );
}