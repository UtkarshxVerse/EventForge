import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            const [eventsRes, bookingsRes] = await Promise.all([
                api.get('/events'),
                api.get('/bookings/my') // Admin gets all bookings
            ]);
            setEvents(eventsRes.data);
            setBookings(bookingsRes.data);
        } catch (error) {
            console.error('Error fetching admin data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEvent = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await api.delete(`/events/${id}`);
                fetchData();
            } catch (error) {
                alert('Error deleting event');
            }
        }
    };

    const handleConfirmBooking = async (id, paymentStatus) => {
        try {
            await api.put(`/bookings/${id}/confirm`, { paymentStatus });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error confirming booking');
        }
    };

    const handleCancelBooking = async (id) => {
        if (window.confirm('Cancel this user\'s booking request?')) {
            try {
                await api.delete(`/bookings/${id}`);
                fetchData();
            } catch (error) {
                alert(error.response?.data?.message || 'Error cancelling booking');
            }
        }
    };

    if (loading) return <div className="text-center py-20 text-xl font-semibold">Loading admin panel...</div>;

    return (
        <div className="min-h-screen bg-[#fcfaff] selection:bg-indigo-100 selection:text-indigo-900 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="glass-card bg-white/85 border border-white/40 rounded-[2rem] p-8 mb-10 shadow-2xl">
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                        <div className="max-w-2xl">
                            <p className="text-indigo-600 uppercase tracking-[0.35em] font-black text-sm mb-3">Admin Control Panel</p>
                            <h1 className="text-3xl sm:text-5xl font-black text-[#1e1b4b] mb-4">EventForge Dashboard</h1>
                            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">Manage your events, review bookings, and keep the platform running smoothly.</p>
                        </div>
                        <button
                            onClick={() => navigate('/admin/create-event')}
                            className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-bold py-3 px-6 rounded-2xl hover:opacity-95 transition shadow-xl"
                        >
                            + Create New Event
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="glass-card p-6 rounded-[2rem] border border-white/40 shadow-xl flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-gray-500 font-bold mb-2">Total Revenue</p>
                            <h3 className="text-3xl font-black text-green-600">₹{bookings.reduce((sum, b) => b.paymentStatus === 'paid' && b.status === 'confirmed' ? sum + b.amount : sum, 0)}</h3>
                        </div>
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-lg font-bold">₹</div>
                    </div>

                    <div className="glass-card p-6 rounded-[2rem] border border-white/40 shadow-xl flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-gray-500 font-bold mb-2">Paid Clients</p>
                            <h3 className="text-3xl font-black text-blue-600">{new Set(bookings.filter(b => b.paymentStatus === 'paid' && b.status === 'confirmed').map(b => b.userId?._id)).size}</h3>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-lg font-bold">👤</div>
                    </div>

                    <div className="glass-card p-6 rounded-[2rem] border border-white/40 shadow-xl flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-gray-500 font-bold mb-2">Pending Requests</p>
                            <h3 className="text-3xl font-black text-yellow-600">{bookings.filter(b => b.status === 'pending').length}</h3>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-lg font-bold">⏳</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-bold mb-6 text-[#1e1b4b] flex items-center gap-3">
                            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 text-sm">{events.length}</span>
                            All Events
                        </h2>
                        <div className="glass-card rounded-[2rem] border border-white/40 overflow-hidden shadow-xl">
                            <ul className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                                {events.length === 0 ? <li className="p-6 text-gray-500 text-center">No events created yet.</li> :
                                    events.map(event => (
                                        <li key={event._id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/90 hover:bg-white transition border-b border-gray-100 last:border-0">
                                            <div>
                                                <h4 className="font-bold text-gray-900 mb-1 leading-tight">{event.title}</h4>
                                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1 font-medium"><div className="w-2 h-2 rounded-full bg-blue-500"></div> {new Date(event.date).toLocaleDateString()}</span>
                                                    <span className="flex items-center gap-1 font-medium"><div className={`w-2 h-2 rounded-full ${event.availableSeats > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div> {event.availableSeats}/{event.totalSeats} seats</span>
                                                </div>
                                            </div>
                                            <button onClick={() => handleDeleteEvent(event._id)} className="w-full sm:w-auto text-red-500 hover:text-white hover:bg-red-500 border border-red-200 px-4 py-2 rounded-2xl text-sm font-bold transition shadow-sm shrink-0">
                                                Delete
                                            </button>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <h2 className="text-2xl font-bold mb-6 text-[#1e1b4b] flex items-center gap-3">
                            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 text-yellow-700 text-sm font-bold">{bookings.length}</span>
                            Booking Requests
                        </h2>
                        <div className="glass-card rounded-[2rem] border border-white/40 overflow-hidden shadow-xl">
                            <ul className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                                {bookings.length === 0 ? <li className="p-6 text-gray-500 text-center">No bookings yet.</li> :
                                    bookings.map(booking => (
                                        <li key={booking._id} className={`p-6 bg-white/90 hover:bg-white transition border-l-4 ${booking.status === 'pending' ? 'border-l-yellow-400' : booking.status === 'confirmed' ? 'border-l-green-400' : 'border-l-red-400'}`}>
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="font-bold text-gray-900 text-lg leading-tight">{booking.eventId?.title || 'Deleted Event'}</h4>
                                                <div className="flex flex-col gap-1 items-end shrink-0 ml-4">
                                                    <span className={`px-2 py-1 text-[10px] font-black rounded-full uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{booking.status}</span>
                                                    {booking.status !== 'cancelled' && <span className={`px-2 py-1 text-[10px] font-black rounded-full uppercase tracking-wider ${booking.paymentStatus === 'paid' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-800'}`}>{booking.paymentStatus.replace('_', ' ')}</span>}
                                                </div>
                                            </div>
                                            <div className="bg-slate-50 rounded-2xl p-4 mb-3 border border-slate-100 text-sm">
                                                <p className="text-gray-700 flex items-center gap-2 mb-1">
                                                    <span className="font-bold w-16 text-gray-500 uppercase text-xs">User:</span>
                                                    <span className="font-semibold">{booking.userId?.name}</span>
                                                    <span className="text-gray-400">({booking.userId?.email})</span>
                                                </p>
                                                <p className="text-gray-700 flex items-center gap-2 mb-1">
                                                    <span className="font-bold w-16 text-gray-500 uppercase text-xs">Amount:</span>
                                                    <span className={`font-semibold ${booking.amount === 0 ? 'text-green-600' : ''}`}>{booking.amount === 0 ? 'Free' : `₹${booking.amount}`}</span>
                                                </p>
                                                <p className="text-gray-700 flex items-center gap-2 mb-1">
                                                    <span className="font-bold w-16 text-gray-500 uppercase text-xs">Date:</span>
                                                    <span>{new Date(booking.bookedAt).toLocaleString()}</span>
                                                </p>
                                                {booking.eventId && (
                                                    <p className="text-gray-700 flex items-center gap-2 mt-2 pt-2 border-t border-slate-200">
                                                        <span className="font-bold w-16 text-gray-500 uppercase text-xs">Seats:</span>
                                                        <span className={`font-bold ${booking.eventId.availableSeats > 0 ? 'text-green-600' : 'text-red-500'}`}>{booking.eventId.availableSeats}</span> remaining of {booking.eventId.totalSeats}
                                                    </p>
                                                )}
                                            </div>
                                            {booking.status === 'pending' && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <button onClick={() => handleConfirmBooking(booking._id, 'paid')} className="flex-1 min-w-[120px] bg-green-50 text-green-700 hover:bg-green-600 hover:text-white border border-green-200 text-xs font-bold py-2.5 px-3 rounded-2xl shadow-sm transition">
                                                        ✓ Approve as Paid
                                                    </button>
                                                    <button onClick={() => handleConfirmBooking(booking._id, 'not_paid')} className="flex-1 min-w-[120px] bg-gray-50 text-gray-700 hover:bg-gray-800 hover:text-white border border-gray-200 text-xs font-bold py-2.5 px-3 rounded-2xl shadow-sm transition">
                                                        ✓ Approve Undecided
                                                    </button>
                                                    <button onClick={() => handleCancelBooking(booking._id)} className="w-[80px] bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border border-red-200 text-xs font-bold py-2.5 px-3 rounded-2xl transition">
                                                        ✕ Reject
                                                    </button>
                                                </div>
                                            )}
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
