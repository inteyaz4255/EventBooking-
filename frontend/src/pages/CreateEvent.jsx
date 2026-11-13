
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function CreateEvent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    price: "",
    totalTickets: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await API.post("/events", {
        ...formData,
        price: Number(formData.price),
        totalTickets: Number(formData.totalTickets)
      });

      alert("Event created successfully!");
      navigate("/organizer-dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create event"
      );
    }
  };

  return (
    <div className="create-event-container">
      <h2>Create New Event</h2>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Event Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Event Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          name="location"
          placeholder="Event Location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <label>Event Date</label>
        <input
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Ticket Price"
          min="0"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="totalTickets"
          placeholder="Total Tickets"
          min="1"
          value={formData.totalTickets}
          onChange={handleChange}
          required
        />

        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}

export default CreateEvent;
