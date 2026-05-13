import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register, verifyOTP } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (!showOTP) {
                await register(name, email, password);
                setShowOTP(true);
                setError('');
            } else {
                await verifyOTP(email, otp);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-100 border border-indigo-50"
        >
            <div className="text-center mb-10">
                <h2 className="text-4xl font-black text-[#1e1b4b] mb-2 tracking-tighter">Create New Account</h2>
                <p className="text-gray-400 font-medium uppercase tracking-widest text-[10px]">SIGNUP</p>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-8 text-center text-xs font-bold border border-red-100">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                {!showOTP ? (
                    <>
                        <div className="space-y-2">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest px-1">Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-6 py-4 rounded-2xl border border-indigo-50 bg-[#fcfaff] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest px-1">Email</label>
                            <input
                                type="email"
                                required
                                className="w-full px-6 py-4 rounded-2xl border border-indigo-50 bg-[#fcfaff] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest px-1">Password</label>
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
                    <div className="space-y-6">
                        <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 text-center">
                            <p className="text-xs font-bold text-indigo-600 leading-relaxed uppercase tracking-wider">
                                Transmission successful. Check your inbox for the auth code.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest px-1 text-center">Authentication Code</label>
                            <input
                                type="text"
                                required
                                placeholder="000000"
                                className="w-full px-6 py-4 rounded-2xl border border-indigo-50 bg-[#fcfaff] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-black tracking-[0.5em] text-center text-xl text-indigo-600"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength="6"
                            />
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl hover:bg-[#1e1b4b] transition shadow-lg shadow-indigo-100 active:scale-95 mt-4"
                >
                    {loading ? 'INITIALIZING...' : (showOTP ? 'VERIFY & ENTER' : 'SignUp')}
                </button>
            </form>

            {!showOTP && (
                <p className="text-center mt-10 text-gray-400 font-medium">
                    Already a member? <Link to="/login" className="text-indigo-600 font-black hover:underline">Sign In</Link>
                </p>
            )}
        </motion.div>
    );
};

export default Register;
