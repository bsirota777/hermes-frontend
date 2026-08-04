// src/components/AddressForm.jsx
import { useState } from 'react';
import { updateMyAddress } from '../api/account';

export default function AddressForm() {
    const [address, setAddress] = useState('');
    const [status, setStatus] = useState('idle'); // idle | saving | saved | error
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setStatus('saving');
        setError(null);
        try {
            await updateMyAddress(address);
            setStatus('saved');
        } catch (err) {
            setError(err.message);
            setStatus('error');
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New address</label>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full border rounded px-3 py-2 text-sm"
                />
            </div>
            <button
                type="submit"
                disabled={status === 'saving'}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
            >
                {status === 'saving' ? 'Saving...' : 'Save address'}
            </button>
            {status === 'saved' && <p className="text-green-600 text-sm">Address updated.</p>}
            {status === 'error' && <p className="text-red-600 text-sm">{error}</p>}
        </form>
    );
}