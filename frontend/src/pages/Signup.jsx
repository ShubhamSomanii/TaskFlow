import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

export default function Signup() {
    const { signup } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setSubmitting(false);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            setSubmitting(false);
            return;
        }

        const res = await signup(email, password);
        if (!res.success) {
            setError(res.error);
        }
        setSubmitting(false);
    };

    return (
        <div className="min-h-screen flex bg-white font-sans">
            {/* Left Side - Image/Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 opacity-90"></div>
                <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                    alt="Team collaboration"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
                />
                <div className="relative z-10 flex flex-col justify-center px-12 text-white h-full">
                    <div className="flex items-center mb-6">
                        <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span className="ml-3 text-3xl font-bold tracking-wider">TaskFlow</span>
                    </div>
                    <h1 className="text-4xl font-bold mb-6">Join the community.</h1>
                    <p className="text-lg text-indigo-100 mb-8 max-w-md">
                        Create an account today and start organizing your projects with speed and efficiency.
                    </p>
                    <div className="flex space-x-2">
                        <div className="w-3 h-1 bg-indigo-400 rounded-full"></div>
                        <div className="w-12 h-1 bg-white rounded-full"></div>
                        <div className="w-3 h-1 bg-indigo-400 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-1/2 bg-slate-50">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div>
                        <h2 className="mt-6 text-3xl font-extrabold text-slate-900">
                            Create an account
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8">
                        <div className="mt-6">
                            <form action="#" method="POST" onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                        Email address
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={clsx(
                                                "appearance-none block w-full px-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all",
                                                error ? "border-red-300 text-red-900 placeholder-red-300" : "border-slate-300"
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                        Password
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="new-password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className={clsx(
                                                "appearance-none block w-full px-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all",
                                                error ? "border-red-300 text-red-900 placeholder-red-300" : "border-slate-300"
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700">
                                        Confirm Password
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="confirm-password"
                                            name="confirm-password"
                                            type="password"
                                            autoComplete="new-password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className={clsx(
                                                "appearance-none block w-full px-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all",
                                                error ? "border-red-300 text-red-900 placeholder-red-300" : "border-slate-300"
                                            )}
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="rounded-md bg-red-50 p-4 border border-red-100">
                                        <div className="flex">
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-red-800">
                                                    {error}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? 'Creating account...' : 'Sign up'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
