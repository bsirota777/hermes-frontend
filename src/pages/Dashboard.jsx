// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { getMyAccount } from '../api/account';
import AddressForm from '../components/AddressForm';
import PasswordForm from '../components/PasswordForm';

const TABS = ['Profile', 'Address', 'Password'];

export default function Dashboard() {
    //console.log('Dashboard mounted');
    const [account, setAccount] = useState(null);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('Profile');

    useEffect(() => {
        getMyAccount().then(setAccount).catch((e) => setError(e.message));
    }, []);

    if (error) {
        return <div className="p-6 text-red-600">Couldn't load your account: {error}</div>;
    }

    if (!account) {
        return <div className="p-6 text-gray-500">Loading...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-6">My account</h1>

            <div className="flex border-b mb-6">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                            activeTab === tab
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === 'Profile' && (
                <div className="space-y-2 text-sm">
                    <Row label="Name" value={account.name} />
                    <Row label="Email" value={account.email} />
                    <Row label="Role" value={account.role} />
                </div>
            )}

            {activeTab === 'Address' && <AddressForm />}
            {activeTab === 'Password' && <PasswordForm />}
        </div>
    );
}

function Row({ label, value }) {
    return (
        <div className="flex justify-between border-b py-2">
            <span className="text-gray-500">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    );
}