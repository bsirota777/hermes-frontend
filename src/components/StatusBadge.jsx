const STATUS_STYLES = {
    PENDING: 'badge-gold',
    UNASSIGNED: 'badge-gold',
    ASSIGNED: 'badge-accent',
    IN_TRANSIT: 'badge-accent',
    DELIVERED: 'badge-green',
    CANCELLED: 'badge-danger',
};

export default function StatusBadge({ status }) {
    if (!status) return null;
    const cls = STATUS_STYLES[status] || 'badge-neutral';
    const label = status.replaceAll('_', ' ').toLowerCase();
    return <span className={`badge ${cls}`}>{label}</span>;
}
