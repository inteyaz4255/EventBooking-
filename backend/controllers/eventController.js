const Event = require("../models/Event");

//CREAT EVENT
const createEvent = async (req, res) => {
  try {
    const { title, description, location, date, price, totalTickets } =
      req.body;

    //VALIDATE required Fields

    if (
      !title ||
      !description ||
      !location ||
      !date ||
      price === undefined ||
      totalTickets === undefined
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    //validate date

    const eventDate = new Date(date);

    if (Number.isNaN(eventDate.getTime())) {
      return res.status(400).json({
        message: "Invalid Event Date",
      });
    }

    //validate ticket information
    if (
      !Number.isFinite(Number(price)) ||
      Number(price) < 0 ||
      !Number.isInteger(Number(totalTickets)) ||
      Number(totalTickets) < 1
    ) {
      return res.status(400).json({
        message: "Invalid price or ticket quantity",
      });
    }

    // Create event
    const event = await Event.create({
      title,
      description,
      location,
      date: eventDate,
      price: Number(price),
      totalTickets: Number(totalTickets),
      availableTickets: Number(totalTickets),
      organizer: req.user.id,
    });

    res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create event",
      error: error.message,
    });
  }
};


const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find()
            .sort({ date: 1 });

        res.status(200).json({
            count: events.length,
            events
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch events",
            error: error.message
        });
    }
};


const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.status(200).json({
            event
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid event ID"
            });
        }

        res.status(500).json({
            message: "Failed to fetch event",
            error: error.message
        });
    }
};


const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        // Only the event owner can update it
        if (event.organizer.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You cannot update this event"
            });
        }

        const allowedFields = [
            "title",
            "description",
            "location",
            "date",
            "price"
        ];

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                event[field] = req.body[field];
            }
        }

        await event.save();

        res.status(200).json({
            message: "Event updated successfully",
            event
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update event",
            error: error.message
        });
    }
};



const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        // Check event ownership
        if (event.organizer.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You cannot delete this event"
            });
        }

        await event.deleteOne();

        res.status(200).json({
            message: "Event deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete event",
            error: error.message
        });
    }
};


const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({
      organizer: req.user.id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Organizer events fetched successfully",
      totalEvents: events.length,
      events
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};







module.exports = {createEvent,getAllEvents,getEventById,updateEvent,deleteEvent,getMyEvents}