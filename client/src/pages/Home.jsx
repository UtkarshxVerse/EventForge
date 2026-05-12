import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../components/Logo';
import {
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaSearch,
    FaRegClock,
    FaTicketAlt,
    FaBolt,
    FaArrowRight,
    FaHeart,
    FaGlobeAmericas,
    FaCompass
} from 'react-icons/fa';

const Home = ({ viewOnly }) => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await api.get(`/events?search=${search}`);
                setEvents(data);
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchEvents();
        }, 400);
        return () => clearTimeout(timeoutId);
    }, [search]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.3 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.92, y: 30 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: "spring", stiffness: 80, damping: 15 }
        }
    };

    // Complex background blob animation configuration
    const blobConfigs = [
        { color: 'bg-indigo-300', size: 'w-96 h-96', initialX: -100, initialY: -100 },
        { color: 'bg-purple-300', size: 'w-[500px] h-[500px]', initialX: '60%', initialY: -50 },
        { color: 'bg-pink-300', size: 'w-[400px] h-[400px]', initialX: '20%', initialY: '40%' },
        { color: 'bg-blue-300', size: 'w-80 h-80', initialX: '70%', initialY: '30%' }
    ];

    return (
        <div className="min-h-screen bg-[#fcfaff] selection:bg-indigo-100 selection:text-indigo-900">
            {/* BACKGROUND ANIMATION - SHARED */}
            <div className="fixed inset-0 -z-10 bg-white">
                {blobConfigs.map((config, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            x: [0, 50, -50, 0],
                            y: [0, -40, 60, 0],
                            scale: [1, 1.2, 0.9, 1],
                            rotate: [0, 90, 180, 0],
                        }}
                        transition={{
                            duration: 15 + i * 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className={`absolute ${config.size} ${config.color} rounded-full blur-[100px] opacity-20 mix-blend-multiply`}
                        style={{ left: config.initialX, top: config.initialY }}
                    />
                ))}
            </div>

            {!viewOnly && (
                <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-32">
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="max-w-5xl mx-auto text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            >
                                <motion.div
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="inline-flex items-center gap-2 bg-indigo-600/10 backdrop-blur-sm text-indigo-600 px-6 py-2.5 rounded-full text-sm font-bold tracking-wide mb-10 border border-indigo-100/50 shadow-sm"
                                >
                                    <FaBolt className="animate-pulse" /> The World is Your Stage
                                </motion.div>

                                <h1 className="text-6xl md:text-8xl font-black text-[#1e1b4b] mb-8 leading-[1.05] tracking-tighter">
                                    Experience the <br />
                                    <span className="relative inline-block">
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
                                            EXTRAORDINARY.
                                        </span>
                                        <motion.div
                                            animate={{ width: ["0%", "100%", "0%"] }}
                                            transition={{ duration: 8, repeat: Infinity }}
                                            className="absolute -bottom-2 left-0 h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-full opacity-30"
                                        />
                                    </span>
                                </h1>

                                <p className="text-gray-500 text-lg md:text-2xl mb-14 max-w-3xl mx-auto leading-relaxed font-medium">
                                    Step into a world where events aren't just attended—they are lived.
                                    Discover the pulse of your city through curated tech, music, and art.
                                </p>

                                {/* Animated Search Bar with Glow */}
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    className="max-w-2xl mx-auto relative group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 blur-3xl rounded-3xl opacity-20 group-hover:opacity-40 transition duration-500" />
                                    <div className="relative glass p-2.5 rounded-[2rem] shadow-2xl border-white/80 overflow-hidden">
                                        <div className="flex items-center px-6">
                                            <FaSearch className="text-indigo-400 text-xl" />
                                            <input
                                                type="text"
                                                placeholder="What sparks your interest today?"
                                                className="w-full px-6 py-5 bg-transparent focus:outline-none text-[#1e1b4b] font-bold text-lg md:text-xl placeholder-indigo-200"
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                            <button className="hidden lg:flex bg-[#1e1b4b] text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-600 transition-all active:scale-95 items-center gap-2">
                                                Search <FaArrowRight />
                                            </button>
                                        </div>

                                        <motion.div
                                            animate={{ x: ["-100%", "100%"] }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                            className="absolute bottom-0 left-0 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-50"
                                        />
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Floating Decorative Icons */}
                    {[FaTicketAlt, FaHeart, FaGlobeAmericas].map((Icon, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                y: [0, -30, 0],
                                rotate: [0, 10, -10, 0],
                                opacity: [0.1, 0.3, 0.1]
                            }}
                            transition={{ duration: 10 + i * 2, repeat: Infinity }}
                            className={`absolute hidden lg:block text-indigo-900 pointer-events-none text-4xl`}
                            style={{
                                left: i === 0 ? '10%' : i === 1 ? '85%' : '45%',
                                bottom: i === 2 ? '15%' : '65%'
                            }}
                        >
                            <Icon />
                        </motion.div>
                    ))}
                </section>
            )}

            {/* Events Grid Section */}
            <section className={`container mx-auto px-6 py-20 ${viewOnly ? 'mt-24' : ''} bg-white/50 backdrop-blur-3xl rounded-[4rem] border border-white/40 shadow-2xl shadow-indigo-100/20 mb-32 mx-6`}>

                {viewOnly && (
                    <div className="max-w-2xl mx-auto mb-20">
                        <div className="relative glass p-2 rounded-[1.5rem] shadow-xl border-indigo-50 overflow-hidden">
                            <div className="flex items-center px-6">
                                <FaSearch className="text-indigo-400" />
                                <input
                                    type="text"
                                    placeholder="Search events..."
                                    className="w-full px-5 py-4 bg-transparent focus:outline-none text-[#1e1b4b] font-bold text-lg"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 px-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-black text-[#1e1b4b] mb-3 tracking-tighter uppercase italic">UPCOMING EVENTS</h2>
                        <div className="flex items-center gap-2 text-indigo-400 font-black text-[10px] tracking-[0.4em] uppercase">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" /> Synchronizing Experiences
                        </div>
                    </motion.div>
                    <div className="glass px-8 py-3 rounded-2xl text-[#1e1b4b] font-black text-xs tracking-widest uppercase border-indigo-50">
                        {events.length} SIGNALS FOUND
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-6">
                        <div className="relative w-20 h-20">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                className="absolute inset-0 border-4 border-indigo-100 border-t-indigo-600 rounded-full"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                className="absolute inset-4 border-4 border-purple-100 border-b-purple-600 rounded-full"
                            />
                        </div>
                        <p className="text-indigo-400 font-black text-xs tracking-widest uppercase animate-pulse">Establishing Connection...</p>
                    </div>
                ) : events.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-40 border-4 border-dashed border-indigo-50 rounded-[3rem]"
                    >
                        <FaCompass className="text-indigo-100 text-8xl mx-auto mb-8" />
                        <h3 className="text-3xl font-black text-[#1e1b4b] mb-4">No Signals Detected.</h3>
                        <p className="text-gray-400 font-medium mb-12 text-lg">Your search didn't pick up any frequencies in the current area.</p>
                        <button onClick={() => setSearch('')} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-[#1e1b4b] transition-all active:scale-95">Reset Radar</button>
                    </motion.div>
                ) : (
                    <div className="space-y-20">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                        >
                            {(viewOnly ? events : events.slice(0, 6)).map((event) => (
                                <motion.div
                                    key={event._id}
                                    variants={cardVariants}
                                    className="group relative"
                                >
                                    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-100/50 border border-indigo-50 flex flex-col h-full transition-transform duration-500 hover:-translate-y-4">
                                        <div className="relative h-72 overflow-hidden">
                                            {event.image ? (
                                                <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white/50 text-5xl font-black">
                                                    {event.category?.slice(0, 2).toUpperCase() || 'EV'}
                                                </div>
                                            )}

                                            {/* Floating Price Tag */}
                                            <div className="absolute top-6 right-6 z-20">
                                                <motion.div
                                                    whileHover={{ scale: 1.1 }}
                                                    className="glass px-6 py-2.5 rounded-2xl flex items-center gap-2 shadow-2xl shadow-black/20"
                                                >
                                                    <span className="text-sm font-black text-[#1e1b4b]">
                                                        {event.ticketPrice === 0 ? 'FREEPASS' : `₹${event.ticketPrice}`}
                                                    </span>
                                                </motion.div>
                                            </div>

                                            {/* Category Badge */}
                                            <div className="absolute bottom-6 left-6 z-20">
                                                <span className="bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-widest shadow-lg">
                                                    {event.category}
                                                </span>
                                            </div>

                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                        </div>

                                        <div className="p-10 flex-grow flex flex-col">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center gap-2 text-indigo-400 font-black text-[10px] uppercase tracking-widest">
                                                    <FaMapMarkerAlt className="text-indigo-600" /> {event.location?.split(',')[0] || 'Remote'}
                                                </div>
                                                <div className="w-1 h-1 bg-indigo-100 rounded-full" />
                                                <div className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                                                    {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </div>

                                            <h3 className="text-2xl font-black text-[#1e1b4b] mb-8 leading-tight group-hover:text-indigo-600 transition-colors">{event.title}</h3>

                                            <div className="mt-auto pt-8 border-t border-indigo-50/50 flex items-center justify-between">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Availability</span>
                                                    <span className="text-sm font-black text-[#1e1b4b] flex items-center gap-1.5">
                                                        {event.availableSeats} <span className="text-gray-300 font-medium">/ {event.totalSeats}</span>
                                                    </span>
                                                </div>

                                                <Link
                                                    to={`/events/${event._id}`}
                                                    className="w-14 h-14 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-xl group/btn"
                                                >
                                                    <FaArrowRight className="text-lg group-hover/btn:translate-x-1 p-0.5 transition-transform" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {!viewOnly && (
                            <div className="flex justify-center">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        to="/events"
                                        className="bg-[#1e1b4b] text-white px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center gap-4 shadow-2xl shadow-indigo-200 hover:bg-indigo-600 transition-all group"
                                    >
                                        Explore More Events
                                        <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                                    </Link>
                                </motion.div>
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* Platform Trust Row */}
            <section className="container mx-auto px-6 mb-32 grid grid-cols-1 md:grid-cols-3 gap-16">
                {[
                    { icon: <FaBolt />, title: 'Easy Bookings', desc: 'Secure your entry with fast, simple and hassle free bookings.' },
                    { icon: <FaGlobeAmericas />, title: 'Geo-Locked Events', desc: 'Access exclusive local gatherings that never make it to public social media.' },
                    { icon: <FaHeart />, title: 'Vetted Quality', desc: 'We filter out the noise. Every event is manually verified by our culture team.' }
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        whileInView={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 20 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="text-center group"
                    >
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-3xl mx-auto mb-8 shadow-2xl shadow-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                            {item.icon}
                        </div>
                        <h4 className="text-2xl font-black text-[#1e1b4b] mb-4 tracking-tighter">{item.title}</h4>
                        <p className="text-gray-400 font-medium leading-relaxed max-w-xs mx-auto text-sm">{item.desc}</p>
                    </motion.div>
                ))}
            </section>

            {/* Newsletter - Glassy & Dynamic */}
            <section className="container mx-auto px-6 mb-25">
                <div className="relative rounded-[4rem] p-12 md:p-32 text-center text-white overflow-hidden shadow-2xl shadow-indigo-100">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-700" />

                    {/* Living background for newsletter */}
                    <div className="absolute inset-0">
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 180, 0]
                            }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-1/2 -left-1/4 w-[100%] h-[100%] bg-white/10 rounded-full blur-[120px]"
                        />
                    </div>

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <motion.h2
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="text-5xl md:text-7xl font-black mb-10 tracking-tighter"
                        >
                            SYNC WITH <br /> THE CORE.
                        </motion.h2>
                        <p className="text-indigo-100 text-lg md:text-xl mb-14 font-medium opacity-90 leading-relaxed">
                            Join 50,000+ members receiving weekly secret event drop signals and early access passes.
                        </p>
                        <form className="flex flex-col md:flex-row gap-5">
                            <input
                                type="email"
                                placeholder="Your electronic identity"
                                className="flex-grow bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl px-8 py-5 text-white placeholder-white/50 focus:outline-none focus:bg-white/20 transition font-bold text-lg"
                            />
                            <button className="bg-white text-indigo-700 font-black px-12 py-5 rounded-3xl hover:bg-indigo-50 transition active:scale-95 shadow-2xl">SUBSCRIBE</button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Refined Modern Footer */}
            <footer className="pt-32 pb-20 bg-white border-t border-indigo-50">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-24 gap-20">
                        <div className="max-w-md">
                            <div className="flex items-center gap-4 mb-10 group">
                                <Logo size="text-3xl" iconSize="w-12 h-12" />
                            </div>
                            <p className="text-gray-400 font-medium leading-relaxed text-lg">
                                Your gateway to exciting events and unforgettable nights.
                                Easy booking. Endless experiences.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-20">
                            <div>
                                <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1e1b4b] mb-10">Protocols</h5>
                                <ul className="space-y-5">
                                    {['Privacy', 'Tickets', 'Safety', 'Refunds'].map(l => (
                                        <li key={l}><a href="#" className="text-gray-400 font-bold text-sm hover:text-indigo-600 transition uppercase tracking-widest">{l}</a></li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1e1b4b] mb-10">Platform</h5>
                                <ul className="space-y-5">
                                    {['Browse', 'Hosting', 'Dashboard', 'Support'].map(l => (
                                        <li key={l}><a href="#" className="text-gray-400 font-bold text-sm hover:text-indigo-600 transition uppercase tracking-widest">{l}</a></li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="pt-12 border-t border-indigo-50 flex flex-col md:flex-row justify-between items-center gap-8">
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-loose">
                            &copy; {new Date().getFullYear()} EVENTFORGE CORE LTD. <br />
                            ALL SIGNALS ENCRYPTED.
                        </p>
                        <div className="flex gap-10">
                            {['Discord', 'Twitter', 'GitHub', 'LinkedIn'].map(s => (
                                <a key={s} href="#" className="text-[10px] font-black text-gray-400 hover:text-indigo-600 transition uppercase tracking-[0.2em]">{s}</a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
