
const Booking = require("../models/Booking");
const Event = require("../models/Event");

const createBooking = async (req, res) => {
  try {
    const { eventId, quantity } = req.body;

    if (!eventId || !Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        message: "Valid eventId and quantity are required"
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    if (event.availableTickets < quantity) {
      return res.status(400).json({
        message: "Not enough tickets available"
      });
    }

    const totalPrice = event.price * quantity;

    const booking = await Booking.create({
      event: event._id,
      user: req.user.id,
      quantity,
      totalPrice
    });

    event.availableTickets -= quantity;
    await event.save();

    res.status(201).json({
      message: "Booking successful",
      booking
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



const getMyBookings = async (req, res) => {
  try {
    // Find bookings of the logged-in user
    const bookings = await Booking.find({
      user: req.user.id
    })
      .populate("event", "title location date price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "My bookings fetched successfully",
      totalBookings: bookings.length,
      bookings
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // 1. Find booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    // 2. Check booking ownership
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You cannot cancel someone else's booking"
      });
    }

    // 3. Check booking status
    if (booking.status === "cancelled") {
      return res.status(400).json({
        message: "Booking is already cancelled"
      });
    }

    // 4. Find event
    const event = await Event.findById(booking.event);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    // 5. Restore available tickets
    event.availableTickets += booking.quantity;
    await event.save();

    // 6. Update booking status
    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



const getEventBookings = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Find event
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    // Check event ownership
    if (event.organizer.toString() !== req.user.id &&
        req.user.role !== "admin") {
      return res.status(403).json({
        message: "You cannot view bookings for this event"
      });
    }

    // Find all bookings for this event
    const bookings = await Booking.find({
      event: eventId,
      status: "confirmed"
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    // Calculate statistics
    const totalTicketsSold = bookings.reduce(
      (total, booking) => total + booking.quantity,
      0
    );

    const totalRevenue = bookings.reduce(
      (total, booking) => total + booking.totalPrice,
      0
    );

    res.status(200).json({
      message: "Event bookings fetched successfully",
      totalBookings: bookings.length,
      totalTicketsSold,
      totalRevenue,
      bookings
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};




module.exports = { createBooking,getMyBookings,cancelBooking,getEventBookings};
