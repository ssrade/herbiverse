import React, { useState, useContext, useEffect , useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // Update path as needed
import { 
  UserAvatar, 
  getUserName, 
  UserMenuDropdown, 
  ProfilePopup,
  MobileUserSection
} from "./ProfileComponents";

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [profilePopupOpen, setProfilePopupOpen] = useState(false);
  const { isAuthenticated, user, logout, refreshUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  // For debugging - log the user object
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("Header component - Current user data:", user);
    }
  }, [isAuthenticated, user]);

  // Refresh user profile when component mounts if authenticated
  const hasRefreshed = useRef(false);

useEffect(() => {
  if (isAuthenticated && !hasRefreshed.current) {
    refreshUserProfile();
    hasRefreshed.current = true; // Prevents further unnecessary calls
  }
}, [isAuthenticated]);


  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const toggleProfilePopup = async () => {
    // Refresh profile before showing popup
    if (isAuthenticated && !profilePopupOpen) {
      await refreshUserProfile();
    }
    
    setProfilePopupOpen(!profilePopupOpen);
    // Close user menu if it's open
    if (userMenuOpen) {
      setUserMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close user menu and profile popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const userMenu = document.getElementById('user-menu-container');
      const profilePopup = document.getElementById('profile-popup-container');
      const mobileProfilePopup = document.getElementById('profile-popup-container-mobile');
      
      if (userMenu && !userMenu.contains(event.target) && userMenuOpen) {
        setUserMenuOpen(false);
      }
      
      if (
        ((profilePopup && !profilePopup.contains(event.target)) || 
        (mobileProfilePopup && !mobileProfilePopup.contains(event.target))) && 
        profilePopupOpen
      ) {
        setProfilePopupOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen, profilePopupOpen]);

  // Attempt to get user data from localStorage if not available in context
  const getEffectiveUser = () => {
    if (user && Object.keys(user).length > 0) return user;
    
    try {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        return JSON.parse(storedUserData);
      }
    } catch (e) {
      console.error('Error retrieving user data from localStorage', e);
    }
    
    return null;
  };
  
  const effectiveUser = getEffectiveUser();

  return (
    <nav className="fixed top-0 left-0 w-full flex flex-col bg-[#F9FAF5] text-[#136b32] font-merriwether shadow-md z-50">
      <div className="flex w-full items-center px-4 py-4">
        {/* Logo */}
        <NavLink to="/" className="text-2xl font-bold">
          HERBIVERSE
        </NavLink>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex flex-grow justify-center space-x-6 text-md font-semibold">
          <NavLink to="/" className="hover:text-gray-500">HOME</NavLink>
          <NavLink to="/Herbcatalog" className="hover:text-gray-500">HERB CATALOG</NavLink>
          <NavLink to="/Rarespecies" className="hover:text-gray-500">RARE SPECIES</NavLink>
          {isAuthenticated && (
            <NavLink to="/favourite" className="hover:text-gray-500">FAVOURITES</NavLink>
          )}
          <NavLink to="/AboutUS" className="hover:text-gray-500">ABOUT US</NavLink>
        </div>

        {/* Auth/User Section - Desktop */}
        <div className="hidden md:flex items-center ml-auto">
          {isAuthenticated ? (
            <div id="user-menu-container" className="relative">
              <button 
                onClick={toggleUserMenu} 
                className="flex items-center space-x-2 bg-green-100 hover:bg-green-200 px-4 py-2 rounded-md"
              >
                {/* User Avatar */}
                <UserAvatar user={effectiveUser} size="sm" />
                <span className="font-medium">
                  {getUserName(effectiveUser)}
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
                <UserMenuDropdown 
                  user={effectiveUser}
                  toggleProfilePopup={toggleProfilePopup}
                  setUserMenuOpen={setUserMenuOpen}
                  handleLogout={handleLogout}
                />
              )}
              
              {/* User Profile Popup */}
              {profilePopupOpen && (
                <ProfilePopup 
                  user={effectiveUser}
                  handleLogout={handleLogout}
                  setProfilePopupOpen={setProfilePopupOpen}
                />
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
              <MobileUserSection 
                user={effectiveUser}
                toggleProfilePopup={toggleProfilePopup}
              />
            )}
            
            <NavLink to="/" className="hover:text-gray-500" onClick={toggleMobileMenu}>HOME</NavLink>
            <NavLink to="/Herbcatalog" className="hover:text-gray-500" onClick={toggleMobileMenu}>HERB CATALOG</NavLink>
            <NavLink to="/virtual-tour" className="hover:text-gray-500" onClick={toggleMobileMenu}>VIRTUAL TOUR</NavLink>
            
            {isAuthenticated && (
              <NavLink to="/favourite" className="hover:text-gray-500" onClick={toggleMobileMenu}>FAVOURITES</NavLink>
            )}
            
            <NavLink to="/AboutUS" className="hover:text-gray-500" onClick={toggleMobileMenu}>ABOUT US</NavLink>

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
      
      {/* Mobile User Profile Popup */}
      {profilePopupOpen && (
        <ProfilePopup 
          user={effectiveUser}
          isMobile={true}
          handleLogout={handleLogout}
          setProfilePopupOpen={setProfilePopupOpen}
          toggleMobileMenu={toggleMobileMenu}
        />
      )}
    </nav>
  );
}

export default Header;