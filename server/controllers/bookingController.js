const Booking = require('../models/Booking');
const Event = require('../models/Event');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { sendBookingEmail } = require('../utils/email');

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const verifyRazorpaySignature = (orderId, paymentId, signature) => {
    const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');
    return generatedSignature === signature;
};

exports.bookEvent = async (req, res) => {
    try {
        const { eventId } = req.body;

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        if (event.availableSeats <= 0) return res.status(400).json({ message: 'No seats available' });

        const existingBooking = await Booking.findOne({ userId: req.user.id, eventId });
        if (existingBooking && existingBooking.status !== 'cancelled') {
            return res.status(400).json({ message: 'Already booked or pending' });
        }

        const booking = await Booking.create({
            userId: req.user.id,
            eventId,
            status: 'pending',
            paymentStatus: 'not_paid',
            amount: event.ticketPrice
        });

        res.status(201).json({ message: 'Booking request submitted', booking });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.createRazorpayOrder = async (req, res) => {
    try {
        const { eventId } = req.body;
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        if (event.availableSeats <= 0) return res.status(400).json({ message: 'No seats available' });
        if (event.ticketPrice <= 0) return res.status(400).json({ message: 'This event is free, use the regular booking flow.' });

        const order = await razorpayInstance.orders.create({
            amount: Math.round(event.ticketPrice * 100),
            currency: 'INR',
            receipt: `eventora_${Date.now()}`,
            payment_capture: 1
        });

        res.json({
            key: process.env.RAZORPAY_KEY_ID,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            description: `Booking for ${event.title}`
        });
    } catch (error) {
        res.status(500).json({ message: 'Unable to create payment order', error: error.message });
    }
};

exports.verifyRazorpayPayment = async (req, res) => {
    try {
        const { eventId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
            return res.status(400).json({ message: 'Invalid payment signature' });
        }

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        if (event.availableSeats <= 0) return res.status(400).json({ message: 'No seats available' });

        const existingBooking = await Booking.findOne({ userId: req.user.id, eventId });
        if (existingBooking && existingBooking.status !== 'cancelled') {
            return res.status(400).json({ message: 'Already booked or pending' });
        }

        const booking = await Booking.create({
            userId: req.user.id,
            eventId,
            status: 'confirmed',
            paymentStatus: 'paid',
            amount: event.ticketPrice
        });

        event.availableSeats -= 1;
        await event.save();

        await sendBookingEmail(req.user.email, req.user.name, event.title);

        res.json({ message: 'Payment verified and booking confirmed', booking });
    } catch (error) {
        res.status(500).json({ message: 'Payment verification failed', error: error.message });
    }
};

exports.confirmBooking = async (req, res) => {
    try {
        const { paymentStatus } = req.body; // 'paid' or 'not_paid'
        const booking = await Booking.findById(req.params.id).populate('userId').populate('eventId');
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        if (booking.status === 'confirmed') return res.status(400).json({ message: 'Booking is already confirmed' });

        const event = await Event.findById(booking.eventId._id);
        if (event.availableSeats <= 0) {
            return res.status(400).json({ message: 'No seats available to confirm this booking' });
        }

        booking.status = 'confirmed';
        if (paymentStatus) {
            booking.paymentStatus = paymentStatus;
        }
        await booking.save();

        event.availableSeats -= 1;
        await event.save();

        // Send email on admin confirmation
        await sendBookingEmail(booking.userId.email, booking.userId.name, booking.eventId.title);

        res.json({ message: 'Booking confirmed successfully', booking });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getMyBookings = async (req, res) => {
    try {
        const bookings = req.user.role === 'admin'
            ? await Booking.find().populate('eventId').populate('userId', 'name email').sort({ createdAt: -1 })
            : await Booking.find({ userId: req.user.id }).populate('eventId').sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        if (booking.status === 'cancelled') return res.status(400).json({ message: 'Already cancelled' });

        const wasConfirmed = booking.status === 'confirmed';

        booking.status = 'cancelled';
        await booking.save();

        // Only restore the seat if it was actually confirmed and deducted
        if (wasConfirmed) {
            const event = await Event.findById(booking.eventId);
            if (event) {
                event.availableSeats += 1;
                await event.save();
            }
        }

        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
