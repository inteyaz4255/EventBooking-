import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await API.get("/events");
        setEvents(response.data.events || response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <h2>Loading events...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div className="events-container">
      <h1>Discover Events</h1>
      <p>Find and book your favourite events.</p>

      <div className="events-grid">
        {events.length === 0 ? (
          <h3>No events available</h3>
        ) : (
          events.map((event) => (
            <div className="event-card" key={event._id}>
              <h2>{event.title}</h2>

              <p>{event.description}</p>

              <p>Location: {event.location}</p>

              <p>Date: {new Date(event.date).toLocaleDateString()}</p>

              <p>Price: ₹{event.price}</p>

              <p>Available Tickets: {event.availableTickets}</p>

              <Link to={`/events/${event._id}`}>
                <button>View Details</button>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Events;
