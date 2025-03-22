import React from "react";
import UserProfileCard from "./UserProfileCard";

const user = {
  name: "John Doe",
  email: "john@example.com",
};

const handleLogout = () => {
  console.log("User Logged Out");
  // Add your actual logout logic here (e.g., remove token, redirect to login)
};

const Navbar = () => {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-100 shadow-md">
      <h1 className="text-xl font-bold">My Website</h1>
      <UserProfileCard user={user} onLogout={handleLogout} />
    </div>
  );
};

export default Navbar;
