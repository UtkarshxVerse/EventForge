import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaTicketAlt, FaTimesCircle } from 'react-icons/fa';

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchBookings();
    }, [user, navigate]);

    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/bookings/my');
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings', error);
        } finally {
            setLoading(false);
        }
    };

    const cancelBooking = async (id) => {
        if (window.confirm('Are you sure you want to cancel this booking request?')) {
            try {
                await api.delete(`/bookings/${id}`);
                fetchBookings();
            } catch (error) {
                alert(error.response?.data?.message || 'Error cancelling booking');
            }
        }
    };

    if (loading) return <div className="text-center py-20 text-xl font-semibold">Loading dashboard...</div>;

    return (
        <div className="min-h-screen bg-[#fcfaff] selection:bg-indigo-100 selection:text-indigo-900 py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="glass-card bg-white/80 rounded-[2rem] shadow-2xl border border-white/30 p-8 mb-10">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-20 h-20 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-3xl font-black uppercase tracking-widest shrink-0">
                                {user?.name.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-black text-[#1e1b4b] mb-2">Welcome, {user?.name}!</h1>
                                <p className="text-gray-600 text-base sm:text-lg">Your personal dashboard for all your bookings and event updates.</p>
                            </div>
                        </div>
                        
                    </div>
                </div>

                <div className="flex items-center justify-between mb-6 gap-4">
                    <h2 className="text-2xl sm:text-3xl font-black text-[#1e1b4b] flex items-center gap-3">
                        <FaTicketAlt className="text-indigo-600" /> My Booking Requests
                    </h2>
                </div>

                {bookings.length === 0 ? (
                    <div className="glass-card rounded-[2rem] shadow-2xl p-12 text-center border border-white/30 bg-white/85">
                        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaTicketAlt className="text-indigo-400 text-3xl" />
                        </div>
                        <p className="text-xl text-gray-600 mb-6 mt-4 font-medium">You haven't booked any events yet.</p>
                        <Link to="/" className="inline-block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-bold py-3 px-8 rounded-2xl shadow-xl hover:opacity-95 transition">
                            Browse Events
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bookings.map((booking) => (
                            <div key={booking._id} className="glass-card rounded-[2rem] overflow-hidden shadow-2xl transition hover:-translate-y-1 border border-white/30 flex flex-col">
                                <div className="p-6 flex-grow">
                                    {booking.eventId ? (
                                        <>
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-lg font-bold text-[#1e1b4b] leading-tight">{booking.eventId.title}</h3>
                                                <div className="flex flex-col gap-1 items-end">
                                                    <span className={`px-2 py-1 text-[10px] font-black rounded-full uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                        {booking.status}
                                                    </span>
                                                    {booking.status !== 'cancelled' && (
                                                        <span className={`px-2 py-1 text-[10px] font-black rounded-full uppercase tracking-wider ${booking.paymentStatus === 'paid' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                                                            {booking.paymentStatus.replace('_', ' ')}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-600 mb-4 space-y-2">
                                                <p><strong className="text-gray-700">Date:</strong> {new Date(booking.eventId.date).toLocaleDateString()}</p>
                                                <p><strong className="text-gray-700">Amount:</strong> {booking.amount === 0 ? 'Free' : `₹${booking.amount}`}</p>
                                                <p><strong className="text-gray-700">Requested:</strong> {new Date(booking.bookedAt).toLocaleDateString()}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-red-500 italic">Event details unavailable (might have been deleted)</p>
                                    )}
                                </div>
                                <div className="p-4 bg-white/70 flex justify-between items-center shrink-0 border-t border-white/50">
                                    {booking.eventId && booking.status !== 'cancelled' ? (
                                        <>
                                            <Link to={`/events/${booking.eventId._id}`} className="text-indigo-700 font-semibold text-sm hover:underline">View Event</Link>
                                            <button
                                                onClick={() => cancelBooking(booking._id)}
                                                className="text-red-600 font-semibold text-sm hover:text-red-700 transition flex items-center gap-1"
                                            >
                                                <FaTimesCircle /> Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <div className="w-full text-center text-sm text-gray-500 italic">Booking Cancelled</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
