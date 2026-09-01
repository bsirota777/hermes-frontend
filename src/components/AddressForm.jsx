import { useState, useEffect } from 'react';
import { updateMyAddress, getMyAddress } from '../api/account';

export default function AddressForm() {
    const [fields, setFields] = useState({
        streetNumber: '', streetName: '', suburb: '', state: '', postcode: '',
    });
    const [phoneNumber, setPhoneNumber] = useState('');
    const [status, setStatus] = useState('loading');
    const [error, setError] = useState(null);

    useEffect(() => {
        getMyAddress()
            .then((result) => {
                if (result?.address) setFields(result.address);
                if (result?.phoneNumber) setPhoneNumber(result.phoneNumber);
                setStatus('idle');
            })
            .catch((err) => {
                setError(err.message);
                setStatus('error');
            });
    }, []);

    function update(key, value) {
        setFields((f) => ({ ...f, [key]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setStatus('saving');
        setError(null);
        try {
            await updateMyAddress(fields, phoneNumber);
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
                    <label className="field-label">Street no.</label>
                    <input
                        type="text"
                        value={fields.streetNumber}
                        onChange={(e) => update('streetNumber', e.target.value)}
                        required
                        className="input"
                    />
                </div>
                <div className="col-span-2">
                    <label className="field-label">Street name</label>
                    <input
                        type="text"
                        value={fields.streetName}
                        onChange={(e) => update('streetName', e.target.value)}
                        required
                        className="input"
                    />
                </div>
            </div>

            <div>
                <label className="field-label">Suburb</label>
                <input
                    type="text"
                    value={fields.suburb}
                    onChange={(e) => update('suburb', e.target.value)}
                    required
                    className="input"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="field-label">State</label>
                    <input
                        type="text"
                        value={fields.state}
                        onChange={(e) => update('state', e.target.value)}
                        required
                        className="input"
                    />
                </div>
                <div>
                    <label className="field-label">Postcode</label>
                    <input
                        type="text"
                        value={fields.postcode}
                        onChange={(e) => update('postcode', e.target.value)}
                        required
                        className="input"
                    />
                </div>
            </div>

            <div>
                <label className="field-label">Phone number</label>
                <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="input"
                />
            </div>

            <button type="submit" disabled={status === 'saving'} className="btn btn-primary">
                {status === 'saving' ? 'Saving...' : 'Save address'}
            </button>
            {status === 'saved' && <p className="text-sm mt-1" style={{ color: 'var(--evergreen)' }}>Address updated.</p>}
            {status === 'error' && <p className="text-sm mt-1" style={{ color: 'var(--danger)' }}>{error}</p>}
        </form>
    );
}
