import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-white flex flex-col">
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/events/:id" element={<div className="container mx-auto px-4 py-32"><EventDetail /></div>} />
                        <Route path="/login" element={<div className="container mx-auto px-4 py-32"><Login /></div>} />
                        <Route path="/register" element={<div className="container mx-auto px-4 py-32"><Register /></div>} />
                        <Route path="/dashboard" element={<div className="container mx-auto px-4 py-32"><UserDashboard /></div>} />
                        <Route path="/admin" element={<div className="container mx-auto px-4 py-32"><AdminDashboard /></div>} />
                        <Route path="/payment-success" element={<div className="container mx-auto px-4 py-32"><PaymentSuccess /></div>} />
                        <Route path="/payment-failed" element={<div className="container mx-auto px-4 py-32"><PaymentFailed /></div>} />
                        <Route path="*" element={<h1 className="text-3xl font-bold text-center mt-32">404 - Page Not Found</h1>} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
