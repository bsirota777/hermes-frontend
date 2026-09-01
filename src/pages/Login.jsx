import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { BrandLockup } from '../components/Brand';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { role } = await login(email, password);
            navigate(role === 'ADMIN' ? '/admin' : '/dashboard');
        } catch (err) {
            setError(
                err.response?.status === 401
                    ? 'Invalid email or password'
                    : 'Something went wrong. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex-1 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-sm">
                <div className="mb-6 flex justify-center">
                    <BrandLockup to="/login" />
                </div>

                <div className="card p-8">
                    <h1 className="text-2xl mb-1">Welcome back</h1>
                    <p className="text-sm mb-6" style={{ color: 'var(--ink-soft)' }}>
                        Log in to send or drive a delivery.
                    </p>

                    {error && <div className="banner banner-error mb-4">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="field-label">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="field-label">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input"
                            />
                        </div>

                        <button type="submit" disabled={loading} className="btn btn-primary w-full">
                            {loading ? 'Logging in...' : 'Log in'}
                        </button>
                    </form>
                </div>

                <p className="mt-5 text-sm text-center" style={{ color: 'var(--ink-soft)' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: 'var(--accent)' }} className="font-medium hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
