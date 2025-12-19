import React, { useState } from 'react';
import { Eye, EyeOff, Activity, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Assuming the backend returns a token, store it
                if (data.access_token) {
                    localStorage.setItem('auth_token', data.access_token);
                    localStorage.setItem('user_role', data.role);
                    localStorage.setItem('user', JSON.stringify(data.user));
                }
                // Redirect to dashboard
                navigate('/dashboard');
            } else {
                setError(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            setError('An error occurred. Please try again later.');
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Column: Login Form */}
            <div className="w-full lg:w-[480px] flex flex-col justify-center px-8 md:px-12 lg:px-16 py-12">
                <div className="mb-10 flex flex-col items-center">
                    {/* Logo */}
                    <img src="/login/Gemini_Generated_Image_8jllqr8jllqr8jll-removebg-preview.png" alt="TaskFlow Logo" className="h-20 w-auto mb-6 object-contain" />
                    <h1 className="text-2xl font-bold text-neutral-900">Log in</h1>
                </div>



                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2 font-sans">Email Address</label>
                        <input
                            type="email"
                            placeholder="example@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all placeholder:text-neutral-400 text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all text-sm"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Remember Me & Reset Password */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="remember"
                                className="w-4 h-4 rounded border-neutral-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                            />
                            <label htmlFor="remember" className="text-xs font-medium text-neutral-500 cursor-pointer">
                                Remember me
                            </label>
                        </div>
                        <Link to="/forgot-password" size="sm" className="text-xs font-medium text-brand-primary hover:underline">
                            Reset Password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-primary/90 shadow-md shadow-brand-primary/20 transition-all active:scale-[0.98] mt-4 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 size={24} className="animate-spin" /> : 'Log in'}
                    </button>
                </form>


            </div>

            {/* Right Column: Illustration */}
            <div className="hidden lg:flex flex-1 bg-surface-background items-center justify-center p-12">
                <div className="max-w-[600px] w-full transform hover:scale-105 transition-transform duration-700">
                    <img
                        src="/login/Illustration.png"
                        alt="Work illustration"
                        className="w-full h-auto"
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
