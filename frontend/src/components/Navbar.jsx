
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        EventBooking
      </Link>

      <div className="navbar-links">
        <Link to="/">Home</Link>

        {user && (
          <Link to="/my-bookings">My Bookings</Link>
        )}

        {user?.role === "organizer" && (
          <Link to="/organizer-dashboard">
            Organizer Dashboard
          </Link>
          
        )}

       {user?.role === "organizer" && (
  <Link to="/create-event">Create Event</Link>
)}

        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="nav-register">
              Register
            </Link>
          </>
        ) : (
          <>
            <span className="navbar-user">
              Hi, {user.name}
            </span>

            <button onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
