
const express = require("express");

const { protect } = require("../middleware/authMiddleware");

const {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent
} = require("../controllers/eventController");

const router = express.Router();

//Get All events
router.get("/",getAllEvents)
router.get("/:id",getEventById)
router.put("/:id",protect,updateEvent)
router.delete("/:id",protect,deleteEvent)

// Create event
router.post("/", protect, createEvent);

module.exports = router;
