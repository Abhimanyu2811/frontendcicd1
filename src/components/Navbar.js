import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../services/authService';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/landing');
  };

  const toggleNavbar = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      if (user.role === ROLES.INSTRUCTOR) {
        navigate('/instructor-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    } else {
      navigate('/landing');
    }
  };

  const isActive = (path) => location.pathname === path;

  const resultsPath =
    user?.role === ROLES.STUDENT ? '/all-results' : '/instructor-results';

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark border-bottom shadow-sm"
      style={{
        background: 'linear-gradient(90deg, #121212, #1f1f1f)',
        borderBottom: '1px solid #444',
      }}
    >
      <div className="container">
        <Link
          to="/"
          className="navbar-brand fw-bold text-primary fs-4 d-flex align-items-center"
          onClick={handleHomeClick}
        >
          EduSync
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-controls="navbarContent"
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`}
          id="navbarContent"
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                to="/"
                className={`nav-link fs-6 px-3 rounded ${
                  isActive('/')
                    ? 'active text-primary fw-semibold'
                    : 'text-white'
                }`}
                onClick={handleHomeClick}
              >
                Dashboard
              </Link>
            </li>

            {isAuthenticated && (
              <li className="nav-item">
                <Link
                  to={resultsPath}
                  className={`nav-link fs-6 px-3 rounded ${
                    isActive('/results') ||
                    isActive('/all-results') ||
                    isActive('/instructor-results')
                      ? 'active text-primary fw-semibold'
                      : 'text-white'
                  }`}
                >
                  Results
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <>
                <span className="text-white me-3 fs-6">
                  Welcome,{' '}
                  <span className="fw-bold text-info">{user?.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-light btn-sm px-3"
                  title="Logout"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary btn-sm px-3">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm px-3">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
