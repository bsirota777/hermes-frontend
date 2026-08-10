import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const PAGE_SIZE = 20;

function formatDate(iso) {
    if (!iso) return "";
    return new Date(iso).toLocaleString();
}

export default function DeliveryQueue() {
    const [page, setPage] = useState(0);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reservingId, setReservingId] = useState(null);

    const authHeaders = () => ({
        Authorization: `Bearer ${localStorage.getItem("hermes_token")}`,
    });

    const loadQueue = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(
                `${API_BASE_URL}/deliveries/queue?page=${page}&size=${PAGE_SIZE}`,
                { headers: authHeaders() }
            );
            if (!res.ok) {
                const message = await res.text();
                throw new Error(message || `Request failed with status ${res.status}`);
            }
            setData(await res.json());
        } catch (err) {
            setError(err.message || "Couldn't load the delivery queue.");
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        loadQueue();
    }, [loadQueue]);

    const handleReserve = async (deliveryId) => {
        setReservingId(deliveryId);
        setError(null);
        try {
            const res = await fetch(`${API_BASE_URL}/deliveries/${deliveryId}/assign`, {
                method: "POST",
                headers: authHeaders(),
            });
            if (!res.ok) {
                const message = await res.text();
                throw new Error(message || `Request failed with status ${res.status}`);
            }
            await loadQueue();
        } catch (err) {
            setError(err.message || "Couldn't reserve that delivery.");
        } finally {
            setReservingId(null);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <Link
                to="/dashboard"
                className="inline-block text-sm font-medium text-slate-500 hover:text-slate-800 mb-4"
            >
                &larr; Back to dashboard
            </Link>

            <h1 className="text-2xl font-bold text-slate-900 mb-1">Delivery queue</h1>
            <p className="text-slate-500 mb-6">
                Unassigned deliveries near you, closest first. Reserve one to start driving it.
            </p>

            {error && (
                <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-4">
                    {error}
                </div>
            )}

            {loading && <div className="text-slate-500">Loading queue...</div>}

            {!loading && data && data.content.length === 0 && (
                <div className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-slate-500">
                    No unassigned deliveries right now. Check back soon.
                </div>
            )}

            {!loading && data && data.content.length > 0 && (
                <div className="space-y-3">
                    {data.content.map((delivery) => (
                        <div
                            key={delivery.id}
                            className="rounded-lg border border-slate-200 p-4 flex items-center justify-between"
                        >
                            <div>
                                <div className="font-medium text-slate-900">
                                    Delivery #{delivery.id}
                                </div>
                                <div className="text-sm text-slate-500">
                                    From {delivery.senderName} to {delivery.recipientName}
                                </div>
                                <div className="text-xs text-slate-400 mt-1">
                                    Created {formatDate(delivery.createdAt)} &middot; {delivery.status}
                                </div>
                            </div>
                            <button
                                onClick={() => handleReserve(delivery.id)}
                                disabled={reservingId === delivery.id}
                                className="text-sm font-medium bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 disabled:opacity-50 shrink-0"
                            >
                                {reservingId === delivery.id ? "Reserving..." : "Reserve"}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {data && data.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <button
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        disabled={data.first}
                        className="text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-40"
                    >
                        &larr; Previous
                    </button>
                    <span className="text-sm text-slate-500">
            Page {data.number + 1} of {data.totalPages}
          </span>
                    <button
                        onClick={() => setPage((p) => p + 1)}
                        disabled={data.last}
                        className="text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-40"
                    >
                        Next &rarr;
                    </button>
                </div>
            )}
        </div>
    );
}