import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, verifyOTP } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (!showOTP) {
                const data = await login(email, password);
                if (data.role === 'admin') navigate('/admin');
                else navigate('/dashboard');
            } else {
                const data = await verifyOTP(email, otp);
                if (data.role === 'admin') navigate('/admin');
                else navigate('/dashboard');
            }
        } catch (err) {
            if (err.needsVerification) {
                setShowOTP(true);
                setError('Account not verified. A new OTP has been sent to your email.');
            } else {
                setError(err.message || err);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-100 border border-indigo-50">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-black text-[#1e1b4b] mb-2 tracking-tighter">Welcome back.</h2>
                <p className="text-gray-400 font-medium uppercase tracking-widest text-[10px]">Portal Access Protocols</p>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-center shadow-inner border border-red-100">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                {!showOTP ? (
                    <>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full px-6 py-4 rounded-2xl border border-indigo-50 bg-[#fcfaff] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-6 py-4 rounded-2xl border border-indigo-50 bg-[#fcfaff] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </>
                ) : (
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Verification Code (OTP)</label>
                        <input
                            type="text"
                            required
                            placeholder="6-digit code"
                            className="w-full px-6 py-4 rounded-2xl border border-indigo-50 bg-[#fcfaff] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-100 transition shadow-sm font-black tracking-[0.5em] text-center text-xl text-indigo-600"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength="6"
                        />
                    </div>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl hover:bg-[#1e1b4b] transition shadow-lg shadow-indigo-100 active:scale-95"
                >
                    {loading ? 'Authenticating...' : (showOTP ? 'VERIFY' : 'ACCESS PORTAL')}
                </button>
            </form>

            <p className="text-center mt-10 text-gray-400 font-medium">
                New here? <Link to="/register" className="text-indigo-600 font-black hover:underline">Join Core</Link>
            </p>
        </div>
    );
};

export default Login;
