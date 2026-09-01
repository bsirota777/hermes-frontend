// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { getMyAccount } from '../api/account';
import AddressForm from '../components/AddressForm';
import PasswordForm from '../components/PasswordForm';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/Brand';

const TABS = ['Profile', 'Address', 'Password'];

export default function Dashboard() {
    const [account, setAccount] = useState(null);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('Profile');

    useEffect(() => {
        getMyAccount().then(setAccount).catch((e) => setError(e.message));
    }, []);

    return (
        <div className="flex-1 flex flex-col">
            <PageHeader />
            <div className="page-shell">
                {error && <div className="banner banner-error">Couldn't load your account: {error}</div>}

                {!error && !account && (
                    <p style={{ color: 'var(--ink-soft)' }}>Loading...</p>
                )}

                {account && (
                    <>
                        <h1 className="text-3xl mb-6">My account</h1>

                        <div className="flex gap-1 mb-6" style={{ borderBottom: '1.5px solid var(--border)' }}>
                            {TABS.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className="px-4 py-2 text-sm font-medium -mb-px"
                                    style={{
                                        borderBottom: `2px solid ${activeTab === tab ? 'var(--accent)' : 'transparent'}`,
                                        color: activeTab === tab ? 'var(--accent)' : 'var(--ink-soft)',
                                    }}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {activeTab === 'Profile' && (
                            <div className="card p-5 space-y-1">
                                <Row label="Name" value={account.name} />
                                <Row label="Email" value={account.email} />
                                <Row label="Role" value={account.role} last />
                            </div>
                        )}

                        {activeTab === 'Address' && (
                            <div className="card p-5">
                                <AddressForm />
                            </div>
                        )}
                        {activeTab === 'Password' && (
                            <div className="card p-5">
                                <PasswordForm />
                            </div>
                        )}

                        <div className="mt-8 pt-6 flex flex-wrap gap-3" style={{ borderTop: '1.5px solid var(--border)' }}>
                            <Link to="/deliveries/new" className="btn btn-primary">
                                Create a delivery
                            </Link>

                            {account.isDriver ? (
                                <Link to="/driver-profile/edit" className="btn btn-secondary">
                                    Change driver details
                                </Link>
                            ) : (
                                <Link to="/driver-registration" className="btn btn-secondary">
                                    Register as a driver
                                </Link>
                            )}

                            {account.isDriver && (
                                <Link to="/deliveries/queue" className="btn btn-primary">
                                    Delivery queue
                                </Link>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function Row({ label, value, last }) {
    return (
        <div
            className="flex justify-between py-2.5 text-sm"
            style={last ? {} : { borderBottom: '1px solid var(--border)' }}
        >
            <span style={{ color: 'var(--ink-soft)' }}>{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    );
}
