import { useState, useEffect } from 'react';
import { userApiClient, deliveryApiClient } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { PageHeader } from '../components/Brand';
import StatusBadge from '../components/StatusBadge';

export default function AdminDashboard() {
    const [tab, setTab] = useState('users');

    return (
        <div className="flex-1 flex flex-col">
            <PageHeader />
            <div className="page-shell-wide">
                <h1 className="text-3xl mb-6">Admin dashboard</h1>

                <div className="flex gap-2 mb-6">
                    <TabButton active={tab === 'users'} onClick={() => setTab('users')}>Users</TabButton>
                    <TabButton active={tab === 'deliveries'} onClick={() => setTab('deliveries')}>Deliveries</TabButton>
                </div>

                {tab === 'users' ? <UsersTab /> : <DeliveriesTab />}
            </div>
        </div>
    );
}

function TabButton({ active, onClick, children }) {
    return (
        <button onClick={onClick} className={`btn ${active ? 'btn-primary' : 'btn-secondary'}`}>
            {children}
        </button>
    );
}

function usePagedData(client, endpoint) {
    const [data, setData] = useState(null);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        setLoading(true);
        client
            .get(endpoint, { params: { page, size: 10 } })
            .then((res) => setData(res.data))
            .finally(() => setLoading(false));
    }, [client, endpoint, page, refreshKey]);

    const refetch = () => setRefreshKey((k) => k + 1);

    return { data, page, setPage, loading, refetch };
}

function UsersTab() {
    const { data, page, setPage, loading, refetch } = usePagedData(userApiClient, '/admin/users');
    const { email: currentUserEmail } = useAuth();

    async function toggleBanned(user) {
        await userApiClient.patch(`/admin/users/${user.id}/ban`, { banned: !user.banned });
        refetch();
    }

    if (loading) return <p style={{ color: 'var(--ink-soft)' }}>Loading...</p>;
    if (data.content.length === 0) {
        return <div className="card p-8 text-center" style={{ color: 'var(--ink-soft)' }}>No users yet.</div>;
    }

    return (
        <div className="card overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead style={{ background: 'var(--surface-sunken)', color: 'var(--ink-soft)' }}>
                <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Sends</th>
                    <th className="px-4 py-3 font-medium">Receives</th>
                    <th className="px-4 py-3 font-medium">Banned</th>
                </tr>
                </thead>
                <tbody>
                {data.content.map((u) => (
                    <tr key={u.id} style={{ borderTop: '1px solid var(--border)' }}>
                        <td className="px-4 py-3">{u.name}</td>
                        <td className="px-4 py-3">{u.email}</td>
                        <td className="px-4 py-3">{u.role}</td>
                        <td className="px-4 py-3">{u.sentCount}</td>
                        <td className="px-4 py-3">{u.receivedCount}</td>
                        <td className="px-4 py-3">
                            {u.email === currentUserEmail ? (
                                <span className="text-xs italic" style={{ color: 'var(--ink-faint)' }}>You</span>
                            ) : (
                                <input
                                    type="checkbox"
                                    checked={u.banned}
                                    onChange={() => toggleBanned(u)}
                                    className="w-4 h-4"
                                    style={{ accentColor: 'var(--danger)' }}
                                />
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <Pager page={page} setPage={setPage} totalPages={data.totalPages} />
        </div>
    );
}

function DeliveriesTab() {
    const { data, page, setPage, loading } = usePagedData(deliveryApiClient, '/admin/deliveries');

    if (loading) return <p style={{ color: 'var(--ink-soft)' }}>Loading...</p>;

    if (data.content.length === 0) {
        return <div className="card p-8 text-center" style={{ color: 'var(--ink-soft)' }}>No deliveries yet.</div>;
    }

    return (
        <div className="card overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead style={{ background: 'var(--surface-sunken)', color: 'var(--ink-soft)' }}>
                <tr>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Sender</th>
                    <th className="px-4 py-3 font-medium">Recipient</th>
                    <th className="px-4 py-3 font-medium">Driver</th>
                    <th className="px-4 py-3 font-medium">Fee</th>
                    <th className="px-4 py-3 font-medium">Parcels</th>
                </tr>
                </thead>
                <tbody>
                {data.content.map((d) => (
                    <tr key={d.id} style={{ borderTop: '1px solid var(--border)' }}>
                        <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                        <td className="px-4 py-3">{d.senderName}</td>
                        <td className="px-4 py-3">{d.recipientName}</td>
                        <td className="px-4 py-3">
                            {d.driverName ?? <span style={{ color: 'var(--ink-faint)' }}>Unassigned</span>}
                            {d.driverName && d.driverVerified && (
                                <span className="ml-1 text-xs" style={{ color: 'var(--evergreen)' }}>✓ Verified</span>
                            )}
                        </td>
                        <td className="px-4 py-3">${d.deliveryFee}</td>
                        <td className="px-4 py-3">{d.parcelCount}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <Pager page={page} setPage={setPage} totalPages={data.totalPages} />
        </div>
    );
}

function Pager({ page, setPage, totalPages }) {
    return (
        <div
            className="flex justify-between items-center px-4 py-3"
            style={{ background: 'var(--surface-sunken)', borderTop: '1px solid var(--border)' }}
        >
            <button
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="text-sm font-medium"
                style={{ color: page === 0 ? 'var(--ink-faint)' : 'var(--accent)' }}
            >
                ← Previous
            </button>
            <span className="text-sm" style={{ color: 'var(--ink-soft)' }}>
                Page {page + 1} of {totalPages}
            </span>
            <button
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="text-sm font-medium"
                style={{ color: page + 1 >= totalPages ? 'var(--ink-faint)' : 'var(--accent)' }}
            >
                Next →
            </button>
        </div>
    );
}
