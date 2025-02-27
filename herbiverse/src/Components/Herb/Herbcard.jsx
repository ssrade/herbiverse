import React from "react";
import { useNavigate } from "react-router-dom";

const HerbCard = ({ herb }) => {
  const navigate = useNavigate();

  const openHerbViewer = (viewType) => {
    navigate(`/herb/${herb.name.toLowerCase().replace(/\s+/g, '')}`, { state: { herb, viewType } });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center w-40 h-56 overflow-hidden border border-gray-300">
      <div className="w-32 h-32 rounded-full overflow-hidden">
        <img
          src={`/plants/${herb.name.toLowerCase().replace(/\s+/g, '')}.jpg`}
          alt={herb.name || "Herb"}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = "https://via.placeholder.com/100"; }} // Fallback image
        />
      </div>

      <h3 className="text-sm font-semibold mt-2">{herb.name}</h3>

      <div className="flex flex-col items-center gap-1 mt-2">
        <button 
          className="bg-green-500 text-white text-xs px-3 py-1 rounded-lg w-24 hover:bg-green-600"
          onClick={() => openHerbViewer('3d')}
        >
          View 3D
        </button>
        <button 
          className="bg-blue-500 text-white text-xs px-3 py-1 rounded-lg w-24 hover:bg-blue-600"
          onClick={() => openHerbViewer('2d')}
        >
          View 2D
        </button>
      </div>
    </div>
  );
};

export default HerbCard;
