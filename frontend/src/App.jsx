
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EventDetails from "./pages/EventDetails";
import { AuthProvider } from "./context/AuthContext";

import OrganizerDashboard from "./pages/OrganizerDashboard";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import MyBookings from "./pages/MyBookings";
import CreateEvent from "./pages/CreateEvent";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route
  path="/organizer-dashboard"
  element={<OrganizerDashboard />}
/><Route path="/create-event" element={<CreateEvent />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/" element={<Events />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
