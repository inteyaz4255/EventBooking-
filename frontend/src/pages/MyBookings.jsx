
import { useEffect, useState } from "react";
import API from "../services/api";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      const response = await API.get("/bookings/my-bookings");
      setBookings(response.data.bookings || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch bookings"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    try {
      const response = await API.delete(`/bookings/${bookingId}`);

      alert(response.data.message || "Booking cancelled successfully");

      fetchBookings();

    } catch (err) {
      alert(
        err.response?.data?.message || "Cancellation failed"
      );
    }
  };

  if (loading) return <h2>Loading your bookings...</h2>;

  if (error) return <h2>{error}</h2>;

  return (
    <div className="bookings-container">
      <h1>My Bookings</h1>
      <p>Manage your event tickets.</p>

      {bookings.length === 0 ? (
        <h3>You haven't booked any events yet.</h3>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => (
            <div className="booking-card" key={booking._id}>
              <h2>
                {booking.event?.title || "Event unavailable"}
              </h2>

              <p>
                Location: {booking.event?.location || "N/A"}
              </p>

              <p>
                Date: {booking.event?.date
                  ? new Date(booking.event.date).toLocaleDateString()
                  : "N/A"}
              </p>

              <p>Tickets: {booking.quantity}</p>

              <p>Total Price: ₹{booking.totalPrice}</p>

              <p>
                Status:{" "}
                <strong>{booking.status}</strong>
              </p>

              {booking.status === "confirmed" && (
                <button
                  onClick={() => handleCancel(booking._id)}
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
