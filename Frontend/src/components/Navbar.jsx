import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function getCurrentUser() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:3000/api/user/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success === false || data.error) {
          setUser(null);
        } else {
          setUser(data);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      }
    }
    getCurrentUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img className="navbar__logo" src="/eagle.png" alt="logo" />
        Surya
      </div>

      <div className="navbar__links">
        <Link to="/">Home</Link>
        <Link to="/add">Sell Products</Link>
        <Link to="/my">My Products</Link>

        
        <Link to="/cart">Cart</Link>

        {user ? (
          <div className="profile-menu">
            <img
              src={user.profilePic}
              alt={user.name}
              className="user-image"
              onClick={() => setShowDropdown((prev) => !prev)}
            />
            {showDropdown && (
              <div className="dropdown-menu">
                {/* You can add more dropdown links here, e.g., Profile, Settings */}
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="navbar__cta">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;