
const express = require("express");
const router = express.Router();

const { createBooking, getMyBookings,cancelBooking,getEventBookings} = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post("/", protect, createBooking);

router.get("/my-bookings", protect, getMyBookings);

router.get(
  "/event/:eventId",
  protect,
  authorizeRoles("organizer", "admin"),
  getEventBookings
);

//cancel booking
router.delete("/:bookingId",protect,cancelBooking)

module.exports = router;
