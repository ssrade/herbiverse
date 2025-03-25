import React from "react";
import { NavLink } from "react-router-dom";

// Avatar component
export const UserAvatar = ({ user, size = "md", onClick }) => {
  // Get user's initials for the avatar fallback
  const getUserInitials = () => {
    if (!user) return 'U';
    
    const name = user.name || '';
    const email = user.email || '';
    
    if (name && name.trim() !== '') {
      // Get first character of each word in the name
      return name.split(' ')
        .map(part => part.charAt(0).toUpperCase())
        .join('')
        .slice(0, 2); // Limit to max 2 characters
    } else if (email) {
      return email.charAt(0).toUpperCase();
    }
    
    return 'U';
  };

  // Size classes
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-32 w-32"
  };
  
  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-4xl"
  };

  return (
    <div 
      className={`${sizeClasses[size]} bg-green-500 text-white rounded-full flex items-center justify-center overflow-hidden ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      {user?.avatar ? (
        <img src={user.avatar} alt="User avatar" className="h-full w-full object-cover" />
      ) : (
        <span className={`${textSizeClasses[size]} font-bold`}>{getUserInitials()}</span>
      )}
    </div>
  );
};

// User name and email helpers
export const getUserName = (user) => {
  if (!user) return 'User';
  
  const name = user.name || '';
  const email = user.email || '';
  
  if (name && name.trim() !== '') {
    return name;
  } else if (email) {
    // If no name is available but we have an email, use the part before @
    return email.split('@')[0];
  }
  
  return 'User';
};

export const getUserEmail = (user) => {
  if (!user) return 'No email available';
  
  const email = user.email || '';
  
  if (email && email.trim() !== '') {
    return email;
  }
  
  return 'No email available';
};

// Desktop user menu dropdown
export const UserMenuDropdown = ({ user, toggleProfilePopup, setUserMenuOpen, handleLogout }) => {
  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 flex flex-col justify-center items-center">
      <button 
        onClick={toggleProfilePopup}
        className="block text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        View Profile
      </button>
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
        className="block w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
      >
        Logout
      </button>
    </div>
  );
};

// Profile popup for both desktop and mobile
export const ProfilePopup = ({ 
  user, 
  isMobile = false, 
  handleLogout, 
  setProfilePopupOpen, 
  toggleMobileMenu = () => {} 
}) => {
  const closePopup = () => {
    setProfilePopupOpen(false);
    if (isMobile) toggleMobileMenu();
  };

  return (
    <div 
      id={isMobile ? "profile-popup-container-mobile" : "profile-popup-container"}
      className={`${isMobile ? "md:hidden fixed bottom-0 left-0 right-0" : "absolute right-0 mt-2 w-64"} bg-white ${isMobile ? "rounded-t-lg" : "rounded-lg"} shadow-xl p-6 z-50`}
    >
      <div className="flex flex-col items-center">
        {/* Close Button for Mobile */}
        {isMobile && (
          <button 
            onClick={() => setProfilePopupOpen(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        {/* Large Avatar */}
        <UserAvatar user={user} size="lg" />
        
        {/* User Name */}
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {getUserName(user)}
        </h3>
        
        {/* User Email */}
        <p className="text-sm text-gray-600 mb-4">
          {getUserEmail(user)}
        </p>
        
        {/* Logout Button */}
        <button 
          onClick={() => {
            handleLogout();
            closePopup();
          }}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

// Mobile user profile section
export const MobileUserSection = ({ user, toggleProfilePopup }) => {
  return (
    <div className="bg-green-100 p-3 rounded-md mb-2 flex items-center space-x-3">
      <UserAvatar user={user} size="md" onClick={toggleProfilePopup} />
      <div>
        <p className="font-bold text-green-800">
          {getUserName(user)}
        </p>
        <button 
          onClick={toggleProfilePopup}
          className="text-sm text-green-600 font-normal"
        >
          View Profile
        </button>
      </div>
    </div>
  );
};