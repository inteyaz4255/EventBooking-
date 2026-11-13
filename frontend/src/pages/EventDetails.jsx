
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await API.get(`/events/${id}`);
        setEvent(response.data.event || response.data);
      } catch (error) {
        setMessage(
          error.response?.data?.message || "Event not found"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleBooking = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to book tickets");
      navigate("/login");
      return;
    }

    try {
      const response = await API.post("/bookings", {
        eventId: id,
        quantity: Number(quantity)
      });

      alert(response.data.message || "Booking successful!");

      navigate("/my-bookings");

    } catch (error) {
      alert(
        error.response?.data?.message || "Booking failed"
      );
    }
  };

  if (loading) return <h2>Loading event...</h2>;

  if (!event) return <h2>{message || "Event not found"}</h2>;

  return (
    <div className="event-details-container">
      <div className="event-details-card">
        <h1>{event.title}</h1>

        <p>{event.description}</p>

        <p>
          <strong>Location:</strong> {event.location}
        </p>

        <p>
          <strong>Date:</strong>{" "}
          {new Date(event.date).toLocaleDateString()}
        </p>

        <p>
          <strong>Ticket Price:</strong> ₹{event.price}
        </p>

        <p>
          <strong>Available Tickets:</strong>{" "}
          {event.availableTickets}
        </p>

        {event.availableTickets > 0 ? (
          <>
            <label>Select Tickets:</label>

            <input
              type="number"
              min="1"
              max={event.availableTickets}
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Math.max(1, Math.min(
                    Number(e.target.value) || 1,
                    event.availableTickets
                  ))
                )
              }
            />

            <h3>
              Total Price: ₹{event.price * quantity}
            </h3>

            <button onClick={handleBooking}>
              Book Tickets
            </button>
          </>
        ) : (
          <h3>Sold Out</h3>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
