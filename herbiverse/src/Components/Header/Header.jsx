import React, { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // Update path as needed

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const userMenu = document.getElementById('user-menu-container');
      if (userMenu && !userMenu.contains(event.target) && userMenuOpen) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  return (
    <nav className="fixed top-0 left-0 w-full flex flex-col bg-[#FFFAF7] text-black font-merriwether shadow-md z-50">
      <div className="flex w-full items-center px-4 py-4">
        {/* Logo */}
        <NavLink to="/" className="text-2xl font-bold">
          HERBIVERSE
        </NavLink>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex flex-grow justify-center space-x-6 text-md font-semibold">
          <NavLink to="/" className="hover:text-gray-500">HOME</NavLink>
          <NavLink to="/Herbcatalog" className="hover:text-gray-500">HERB CATALOG</NavLink>
          <NavLink to="/virtual-tour" className="hover:text-gray-500">VIRTUAL TOUR</NavLink>
          {isAuthenticated && (
            <NavLink to="/favourite" className="hover:text-gray-500">FAVOURITES</NavLink>
          )}
          <NavLink to="/about-us" className="hover:text-gray-500">ABOUT US</NavLink>
        </div>

        {/* Auth/User Section - Desktop */}
        <div className="hidden md:flex items-center ml-auto">
          {isAuthenticated ? (
            <div id="user-menu-container" className="relative">
              <button 
                onClick={toggleUserMenu} 
                className="flex items-center space-x-2 bg-green-100 hover:bg-green-200 px-4 py-2 rounded-md"
              >
                <span className="font-medium">
                  {user?.name || user?.username || user?.email?.split('@')[0] || 'User'}
                </span>
                <svg 
                  className={`h-4 w-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <NavLink 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Profile
                  </NavLink>
                  <NavLink 
                    to="/favourite" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    My Favorites
                  </NavLink>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setUserMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <NavLink to="/login" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                LOGIN
              </NavLink>
              <NavLink to="/signup" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                SIGNUP
              </NavLink>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden ml-auto text-black" onClick={toggleMobileMenu}>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FFFAF7] border-t w-full">
          <div className="flex flex-col px-4 py-4 space-y-4 text-lg font-semibold">
            {isAuthenticated && (
              <div className="bg-green-100 p-3 rounded-md mb-2">
                <p className="font-bold text-green-800">
                  Welcome, {user?.name || user?.username || user?.email?.split('@')[0] || 'User'}!
                </p>
              </div>
            )}
            
            <NavLink to="/" className="hover:text-gray-500" onClick={toggleMobileMenu}>HOME</NavLink>
            <NavLink to="/Herbcatalog" className="hover:text-gray-500" onClick={toggleMobileMenu}>HERB CATALOG</NavLink>
            <NavLink to="/virtual-tour" className="hover:text-gray-500" onClick={toggleMobileMenu}>VIRTUAL TOUR</NavLink>
            
            {isAuthenticated && (
              <>
                <NavLink to="/favourite" className="hover:text-gray-500" onClick={toggleMobileMenu}>FAVOURITES</NavLink>
                <NavLink to="/profile" className="hover:text-gray-500" onClick={toggleMobileMenu}>PROFILE</NavLink>
              </>
            )}
            
            <NavLink to="/about-us" className="hover:text-gray-500" onClick={toggleMobileMenu}>ABOUT US</NavLink>

            {/* Auth Buttons - Mobile */}
            {isAuthenticated ? (
              <button 
                onClick={() => { handleLogout(); toggleMobileMenu(); }} 
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                LOGOUT
              </button>
            ) : (
              <>
                <NavLink 
                  to="/login" 
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600" 
                  onClick={toggleMobileMenu}
                >
                  LOGIN
                </NavLink>
                <NavLink 
                  to="/signup" 
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" 
                  onClick={toggleMobileMenu}
                >
                  SIGNUP
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Header;