import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const SignupPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register, guestLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await register(username, email, password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
    };

    const handleGuestLogin = async () => {
        const result = await guestLogin();
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
    }

    return (
        <div className="flex h-screen w-full bg-gray-50">
            {/* Left Side - Visual / Branding (Order swapped on mobile via flex-col? No, just hidden on mobile usually or stacked. Let's keep consistent split) */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-teal-400 to-emerald-600 justify-center items-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="z-10 text-center px-10">
                    <h1 className="text-5xl font-bold mb-6">Hello, Friend!</h1>
                    <p className="text-xl font-light">
                        Enter your personal details and start your journey with us.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full md:w-1/2 flex justify-center items-center bg-white p-8">
                <div className="max-w-md w-full">
                    <h2 className="text-3xl font-bold text-center text-teal-600 mb-8">Create Account</h2>

                    {/* Social Icons Placeholder */}
                    <div className="flex justify-center gap-4 mb-6">
                        <div className="w-10 h-10 border rounded-full flex items-center justify-center cursor-not-allowed text-gray-400 hover:border-teal-500 hover:text-teal-500 transition">G</div>
                        <div className="w-10 h-10 border rounded-full flex items-center justify-center cursor-not-allowed text-gray-400 hover:border-teal-500 hover:text-teal-500 transition">f</div>
                        <div className="w-10 h-10 border rounded-full flex items-center justify-center cursor-not-allowed text-gray-400 hover:border-teal-500 hover:text-teal-500 transition">in</div>
                    </div>

                    <p className="text-center text-gray-400 text-sm mb-6">or use your email for registration</p>

                    {error && <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="bg-gray-100 p-2 rounded">
                            <input
                                type="text"
                                placeholder="Name"
                                className="w-full bg-transparent outline-none px-2 text-gray-700"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="bg-gray-100 p-2 rounded">
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full bg-transparent outline-none px-2 text-gray-700"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="bg-gray-100 p-2 rounded">
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full bg-transparent outline-none px-2 text-gray-700"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 rounded-full bg-teal-500 text-white font-bold tracking-wide uppercase hover:bg-teal-600 transition shadow-lg mt-6"
                        >
                            Sign Up
                        </button>
                    </form>
                    <div className="mt-8 text-center">
                        <p className="text-gray-500 mb-4">Already have an account? <Link to="/login" className="text-teal-500 font-bold hover:underline">Sign In</Link></p>
                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="flex-shrink mx-4 text-gray-400 text-sm">Testing the app?</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>
                        <button
                            onClick={handleGuestLogin}
                            className="mt-4 px-6 py-2 border-2 border-teal-500 text-teal-600 font-bold rounded-full hover:bg-teal-50 transition"
                        >
                            Continue as Guest
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
