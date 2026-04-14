const express = require('express');
const router = express.Router();
const {
    bookEvent,
    confirmBooking,
    getMyBookings,
    cancelBooking,
    createRazorpayOrder,
    verifyRazorpayPayment
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/auth');

router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify-payment', protect, verifyRazorpayPayment);
router.post('/', protect, bookEvent);
router.put('/:id/confirm', protect, admin, confirmBooking);
router.get('/my', protect, getMyBookings);
router.delete('/:id', protect, cancelBooking);

module.exports = router;
