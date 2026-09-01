import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { BrandLockup } from '../components/Brand';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(name, email, password);
            navigate('/login', { state: { justRegistered: true } });
        } catch (err) {
            if (err.response?.status === 409) {
                setError('An account with this email already exists.');
            } else if (err.response?.status === 400) {
                setError('Please check your details and try again.');
            } else {
                setError('Something went wrong. Please try again.');
            }
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
                    <h1 className="text-2xl mb-1">Join Hermes</h1>
                    <p className="text-sm mb-6" style={{ color: 'var(--ink-soft)' }}>
                        Create an account to send parcels or start driving.
                    </p>

                    {error && <div className="banner banner-error mb-4">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="field-label">Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input"
                            />
                        </div>

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
                                minLength={8}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input"
                            />
                        </div>

                        <button type="submit" disabled={loading} className="btn btn-primary w-full">
                            {loading ? 'Creating account...' : 'Register'}
                        </button>
                    </form>
                </div>

                <p className="mt-5 text-sm text-center" style={{ color: 'var(--ink-soft)' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--accent)' }} className="font-medium hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
