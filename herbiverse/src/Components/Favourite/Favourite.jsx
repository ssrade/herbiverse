import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HerbCard from '../../Components/Herb/Herbcard';

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view your favourites');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('http://localhost:8000/api/favourite', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch favourites');
        }

        const data = await response.json();
        console.log('Fetched favorites:', data);
        setFavorites(data);
      } catch (error) {
        console.error('Error fetching favourites:', error);
        setError(error.message || 'Failed to load favourites');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (plantId) => {
    if (!window.confirm('Are you sure you want to remove this plant from favourites?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      console.log(`Removing plantId ${plantId} from favourites`);

      const response = await fetch(`http://localhost:8000/api/favourite/${plantId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to remove from favourites');
      }

      // Remove the favorite from the state
      setFavorites(prevFavorites => prevFavorites.filter(fav => fav.plant._id !== plantId));
    } catch (error) {
      console.error('Error removing from favourites:', error);
      setError(error.message || 'Failed to remove from favourites');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Check if favorites is not an array or null
  if (!favorites || !Array.isArray(favorites)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">My Favourites</h2>
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
          <p>No favourites data available.</p>
          <button 
            className="mt-3 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => navigate('/herbcatalog')}
          >
            Explore Plants
          </button>
        </div>
      </div>
    );
  }

  if (error && favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        {!localStorage.getItem('token') && (
          <div className="mt-4">
            <button 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => navigate('/login')}
            >
              Log In
            </button>
          </div>
        )}
      </div>
    );
  }

  if (favorites.length === 0 && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">My Favourites</h2>
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
          <p>You don't have any favourite plants yet.</p>
          <button 
            className="mt-3 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => navigate('/herbcatalog')}
          >
            Explore Plants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#FFFAF7] to-[#DCFCE7] fixed overflow-y-auto inset-0 min-h-screen text-center py-12 px-4">
      <h2 className="text-3xl font-extrabold text-emerald-800 leading-tight mt-14 mb-6">My Favourites</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="flex flex-wrap gap-6 justify-center">
        {favorites.map((favorite) => {
          // Add null check for the plant
          if (!favorite || !favorite.plant) {
            return null; // Skip this item if favorite or plant is null
          }
          
          const plant = favorite.plant;
          const herbData = {
            id: plant._id,
            name: plant.name,
            scientificName: plant.scientificName,
            image: `/plants/${plant.name.toLowerCase().replace(/\s+/g, '_')}.jpg`
          };
          
          return (
            <div key={favorite._id} className="relative">
              <HerbCard herb={herbData} />
              <button 
                onClick={() => handleRemoveFavorite(plant._id)} 
                className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
                title="Remove from favourites"
              >
                &times;
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Favorites;