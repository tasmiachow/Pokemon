import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import '../styles/Navbar.css';

const Navbar = () => {
  const location = useLocation(); // Get the current route
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // Set true if user exists
    });
    return () => unsubscribe(); // Cleanup listener
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully!');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/"><img src="/img/pokeball.png"></img></Link>
      </div>
      <ul className="nav-links">
        {/* Conditionally render the Home link */}
        {location.pathname !== '/' && (
          <li>
            <Link to="/">Home</Link>
          </li>
        )}

        {/* Conditionally render Login or Logout */}
        {isLoggedIn ? (
          <li>
            <button className="logout-button" onClick={handleLogout}>
              Log Out
            </button>
          </li>
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
