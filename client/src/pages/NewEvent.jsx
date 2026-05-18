import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';

const NewEvent = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', image: ''
    });

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };


    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await api.post('/events', formData);
            navigate('/admin');
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating event');
        }
    };

    return (
        <div className="min-h-screen bg-[#fcfaff] selection:bg-indigo-100 selection:text-indigo-900 py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="glass-card bg-white/85 border border-white/40 rounded-[2rem] p-8 mb-10 shadow-2xl">
                    <h1 className="text-3xl sm:text-5xl font-black text-[#1e1b4b] mb-4">Create New Event</h1>
                    <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-8">Fill in the details below to publish a new event to the platform.</p>
                    
                    <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input required type="text" placeholder="Event Title" className="border border-gray-200 bg-white/80 px-4 py-3 rounded-2xl focus:ring-2 focus:ring-indigo-400 outline-none transition" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                        <input required type="text" placeholder="Category (e.g., Tech, Music)" className="border border-gray-200 bg-white/80 px-4 py-3 rounded-2xl focus:ring-2 focus:ring-indigo-400 outline-none transition" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                        <input required type="date" className="border border-gray-200 bg-white/80 px-4 py-3 rounded-2xl focus:ring-2 focus:ring-indigo-400 outline-none transition" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                        <input required type="text" placeholder="Location" className="border border-gray-200 bg-white/80 px-4 py-3 rounded-2xl focus:ring-2 focus:ring-indigo-400 outline-none transition" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                        <input required type="number" placeholder="Total Seats" className="border border-gray-200 bg-white/80 px-4 py-3 rounded-2xl focus:ring-2 focus:ring-indigo-400 outline-none transition" value={formData.totalSeats} onChange={e => setFormData({ ...formData, totalSeats: e.target.value })} />
                        <input required type="number" placeholder="Ticket Price (0 for free)" className="border border-gray-200 bg-white/80 px-4 py-3 rounded-2xl focus:ring-2 focus:ring-indigo-400 outline-none transition" value={formData.ticketPrice} onChange={e => setFormData({ ...formData, ticketPrice: e.target.value })} />

                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-[#1e1b4b] mb-2 px-1">Event Image</label>
                            <div className="flex flex-col gap-3 p-4 bg-white/50 border border-gray-200 rounded-[1.5rem]">
                                <div>
                                    <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Upload from device</span>
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition cursor-pointer" />
                                </div>
                                <div className="flex items-center gap-4 my-1">
                                    <div className="h-px bg-gray-200 flex-1"></div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">OR</span>
                                    <div className="h-px bg-gray-200 flex-1"></div>
                                </div>
                                <div>
                                    <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Provide Image URL</span>
                                    <input type="text" placeholder="https://example.com/image.jpg" className="w-full border border-gray-200 bg-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                                </div>
                            </div>
                            {formData.image && (
                                <div className="mt-4 p-2 bg-white rounded-2xl border border-gray-100 shadow-sm inline-block">
                                    <img src={formData.image} alt="Preview" className="h-40 w-auto object-cover rounded-xl" />
                                </div>
                            )}
                        </div>

                        <textarea required placeholder="Event Description" className="border border-gray-200 bg-white/80 px-4 py-3 rounded-2xl md:col-span-2 h-32 focus:ring-2 focus:ring-indigo-400 outline-none transition" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        
                        <div className="md:col-span-2 flex justify-end gap-4 mt-2">
                            <button type="button" onClick={() => navigate('/admin')} className="bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-2xl hover:bg-gray-300 transition shadow-sm">Cancel</button>
                            <button type="submit" className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-bold py-3 px-8 rounded-2xl hover:opacity-95 transition shadow-xl">Publish Event</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewEvent;
