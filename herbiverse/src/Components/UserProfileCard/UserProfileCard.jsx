import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, LogOut } from "lucide-react";

const UserProfileCard = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
        Profile
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4"
        >
          <div className="flex flex-col items-center space-y-3">
            <User className="w-10 h-10 text-gray-600" />
            <span className="text-lg font-semibold">{user.name}</span>
            <div className="flex items-center space-x-2 text-gray-600">
              <Mail className="w-5 h-5" />
              <span className="text-sm">{user.email}</span>
            </div>
            <button
              onClick={onLogout}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-lg flex items-center justify-center"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UserProfileCard;
