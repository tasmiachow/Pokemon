import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const location = useLocation(); // Get the current route

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/"></Link>
      </div>
      <ul className="nav-links">
        {/* Conditionally render the Home link */}
        {location.pathname !== '/' && (
          <li>
            <Link to="/">Home</Link>
          </li>
        )}
         <li>
          <Link to="/login">Login</Link>
        </li>
        {/* <li>
          <Link to="/contact">Contact</Link>
        </li>  */}
      </ul>
    </nav>
  );
};

export default Navbar;
