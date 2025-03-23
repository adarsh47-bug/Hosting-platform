import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setIsLoggedIn(false);
    navigate('/login', { replace: true });
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-extrabold tracking-wide">
          <Link to="/" className="hover:text-gray-200">
            Hosting Platform
          </Link>
        </h1>
        <nav className="flex items-center space-x-6">
          {isLoggedIn && userInfo && (
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">
                Welcome, <strong>{userInfo.username}</strong>
              </span>
            </div>
          )}
          <ul className="flex space-x-6 items-center">
            {isLoggedIn ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-sm py-2 px-4 rounded-full hover:bg-red-600 transition duration-300"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="text-sm font-medium hover:text-gray-200 transition duration-300"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="bg-blue-500 text-sm py-2 px-4 rounded-full hover:bg-blue-600 transition duration-300"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
