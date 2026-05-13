import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaBars, FaTimes, FaCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled
                ? 'py-4 glass border-b border-indigo-100 shadow-lg shadow-indigo-100/20 m-0'
                : 'py-6 bg-transparent'
                }`}
        >
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center">
                    {/* Brand Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <Logo size="text-2xl" iconSize="w-12 h-12" />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-10">
                        <Link
                            to="/events"
                            className={`text-md font-bold transition-all duration-300 hover:text-indigo-600 ${location.pathname === '/events' ? 'text-indigo-600' : 'text-gray-500'
                                }`}
                        >
                            Events
                        </Link>
                        {user ? (
                            <>
                                <Link
                                    to={user.role === 'admin' ? '/admin' : '/dashboard'}
                                    className={`text-md font-bold transition-all duration-300 hover:text-indigo-600 ${location.pathname.includes('dashboard') || location.pathname.includes('admin') ? 'text-indigo-600' : 'text-gray-500'
                                        }`}
                                >
                                    Dashboard
                                </Link>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                                        <FaCircle className="text-green-500 text-[8px] animate-pulse" />
                                        <span className="text-[13px] font-black uppercase tracking-widest text-indigo-600">
                                            {user.role}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-[#1e1b4b] text-white px-4 py-2.5 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-8">
                                <Link
                                    to="/login"
                                    className="text-md font-bold text-gray-500 hover:text-black transition-all"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-indigo-600 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all hover:bg-[#1e1b4b] hover:shadow-2xl hover:shadow-indigo-200"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-2xl text-[#1e1b4b]"
                    >
                        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="absolute top-full left-0 right-0 bg-white border-t border-indigo-50 shadow-2xl overflow-hidden"
                    >
                        <div className="flex flex-col p-8 gap-6">
                            <Link to="/events" className="text-lg font-bold text-[#1e1b4b]">Browse Experience</Link>
                            {user ? (
                                <>
                                    <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="text-lg font-bold text-[#1e1b4b]">Your Portal</Link>
                                    <button onClick={handleLogout} className="text-left text-lg font-bold text-red-500">Log Out</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-lg font-bold text-[#1e1b4b]">Log In</Link>
                                    <Link to="/register" className="bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black text-center text-xs uppercase tracking-widest">Join Community</Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
