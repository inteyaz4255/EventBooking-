
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

module.exports = { createBooking };
