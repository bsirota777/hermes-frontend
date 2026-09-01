import { Link } from 'react-router-dom';

// Simple winged-parcel mark: a box with two curved wing strokes either side.
export function BrandMark({ size = 26 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <rect x="10" y="11" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M10 15L16 11L22 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path
                d="M9 13C5 12 2.5 9.5 2 6C5.5 6 8.5 8 9.5 12"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M23 13C27 12 29.5 9.5 30 6C26.5 6 23.5 8 22.5 12"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function BrandLockup({ to = '/dashboard' }) {
    return (
        <Link to={to} className="inline-flex items-center gap-2" style={{ color: 'var(--accent)' }}>
            <BrandMark />
            <span
                style={{ fontFamily: 'var(--font-display)', color: 'var(--ink)' }}
                className="text-xl"
            >
                Hermes
            </span>
        </Link>
    );
}

// Thin top bar used on every authenticated page, with an optional back link.
export function PageHeader({ backTo, backLabel = 'Dashboard' }) {
    return (
        <header
            className="flex items-center justify-between px-5 py-3"
            style={{ borderBottom: '1.5px solid var(--border)', background: 'var(--surface)' }}
        >
            <BrandLockup />
            {backTo && (
                <Link
                    to={backTo}
                    className="text-sm font-medium"
                    style={{ color: 'var(--ink-soft)' }}
                >
                    &larr; {backLabel}
                </Link>
            )}
        </header>
    );
}
