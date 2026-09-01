import { useEffect, useState, useCallback } from "react";
import { PageHeader } from "./Brand";
import StatusBadge from "./StatusBadge";

const API_BASE_URL = import.meta.env.VITE_DELIVERY_SERVICE_URL || "http://localhost:8084";
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
        <div className="flex-1 flex flex-col">
            <PageHeader backTo="/dashboard" />
            <div className="page-shell">
                <h1 className="text-3xl mb-1">Delivery queue</h1>
                <p className="mb-6" style={{ color: 'var(--ink-soft)' }}>
                    Unassigned deliveries near you, closest first. Reserve one to start driving it.
                </p>

                {error && <div className="banner banner-error mb-4">{error}</div>}

                {loading && <div style={{ color: 'var(--ink-soft)' }}>Loading queue...</div>}

                {!loading && data && data.content.length === 0 && (
                    <div
                        className="rounded-lg px-4 py-8 text-center"
                        style={{ border: '1.5px dashed var(--border-strong)', color: 'var(--ink-soft)' }}
                    >
                        No unassigned deliveries right now. Check back soon.
                    </div>
                )}

                {!loading && data && data.content.length > 0 && (
                    <div className="space-y-3">
                        {data.content.map((delivery) => (
                            <div key={delivery.id} className="card p-4 flex items-center justify-between">
                                <div>
                                    <div className="font-medium">Delivery #{delivery.id}</div>
                                    <div className="text-sm" style={{ color: 'var(--ink-soft)' }}>
                                        From {delivery.senderName} to {delivery.recipientName}
                                    </div>
                                    <div className="text-xs mt-1.5 flex items-center gap-2" style={{ color: 'var(--ink-faint)' }}>
                                        <span>Created {formatDate(delivery.createdAt)}</span>
                                        <StatusBadge status={delivery.status} />
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleReserve(delivery.id)}
                                    disabled={reservingId === delivery.id}
                                    className="btn btn-primary shrink-0"
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
                            className="text-sm font-medium"
                            style={{ color: data.first ? 'var(--ink-faint)' : 'var(--accent)' }}
                        >
                            &larr; Previous
                        </button>
                        <span className="text-sm" style={{ color: 'var(--ink-soft)' }}>
                            Page {data.number + 1} of {data.totalPages}
                        </span>
                        <button
                            onClick={() => setPage((p) => p + 1)}
                            disabled={data.last}
                            className="text-sm font-medium"
                            style={{ color: data.last ? 'var(--ink-faint)' : 'var(--accent)' }}
                        >
                            Next &rarr;
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
