// src/components/PasswordForm.jsx
import { useState } from 'react';
import { changeMyPassword } from '../api/account';

export default function PasswordForm() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
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
                <label className="field-label">Current password</label>
                <div className="relative">
                    <input
                        type={showCurrent ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        className="input pr-16"
                    />
                    <button
                        type="button"
                        onClick={() => setShowCurrent((v) => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium"
                        style={{ color: 'var(--ink-soft)' }}
                    >
                        {showCurrent ? 'Hide' : 'Show'}
                    </button>
                </div>
            </div>
            <div>
                <label className="field-label">New password</label>
                <div className="relative">
                    <input
                        type={showNew ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={8}
                        className="input pr-16"
                    />
                    <button
                        type="button"
                        onClick={() => setShowNew((v) => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium"
                        style={{ color: 'var(--ink-soft)' }}
                    >
                        {showNew ? 'Hide' : 'Show'}
                    </button>
                </div>
            </div>
            <button type="submit" disabled={status === 'saving'} className="btn btn-primary">
                {status === 'saving' ? 'Saving...' : 'Change password'}
            </button>
            {status === 'saved' && <p className="text-sm mt-1" style={{ color: 'var(--evergreen)' }}>Password changed.</p>}
            {status === 'error' && <p className="text-sm mt-1" style={{ color: 'var(--danger)' }}>{error}</p>}
        </form>
    );
}
