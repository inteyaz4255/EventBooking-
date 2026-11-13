
const express = require("express");

const { protect } = require("../middleware/authMiddleware");

const {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    getMyEvents
} = require("../controllers/eventController");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

//Get All events
router.get("/",getAllEvents)

router.get(
  "/my-events",
  protect,
  authorizeRoles("organizer", "admin"),
  getMyEvents
);

router.get("/:id",getEventById)
router.put("/:id",protect,updateEvent)
router.delete("/:id",protect,deleteEvent)

// Create event
router.post("/", authorizeRoles("organizer","admin"), protect, createEvent);

router.put(
  "/:id",
  protect,
  authorizeRoles("organizer", "admin"),
  updateEvent
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("organizer", "admin"),
  deleteEvent
);

module.exports = router;
