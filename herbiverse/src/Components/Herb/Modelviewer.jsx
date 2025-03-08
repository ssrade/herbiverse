import React, { Suspense, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HerbModel from './HerbModel';

import { 
  isUserLoggedIn, 
  checkFavoriteStatus, 
  addToFavorites, 
  removeFromFavorites,
  fetchNotes,
  addNote,
  updateNote,
  deleteNote
} from '../../services/plantApiService';
import getPlantId from '../../utils/getPlantId';

const ModelViewer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { herb, viewType: initialViewType } = location.state || {};
  
  const userLoggedIn = isUserLoggedIn();
  const [viewType, setViewType] = useState(initialViewType || '3d');

  if (!herb || !herb.name) {
    console.error("Invalid herb data:", herb);
    navigate('/');
    return null;
  }

  // Model paths for different view types
  const modelPath = herb.modelPath || `/models/${herb.name.toLowerCase().replace(/\s+/g, '')}.glb`;
  const imagePath = `/plants/${herb.name.toLowerCase().replace(/\s+/g, '')}.jpg`;

  // State variables for plant and favorites
  const [plantId, setPlantId] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingFavorite, setIsCheckingFavorite] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // State variables for notes
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);
  const [noteError, setNoteError] = useState(null);
  const [noteSuccess, setNoteSuccess] = useState(null);

  // First useEffect: Get plant ID for any view type
  useEffect(() => {
    const getPlantIdentifier = async () => {
      try {
        console.log("Fetching plant ID for:", herb.name);
        const id = await getPlantId(herb.name);
        console.log("Received plant ID:", id);
        
        if (!id) {
          console.error("Could not get valid plant ID");
          return;
        }
        
        setPlantId(id);
      } catch (error) {
        console.error("Error getting plant ID:", error);
        setError("Failed to get plant ID");
      }
    };
    
    getPlantIdentifier();
  }, [herb.name]);

  // Second useEffect: Check favorites status and fetch notes when we have a plant ID
  useEffect(() => {
    const initializeData = async () => {
      console.log(`Current state - plantId: ${plantId}, viewType: ${viewType}, isUserLoggedIn: ${userLoggedIn}`);
      
      if (plantId && userLoggedIn) {
        // Check favorite status for both view types
        console.log("Checking favorite status");
        try {
          setIsCheckingFavorite(true);
          const isFav = await checkFavoriteStatus(plantId);
          setIsFavorite(isFav);
        } catch (error) {
          console.error("Error checking favorite status:", error);
        } finally {
          setIsCheckingFavorite(false);
        }
        
        // Fetch notes for any view type
        console.log("Fetching notes");
        try {
          setIsLoadingNotes(true);
          setNoteError(null);
          const plantNotes = await fetchNotes(plantId);
          setNotes(plantNotes);
        } catch (error) {
          console.error("Error fetching notes:", error);
          setNoteError("Failed to load notes");
        } finally {
          setIsLoadingNotes(false);
        }
      } else {
        console.log("Not initializing data - conditions not met");
      }
    };
    
    initializeData();
  }, [plantId, viewType, userLoggedIn]);

  // Handle adding to favorites
  const handleAddFavorite = async () => {
    if (!userLoggedIn) {
      navigate('/login');
      return;
    }

    if (!plantId) {
      setError("Plant ID not available yet");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await addToFavorites(plantId);
      
      // If the plant was already a favorite
      if (result.alreadyFavorite) {
        setIsFavorite(true);
        setSuccessMessage(result.message);
      } else {
        setIsFavorite(true);
        setSuccessMessage("Added to Favorites");
      }
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error adding to favorites:", error);
      setError(error.message || "Failed to add to favorites");
      
      // If error message indicates it's already a favorite, update state accordingly
      if (error.message && (
          error.message.includes("already in favourites") || 
          error.message.includes("already in favorites"))) {
        setIsFavorite(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle removing from favorites
  const handleRemoveFavorite = async () => {
    if (!userLoggedIn) {
      navigate('/login');
      return;
    }

    if (!plantId) {
      setError("Plant ID not available yet");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await removeFromFavorites(plantId);
      setIsFavorite(false);
      setSuccessMessage("Removed from Favorites");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error removing from favorites:", error);
      setError(error.message || "Failed to remove from favorites");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to add a new note
  const handleAddNote = async (e) => {
    e.preventDefault();
    
    if (!userLoggedIn) {
      navigate('/login');
      return;
    }

    if (!newNote.trim()) {
      setNoteError("Note content cannot be empty");
      return;
    }

    try {
      setIsLoadingNotes(true);
      setNoteError(null);
      setNoteSuccess(null);

      const newNoteData = await addNote(plantId, newNote);
      setNotes(prevNotes => [...prevNotes, newNoteData]);
      setNewNote('');
      setNoteSuccess("Note added successfully");
      setTimeout(() => setNoteSuccess(null), 3000);
    } catch (error) {
      console.error("Error adding note:", error);
      setNoteError(error.message || "Failed to add note");
    } finally {
      setIsLoadingNotes(false);
    }
  };

  // Function to update a note
  const handleUpdateNote = async (noteId) => {
    if (!userLoggedIn) {
      navigate('/login');
      return;
    }

    if (!editedContent.trim()) {
      setNoteError("Note content cannot be empty");
      return;
    }

    try {
      setIsLoadingNotes(true);
      setNoteError(null);
      setNoteSuccess(null);

      const updatedNote = await updateNote(noteId, editedContent);
      
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note._id === noteId ? updatedNote : note
        )
      );
      
      setEditingNote(null);
      setEditedContent('');
      setNoteSuccess("Note updated successfully");
      setTimeout(() => setNoteSuccess(null), 3000);
    } catch (error) {
      console.error("Error updating note:", error);
      setNoteError(error.message || "Failed to update note");
    } finally {
      setIsLoadingNotes(false);
    }
  };

  // Function to delete a note
  const handleDeleteNote = async (noteId) => {
    if (!userLoggedIn) {
      navigate('/login');
      return;
    }

    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      setIsLoadingNotes(true);
      setNoteError(null);
      setNoteSuccess(null);

      await deleteNote(noteId);
      setNotes(prevNotes => prevNotes.filter(note => note._id !== noteId));
      setNoteSuccess("Note deleted successfully");
      setTimeout(() => setNoteSuccess(null), 3000);
    } catch (error) {
      console.error("Error deleting note:", error);
      setNoteError(error.message || "Failed to delete note");
    } finally {
      setIsLoadingNotes(false);
    }
  };

  // Start editing a note
  const startEditingNote = (note) => {
    setEditingNote(note._id);
    setEditedContent(note.content);
  };

  // Cancel editing a note
  const cancelEditingNote = () => {
    setEditingNote(null);
    setEditedContent('');
  };

  // Handle close button click
  const handleClose = () => {
    navigate('/herbcatalog'); // Navigate back to home or previous page
  };

  // Toggle view type
  const toggleViewType = (type) => {
    setViewType(type);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-6">
      <div className="bg-gray-800 bg-opacity-90 rounded-2xl w-full max-w-7xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* View Type Tabs and Close Button */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-600">
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded-t-lg ${viewType === '3d' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
              onClick={() => toggleViewType('3d')}
            >
              3D View
            </button>
            <button
              className={`px-4 py-2 rounded-t-lg ${viewType === '2d' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
              onClick={() => toggleViewType('2d')}
            >
              2D View
            </button>
          </div>
          <button
            className="text-gray-300 hover:text-white bg-red-600 hover:bg-red-700 rounded-full px-4 py-2"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Left: 3D/2D Model */}
          <div className="w-3/5 h-full flex items-center justify-center border-r border-gray-600">
            {viewType === '3d' ? (
              <Suspense fallback={<p className="text-center text-gray-400">Loading 3D Model...</p>}>
                {modelPath ? <HerbModel modelPath={modelPath} is3D={true} /> : <p className="text-red-500">Model not found.</p>}
              </Suspense>
            ) : (
              <div className="flex items-center justify-center h-full w-full">
                <img 
                  src={imagePath} 
                  alt={herb.name} 
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/plants/placeholder.jpg";
                  }}
                />
              </div>
            )}
          </div>

          {/* Right: Herb Information */}
          <div className="w-2/5 p-6 text-white overflow-y-auto">
            <h3 className="text-3xl font-bold mb-4">{herb.name || "Unknown Herb"}</h3>
            <p className="text-gray-300 mb-4"><strong>Scientific Name:</strong> {herb.scientificName || "Not available"}</p>
            
            {/* Display description if available */}
            {herb.description && (
              <p className="text-gray-300 mb-4">{herb.description}</p>
            )}

            {/* Display care instructions if available */}
            {herb.careInstructions && (
              <div className="mb-4">
                <h4 className="text-xl font-semibold mb-2">Care Instructions</h4>
                <p className="text-gray-300">{herb.careInstructions}</p>
              </div>
            )}

            {/* Debug Info */}
            {/* <div className="bg-gray-700 p-2 rounded mb-4 text-xs">
              <p>Plant ID: {plantId || "Loading..."}</p>
              <p>View Type: {viewType}</p>
              <p>Model Path: {viewType === '3d' ? modelPath : imagePath}</p>
              <p>Favorite Status: {isCheckingFavorite ? "Checking..." : (isFavorite ? "In Favorites" : "Not in Favorites")}</p>
              <p>User Logged In: {userLoggedIn ? "Yes" : "No"}</p>
            </div> */}

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-600 text-white p-2 rounded mb-4 text-center">
                {successMessage}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-600 text-white p-2 rounded mb-4 text-center">
                {error}
              </div>
            )}

            {/* Favorite UI for both view types */}
            <>
              {/* Loading Indicator */}
              {isCheckingFavorite && (
                <div className="bg-blue-600 text-white p-2 rounded mb-4 text-center">
                  Checking favorite status...
                </div>
              )}

              {/* Favorite Buttons */}
              {!isCheckingFavorite && (
                <div className="flex flex-col gap-2 mt-4 mb-6">
                  {isFavorite ? (
                    <>
                      <button 
                        className="px-4 py-2 rounded-lg text-white bg-green-500 w-full" 
                        disabled={true}
                      >
                        ✓ Added to Favorites
                      </button>
                      <button 
                        className="px-4 py-2 rounded-lg text-white bg-red-600 w-full"
                        onClick={handleRemoveFavorite}
                        disabled={isLoading}
                      >
                        {isLoading ? "Processing..." : "Remove from Favorites"}
                      </button>
                    </>
                  ) : (
                    <button 
                      className="px-4 py-2 rounded-lg text-white bg-blue-600 w-full"
                      onClick={handleAddFavorite}
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "+ Add to Favorites"}
                    </button>
                  )}
                </div>
              )}
            </>

            {/* Notes Section */}
            <div className="mt-6 border-t border-gray-600 pt-4">
              <h4 className="text-xl font-semibold mb-3">Notes</h4>
              
              {/* Note Error Message */}
              {noteError && (
                <div className="bg-red-600 text-white p-2 rounded mb-4 text-center">
                  {noteError}
                </div>
              )}
              
              {/* Note Success Message */}
              {noteSuccess && (
                <div className="bg-green-600 text-white p-2 rounded mb-4 text-center">
                  {noteSuccess}
                </div>
              )}

              {/* Add Note Form */}
              {userLoggedIn ? (
                <form onSubmit={handleAddNote} className="mb-4">
                  <div className="flex flex-col gap-2">
                    <textarea
                      className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white resize-none"
                      rows="3"
                      placeholder="Add a note about this plant..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      disabled={isLoadingNotes}
                    ></textarea>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                      disabled={isLoadingNotes || !newNote.trim()}
                    >
                      {isLoadingNotes ? "Saving..." : "Add Note"}
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-yellow-400 mb-4">Please log in to add notes</p>
              )}

              {/* Notes List */}
              <div className="space-y-3">
                {isLoadingNotes && notes.length === 0 && (
                  <p className="text-gray-400 text-center py-2">Loading notes...</p>
                )}
                
                {!isLoadingNotes && notes.length === 0 && (
                  <p className="text-gray-400 text-center py-2">No notes yet</p>
                )}
                
                {notes.map(note => (
                  <div key={note._id} className="bg-gray-700 rounded-lg p-3">
                    {editingNote === note._id ? (
                      <div className="space-y-2">
                        <textarea
                          className="w-full px-3 py-2 rounded-lg bg-gray-600 text-white resize-none"
                          rows="3"
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          disabled={isLoadingNotes}
                        ></textarea>
                        <div className="flex gap-2">
                          <button
                            className="px-3 py-1 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 flex-1"
                            onClick={() => handleUpdateNote(note._id)}
                            disabled={isLoadingNotes || !editedContent.trim()}
                          >
                            Save
                          </button>
                          <button
                            className="px-3 py-1 text-sm rounded-lg bg-gray-500 text-white hover:bg-gray-600 flex-1"
                            onClick={cancelEditingNote}
                            disabled={isLoadingNotes}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="mb-2">{note.content}</p>
                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            className="px-2 py-1 text-xs rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                            onClick={() => startEditingNote(note)}
                            disabled={isLoadingNotes}
                          >
                            Edit
                          </button>
                          <button
                            className="px-2 py-1 text-xs rounded-lg bg-red-600 text-white hover:bg-red-700"
                            onClick={() => handleDeleteNote(note._id)}
                            disabled={isLoadingNotes}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelViewer;