import { useState, useEffect } from 'react';
import apiClient from '../api/client';

export default function AdminDashboard() {
    const [tab, setTab] = useState('users');

    return (
        <div className="min-h-screen bg-slate-100 p-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Admin Dashboard</h1>

            <div className="flex gap-2 mb-6">
                <TabButton active={tab === 'users'} onClick={() => setTab('users')}>Users</TabButton>
                <TabButton active={tab === 'deliveries'} onClick={() => setTab('deliveries')}>Deliveries</TabButton>
            </div>

            {tab === 'users' ? <UsersTab /> : <DeliveriesTab />}
        </div>
    );
}

function TabButton({ active, onClick, children }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-md font-medium ${
                active ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-300'
            }`}
        >
            {children}
        </button>
    );
}

function usePagedData(endpoint) {
    const [data, setData] = useState(null);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        apiClient
            .get(endpoint, { params: { page, size: 10 } })
            .then((res) => setData(res.data))
            .finally(() => setLoading(false));
    }, [endpoint, page]);

    return { data, page, setPage, loading };
}

function UsersTab() {
    const { data, page, setPage, loading } = usePagedData('/admin/users');

    if (loading) return <p className="text-slate-500">Loading...</p>;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase text-xs">
                <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                </tr>
                </thead>
                <tbody>
                {data.content.map((u) => (
                    <tr key={u.id} className="border-t border-slate-100">
                        <td className="px-4 py-3">{u.name}</td>
                        <td className="px-4 py-3">{u.email}</td>
                        <td className="px-4 py-3">{u.role}</td>
                        <td className="px-4 py-3">
                            {u.banned ? (
                                <span className="text-red-600 font-medium">Banned</span>
                            ) : (
                                <span className="text-green-600 font-medium">Active</span>
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
    const { data, page, setPage, loading } = usePagedData('/admin/deliveries');

    if (loading) return <p className="text-slate-500">Loading...</p>;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase text-xs">
                <tr>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Sender</th>
                    <th className="px-4 py-3">Recipient</th>
                    <th className="px-4 py-3">Driver</th>
                    <th className="px-4 py-3">Fee</th>
                    <th className="px-4 py-3">Parcels</th>
                </tr>
                </thead>
                <tbody>
                {data.content.map((d) => (
                    <tr key={d.id} className="border-t border-slate-100">
                        <td className="px-4 py-3">{d.status}</td>
                        <td className="px-4 py-3">{d.senderName}</td>
                        <td className="px-4 py-3">{d.recipientName}</td>
                        <td className="px-4 py-3">
                            {d.driverName ?? <span className="text-slate-400">Unassigned</span>}
                            {d.driverName && d.driverVerified && (
                                <span className="ml-1 text-green-600 text-xs">✓ Verified</span>
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
        <div className="flex justify-between items-center px-4 py-3 bg-slate-50 border-t border-slate-100">
            <button
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="text-sm text-blue-600 disabled:text-slate-300"
            >
                ← Previous
            </button>
            <span className="text-sm text-slate-500">
        Page {page + 1} of {totalPages}
      </span>
            <button
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="text-sm text-blue-600 disabled:text-slate-300"
            >
                Next →
            </button>
        </div>
    );
}