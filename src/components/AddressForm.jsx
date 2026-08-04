import { useState } from 'react';
import { updateMyAddress } from '../api/account';

export default function AddressForm() {
    const [fields, setFields] = useState({
        streetNumber: '',
        streetName: '',
        suburb: '',
        state: '',
        postcode: '',
    });
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState(null);

    function update(key, value) {
        setFields((f) => ({ ...f, [key]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setStatus('saving');
        setError(null);
        try {
            await updateMyAddress(fields);
            setStatus('saved');
        } catch (err) {
            setError(err.message);
            setStatus('error');
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street no.</label>
                    <input
                        type="text"
                        value={fields.streetNumber}
                        onChange={(e) => update('streetNumber', e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2 text-sm"
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street name</label>
                    <input
                        type="text"
                        value={fields.streetName}
                        onChange={(e) => update('streetName', e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2 text-sm"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Suburb</label>
                <input
                    type="text"
                    value={fields.suburb}
                    onChange={(e) => update('suburb', e.target.value)}
                    required
                    className="w-full border rounded px-3 py-2 text-sm"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                        type="text"
                        value={fields.state}
                        onChange={(e) => update('state', e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2 text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
                    <input
                        type="text"
                        value={fields.postcode}
                        onChange={(e) => update('postcode', e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2 text-sm"
                    />
                </div>
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