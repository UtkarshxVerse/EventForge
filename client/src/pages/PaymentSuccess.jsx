import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaReceipt } from 'react-icons/fa';

const PaymentSuccess = () => {
    const location = useLocation();
    const { booking, event } = location.state || {};

    return (
        <div className="min-h-[85vh] bg-[#fcfaff] selection:bg-green-100 selection:text-green-900 flex flex-col items-center justify-center py-12 px-4 sm:px-6">
            <div className="max-w-xl w-full">
                
                {/* Header Section */}
                <div className="text-center mb-8 animate-fade-in-up">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 shadow-inner">
                        <FaCheckCircle className="text-green-500 text-5xl drop-shadow-sm" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-[#1e1b4b] mb-4 tracking-tight">Booking Confirmed!</h1>
                    <p className="text-gray-600 text-lg">Your ticket has been booked successfully. A confirmation email has been sent to your registered email address.</p>
                </div>

                {/* Ticket Card */}
                {booking && event && (
                    <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 relative mb-8 transform transition hover:-translate-y-1">
                        {/* Top decorative edge */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-600"></div>
                        
                        <div className="p-8 md:p-10">
                            <div className="flex items-center gap-3 mb-6">
                                <FaTicketAlt className="text-green-500 text-xl" />
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Official Ticket Receipt</h3>
                            </div>
                            
                            <h2 className="text-2xl font-black text-gray-900 mb-6 leading-tight">{event.title}</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1 flex items-center gap-2"><FaCalendarAlt /> Date</p>
                                    <p className="text-gray-800 font-semibold">{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1 flex items-center gap-2"><FaMapMarkerAlt /> Location</p>
                                    <p className="text-gray-800 font-semibold">{event.location}</p>
                                </div>
                            </div>

                            {/* Divider with cutout circles to look like a ticket */}
                            <div className="relative border-t-2 border-dashed border-gray-200 my-8">
                                <div className="absolute -left-12 -top-4 w-8 h-8 bg-[#fcfaff] rounded-full border-r-2 border-gray-100"></div>
                                <div className="absolute -right-12 -top-4 w-8 h-8 bg-[#fcfaff] rounded-full border-l-2 border-gray-100"></div>
                            </div>

                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Booking ID</p>
                                    <p className="text-gray-900 font-mono text-sm bg-gray-100 px-3 py-1 rounded-lg inline-block">{booking._id}</p>
                                </div>
                                <div className="text-left md:text-right">
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Total Amount Paid</p>
                                    <p className="text-3xl font-black text-green-600">{booking.amount === 0 ? 'FREE' : `₹${booking.amount}`}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/dashboard" className="flex-1 flex justify-center items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-2xl transition shadow-xl hover:shadow-2xl hover:-translate-y-1">
                        <FaReceipt /> View My Tickets
                    </Link>
                    <Link to="/" className="flex-1 flex justify-center items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-bold py-4 px-6 rounded-2xl border border-gray-200 transition shadow-sm hover:shadow-md hover:-translate-y-1">
                        Discover More Events
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
