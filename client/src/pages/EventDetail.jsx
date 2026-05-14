import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import { FaCalendarAlt, FaMapMarkerAlt, FaChair, FaMoneyBillWave, FaCheckCircle, FaReceipt, FaTicketAlt } from 'react-icons/fa';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [confirmedBooking, setConfirmedBooking] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/events/${id}`);
                setEvent(data);
            } catch (err) {
                setError('Failed to load event details.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const loadRazorpayScript = () => {
        return new Promise((resolve, reject) => {
            if (document.getElementById('razorpay-script')) {
                return resolve(true);
            }

            const script = document.createElement('script');
            script.id = 'razorpay-script';
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        setBookingLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            const { data } = await api.post('/bookings/create-order', { eventId: event._id });
            const loaded = await loadRazorpayScript();
            if (!loaded || !window.Razorpay) {
                throw new Error('Unable to load Razorpay checkout.');
            }

            const options = {
                key: data.key,
                amount: data.amount,
                currency: data.currency,
                name: 'EventForge',
                description: data.description,
                order_id: data.orderId,
                prefill: {
                    name: user?.name || '',
                    email: user?.email || ''
                },
                theme: {
                    color: '#1e1b4b'
                },
                handler: async (response) => {
                    try {
                        const { data: verifyRes } = await api.post('/bookings/verify-payment', {
                            eventId: event._id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        setConfirmedBooking(verifyRes.booking);
                        setEvent({ ...event, availableSeats: event.availableSeats - 1 });
                    } catch (err) {
                        setError(err.response?.data?.error || err.response?.data?.message || 'Payment verification failed');
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', (response) => {
                setError(response.error.description || 'Payment failed. Please try again.');
            });
            rzp.open();
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Payment failed');
        } finally {
            setBookingLoading(false);
        }
    };

    const handleBooking = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (event.ticketPrice > 0) {
            await handlePayment();
            return;
        }

        setBookingLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            const { data } = await api.post('/bookings', { eventId: event._id });
            setConfirmedBooking(data.booking);
            setEvent({ ...event, availableSeats: event.availableSeats - 1 });
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return <div className="text-center py-20 text-xl font-semibold">Loading...</div>;
    if (error && !event) return <div className="text-center py-20 text-xl text-red-500">{error || 'Event not found'}</div>;

    const isSoldOut = event.availableSeats <= 0;

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-8">
            {event.image ? (
                <img src={event.image} alt={event.title} className="w-full h-80 object-cover" />
            ) : (
                <div className="w-full h-64 bg-gray-900 flex items-center justify-center text-white/50 text-6xl font-black uppercase tracking-widest">
                    {event.category}
                </div>
            )}

            <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
                    <div>
                        <div className="inline-block bg-gray-200 text-gray-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
                            {event.category}
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{event.title}</h1>
                        <p className="text-gray-600 text-lg leading-relaxed mb-6">{event.description}</p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 min-w-[300px] w-full md:w-auto shrink-0 shadow-sm relative overflow-hidden">
                        {confirmedBooking ? (
                            <div className="animate-fade-in-up">
                                {/* Success Header */}
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 shadow-inner">
                                        <FaCheckCircle className="text-green-500 text-4xl" />
                                    </div>
                                    <h3 className="text-2xl font-black text-green-600 mb-2">Booking Confirmed!</h3>
                                    <p className="text-sm text-gray-500">Your digital ticket is ready.</p>
                                </div>

                                {/* Ticket Box */}
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm relative mb-6">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-600"></div>
                                    <div className="p-5">
                                        <div className="flex items-center gap-2 mb-4 text-green-600">
                                            <FaTicketAlt />
                                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Official Ticket</span>
                                        </div>
                                        <div className="mb-4">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Booking ID</p>
                                            <p className="font-mono text-sm font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded inline-block mt-1">{confirmedBooking._id}</p>
                                        </div>
                                        <div className="flex justify-between items-end pt-4 border-t border-dashed border-gray-200">
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase">Status</p>
                                                <p className="font-bold text-green-500 text-sm">PAID / CONFIRMED</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase">Amount</p>
                                                <p className="font-black text-xl text-gray-900">{confirmedBooking.amount === 0 ? 'FREE' : `₹${confirmedBooking.amount}`}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={() => navigate('/dashboard')}
                                        className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg transition hover:-translate-y-0.5 flex justify-center items-center gap-2"
                                    >
                                        <FaReceipt /> View in Dashboard
                                    </button>
                                    <button
                                        onClick={() => setConfirmedBooking(null)}
                                        className="w-full py-3 px-4 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-xl border border-gray-200 shadow-sm transition hover:-translate-y-0.5"
                                    >
                                        Book Another Ticket
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-xl font-bold text-gray-800 mb-6">Booking Details</h3>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-4 text-gray-600">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-900 shrink-0">
                                            <FaMoneyBillWave />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-400 uppercase">Ticket Price</p>
                                            <p className="font-bold text-gray-800 text-lg">{event.ticketPrice === 0 ? <span className="text-green-500">Free</span> : `₹${event.ticketPrice}`}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-gray-600">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-900 shrink-0">
                                            <FaChair />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-400 uppercase">Availability</p>
                                            <p className="font-bold text-gray-800">
                                                <span className={event.availableSeats < 10 ? 'text-orange-500' : ''}>{event.availableSeats}</span> / {event.totalSeats}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-gray-600">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-900 shrink-0">
                                            <FaCalendarAlt />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-400 uppercase">Date</p>
                                            <p className="font-bold text-gray-800">{new Date(event.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-gray-600">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-900 shrink-0">
                                            <FaMapMarkerAlt />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-400 uppercase">Location</p>
                                            <p className="font-bold text-gray-800">{event.location}</p>
                                        </div>
                                    </div>
                                </div>


                                <button
                                    onClick={handleBooking}
                                    disabled={isSoldOut || bookingLoading}
                                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition shadow-lg ${isSoldOut
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-gray-900 hover:bg-black text-white hover:shadow-xl hover:-translate-y-1'
                                        }`}
                                >
                                    {bookingLoading
                                        ? 'Processing...'
                                        : event.ticketPrice > 0
                                            ? `Pay ₹${event.ticketPrice} & Book`
                                            : (isSoldOut ? 'Sold Out' : 'Confirm Registration')}
                                </button>
                                {error && <p className="text-red-500 mt-4 text-center font-medium bg-red-50 p-2 rounded">{error}</p>}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
