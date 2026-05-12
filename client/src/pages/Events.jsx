import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { motion } from 'framer-motion';
import {
    FaMapMarkerAlt,
    FaSearch,
    FaArrowRight,
    FaCompass,
    FaTicketAlt,
    FaBolt
} from 'react-icons/fa';

const Events = () => {
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

        const timeoutId = setTimeout(fetchEvents, 300);
        return () => clearTimeout(timeoutId);
    }, [search]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.2 }
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

    return (
        <div className="min-h-screen bg-[#fcfaff] pt-32 pb-32 px-6">
            {/* SHARED BACKGROUND ANIMATION BLOBS */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-100 rounded-full blur-[120px] opacity-40 animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-100 rounded-full blur-[150px] opacity-30 animate-pulse" />
            </div>

            <div className="container mx-auto max-w-7xl">
                {/* Header Section - Refined to match Home feel */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8 px-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-5xl font-black text-[#1e1b4b] mb-4 tracking-tighter uppercase italic">DISCOVER</h1>
                        <div className="flex items-center gap-2 text-indigo-400 font-black text-[10px] tracking-[0.4em] uppercase">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" /> Global Discovery Hub
                        </div>
                    </motion.div>

                    {/* Search Bar - Identical to Hero style but compact */}
                    <div className="w-full md:w-[450px]">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="relative group pt-2"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 blur-2xl rounded-3xl opacity-10 group-hover:opacity-20 transition duration-500" />
                            <div className="relative glass p-2 rounded-[2rem] shadow-2xl border-white/80 overflow-hidden">
                                <div className="flex items-center px-6">
                                    <FaSearch className="text-indigo-400 text-lg" />
                                    <input
                                        type="text"
                                        placeholder="Search for events..."
                                        className="w-full px-5 py-4 bg-transparent focus:outline-none text-[#1e1b4b] font-bold text-md placeholder-indigo-200"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-6">
                        <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                        <p className="text-indigo-400 font-black text-xs tracking-widest uppercase animate-pulse">Synchronizing Experiences...</p>
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-40 bg-white/50 backdrop-blur-3xl rounded-[4rem] border border-white/40 shadow-2xl shadow-indigo-100/10">
                        <FaCompass className="text-indigo-100 text-8xl mx-auto mb-8" />
                        <h3 className="text-3xl font-black text-[#1e1b4b] mb-4 uppercase italic">Event not Found !</h3>
                        <p className="text-gray-400 font-medium mb-12 text-lg">No active events found for this sector.</p>
                        <button onClick={() => setSearch('')} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-[#1e1b4b] transition-all">Reset Search<i class="fa fa-search" aria-hidden="true"></i></button>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                    >
                        {events.map((event) => (
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
                )}
            </div>
        </div>
    );
};

export default Events;
