
import { useEffect, useState } from "react";
import API from "../services/api";

const OrganizerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyEvents = async () => {
    try {
      const response = await API.get("/events/my-events");

      setEvents(response.data.events || []);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to fetch organizer events"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const handleDelete = async (eventId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/events/${eventId}`);

      alert("Event deleted successfully");

      setEvents((previousEvents) =>
        previousEvents.filter((event) => event._id !== eventId)
      );

    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to delete event"
      );
    }
  };

  if (loading) return <h2>Loading dashboard...</h2>;

  if (error) return <h2>{error}</h2>;

  return (
    <div className="organizer-container">

      <div className="organizer-header">
        <h1>Organizer Dashboard</h1>
        <p>Manage your events in one place.</p>
      </div>

      <div className="organizer-stats">
        <div className="stat-card">
          <h3>Total Events</h3>
          <h2>{events.length}</h2>
        </div>

        <div className="stat-card">
          <h3>Total Tickets Available</h3>
          <h2>
            {events.reduce(
              (total, event) =>
                total + (event.availableTickets || 0),
              0
            )}
          </h2>
        </div>
      </div>

      <h2 className="my-events-heading">My Events</h2>

      {events.length === 0 ? (
        <h3>You haven't created any events yet.</h3>
      ) : (
        <div className="organizer-events-grid">

          {events.map((event) => (
            <div className="organizer-event-card" key={event._id}>

              <h2>{event.title}</h2>

              <p>{event.description}</p>

              <p>Location: {event.location}</p>

              <p>
                Date:{" "}
                {new Date(event.date).toLocaleDateString()}
              </p>

              <p>Ticket Price: ₹{event.price}</p>

              <p>
                Available Tickets: {event.availableTickets}
              </p>

              <p>Total Tickets: {event.totalTickets}</p>

              <button
                className="delete-event-btn"
                onClick={() => handleDelete(event._id)}
              >
                Delete Event
              </button>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default OrganizerDashboard;
