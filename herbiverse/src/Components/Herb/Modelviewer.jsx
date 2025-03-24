import React, { Suspense, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HerbModel from './Herbmodel';
import { Star, X, Edit2, Trash2, Save, X as Cancel, Info, BookOpen, Leaf } from 'lucide-react';

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
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [showDescPanel, setShowDescPanel] = useState(true);
  const [activePanelType, setActivePanelType] = useState('description');

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
        setSuccessMessage(result.message || "Already in favorites");
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

  // Set active panel type
  const setActivePanel = (panelType) => {
    setActivePanelType(panelType);
    if (panelType === 'notes') {
      setShowNotesPanel(true);
      setShowDescPanel(false);
    } else {
      setShowNotesPanel(false);
      setShowDescPanel(true);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-6 z-50">
      {/* Semi-transparent background overlay */}
      <div className="absolute inset-0 bg-black/70 z-0"></div>
      
      <div className="relative w-full max-w-[95vw] h-[95vh] flex flex-col z-10 overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-b from-gray-900 to-black border border-green-500/30">
        {/* Top navigation bar with glass effect */}
        <div className="flex justify-between items-center p-4 backdrop-blur-lg bg-black/60 border-b border-green-500/30">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
              {herb.name || "Unknown Herb"}
            </h2>
            
            {/* Favorite Status Badge */}
            {isCheckingFavorite ? (
              <div className="animate-pulse h-8 w-24 rounded-full bg-gray-600"></div>
            ) : (
              <div className="flex items-center">
                <button
                  onClick={isFavorite ? handleRemoveFavorite : handleAddFavorite}
                  disabled={isLoading}
                  className={`flex items-center gap-1.5 py-1 px-3 rounded-full transition-all duration-300 ${
                    isFavorite 
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 hover:from-amber-500 hover:to-yellow-600' 
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
                  }`}
                  title={isFavorite ? "Remove from collection" : "Add to collection"}
                >
                  <Star 
                    size={16} 
                    className={isFavorite ? 'fill-gray-900' : ''} 
                  />
                  {isFavorite ? "In Favourites" : "Add to Collection"}
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            {/* View Toggle */}
            <div className="bg-gray-800/70 backdrop-blur rounded-full p-1 flex">
              <button
                className={`px-4 py-1.5 rounded-full transition-all duration-200 ${
                  viewType === '3d' ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:text-white'
                }`}
                onClick={() => toggleViewType('3d')}
              >
                3D
              </button>
              <button
                className={`px-4 py-1.5 rounded-full transition-all duration-200 ${
                  viewType === '2d' ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:text-white'
                }`}
                onClick={() => toggleViewType('2d')}
              >
                2D
              </button>
            </div>
            
            {/* Close Button */}
            <button
              className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all duration-200"
              onClick={handleClose}
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: 3D/2D Model container */}
          <div className="relative w-3/5 flex items-center justify-center overflow-hidden bg-gradient-to-b from-emerald-900/20 to-green-800/10">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-300/5 rounded-full blur-3xl"></div>
            
            {/* Model showcase container with glass effect */}
            <div className="relative w-full h-full flex items-center justify-center m-6 overflow-hidden">
              {/* Model content */}
              <div className="relative z-20 w-full h-full flex items-center justify-center">
                {viewType === '3d' ? (
                  <Suspense fallback={
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 border-4 border-t-emerald-500 border-emerald-200/30 rounded-full animate-spin"></div>
                      <p className="text-emerald-300 mt-4">Loading 3D Model...</p>
                    </div>
                  }>
                    {modelPath ? <HerbModel modelPath={modelPath} is3D={true} /> : <p className="text-red-500">Model not found.</p>}
                  </Suspense>
                ) : (
                  <div className="flex items-center justify-center h-full w-full p-8">
                    <div className="relative rounded-xl overflow-hidden shadow-2xl transition-all duration-300 transform hover:scale-105 group max-w-lg">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <img 
                        src={imagePath} 
                        alt={herb.name} 
                        className="max-h-full w-auto object-contain rounded-xl"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/plants/placeholder.jpg";
                        }}
                      />
                      <div className="absolute bottom-0 left-0 w-full p-4 text-white z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="text-xl font-semibold">{herb.name}</h3>
                        <p className="text-sm text-gray-200">{herb.scientificName}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right: Information Panel */}
          <div className="w-2/5 flex flex-col bg-gradient-to-b from-green-900/30 to-emerald-800/10 backdrop-blur-sm border-l border-green-500/30">
            {/* Panel Tab Navigation */}
            <div className="flex border-b border-green-500/30">
              <button 
                className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-all duration-200 border-b-2 ${
                  activePanelType === 'description' 
                    ? 'border-green-400 text-green-400' 
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
                onClick={() => setActivePanel('description')}
              >
                <Info size={18} />
                Details
              </button>
              <button 
                className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-all duration-200 border-b-2 ${
                  activePanelType === 'notes' 
                    ? 'border-blue-400 text-blue-400' 
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
                onClick={() => setActivePanel('notes')}
              >
                <BookOpen size={18} />
                My Notes {notes.length > 0 && `(${notes.length})`}
              </button>
            </div>
            
            {/* Panel Content */}
            <div className="flex-1 overflow-auto">
              {/* Description Panel */}
              {showDescPanel && (
                <div className="p-6 text-white">
                  {/* Status Messages */}
                  {successMessage && (
                    <div className="mb-6 bg-green-600/80 text-white p-3 rounded-lg backdrop-blur-sm text-center">
                      {successMessage}
                    </div>
                  )}
                  
                  {error && (
                    <div className="mb-6 bg-red-600/80 text-white p-3 rounded-lg backdrop-blur-sm text-center">
                      {error}
                    </div>
                  )}
                  
                  {/* Featured Image */}
                  <div className="mb-6 bg-black/20 rounded-xl p-4 backdrop-blur-sm">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent flex items-center gap-2 mb-3">
                      <Leaf size={24} className="text-green-400" />
                      Plant Information
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="bg-white/5 rounded-lg p-4 border border-green-500/20">
                        <h4 className="text-sm text-green-300 uppercase tracking-wider mb-1">Scientific Name</h4>
                        <p className="text-gray-200 text-lg font-medium">{herb.scientificName || "Not available"}</p>
                      </div>
                      
                      {herb.description && (
                        <div className="bg-white/5 rounded-lg p-4 border border-green-500/20">
                          <h4 className="text-sm text-green-300 uppercase tracking-wider mb-1">Description</h4>
                          <p className="text-gray-200">{herb.description}</p>
                        </div>
                      )}
                      
                      {herb.careInstructions && (
                        <div className="bg-white/5 rounded-lg p-4 border border-green-500/20">
                          <h4 className="text-sm text-green-300 uppercase tracking-wider mb-1">Care Instructions</h4>
                          <p className="text-gray-200">{herb.careInstructions}</p>
                        </div>
                      )}
                      
                      {herb.usages && (
                        <div className="bg-white/5 rounded-lg p-4 border border-green-500/20">
                          <h4 className="text-sm text-green-300 uppercase tracking-wider mb-1">Common Uses</h4>
                          <p className="text-gray-200">{herb.usages}</p>
                        </div>
                      )}
                      
                      {herb.growingConditions && (
                        <div className="bg-white/5 rounded-lg p-4 border border-green-500/20">
                          <h4 className="text-sm text-green-300 uppercase tracking-wider mb-1">Growing Conditions</h4>
                          <p className="text-gray-200">{herb.growingConditions}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Notes Panel */}
              {showNotesPanel && (
                <div className="p-6 text-white h-full flex flex-col">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-indigo-400 bg-clip-text text-transparent flex items-center gap-2 mb-4">
                    <BookOpen size={24} className="text-blue-400" />
                    My Notes
                  </h3>
                  
                  {/* Note Status Messages */}
                  {noteError && (
                    <div className="mb-4 bg-red-600/80 text-white p-3 rounded-lg backdrop-blur-sm text-center">
                      {noteError}
                    </div>
                  )}
                  
                  {noteSuccess && (
                    <div className="mb-4 bg-green-600/80 text-white p-3 rounded-lg backdrop-blur-sm text-center">
                      {noteSuccess}
                    </div>
                  )}
                  
                  {/* Add Note Form */}
                  {userLoggedIn ? (
                    <form onSubmit={handleAddNote} className="mb-6">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20">
                        <textarea
                          className="w-full px-3 py-2 rounded-lg bg-black/30 text-white border border-blue-500/30 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none resize-none transition-all duration-200"
                          rows="3"
                          placeholder="Add a note about this plant..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          disabled={isLoadingNotes}
                        ></textarea>
                        <button
                          type="submit"
                          className="w-full mt-2 px-4 py-2 rounded-lg text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-2"
                          disabled={isLoadingNotes || !newNote.trim()}
                        >
                          {isLoadingNotes ? "Saving..." : "Add Note"}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="mb-6 bg-yellow-600/40 backdrop-blur-sm text-yellow-200 p-4 rounded-lg flex items-center justify-center">
                      <p>Please log in to add notes</p>
                    </div>
                  )}
                  
                  {/* Notes List */}
                  <div className="flex-1 overflow-auto">
                    <div className="space-y-3">
                      {isLoadingNotes && notes.length === 0 && (
                        <div className="flex justify-center py-6">
                          <div className="w-8 h-8 border-2 border-t-blue-500 border-blue-200/30 rounded-full animate-spin"></div>
                        </div>
                      )}
                      
                      {!isLoadingNotes && notes.length === 0 && (
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg py-8 text-center border border-dashed border-blue-500/20">
                          <p className="text-gray-400">No notes yet. Add your first note above!</p>
                        </div>
                      )}
                      
                      {notes.map(note => (
                        <div key={note._id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20 transition-all duration-200 hover:border-blue-400/30 group">
                          {editingNote === note._id ? (
                            <div className="space-y-3">
                              <textarea
                                className="w-full px-3 py-2 rounded-lg bg-black/30 text-white border border-blue-500/30 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none resize-none transition-all duration-200"
                                rows="3"
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                disabled={isLoadingNotes}
                              ></textarea>
                              <div className="flex gap-2">
                                <button
                                  className="flex items-center justify-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex-1 transition-all duration-200"
                                  onClick={() => handleUpdateNote(note._id)}
                                  disabled={isLoadingNotes || !editedContent.trim()}
                                >
                                  <Save size={16} />
                                  Save
                                </button>
                                <button
                                  className="flex items-center justify-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-gray-600 text-white hover:bg-gray-700 flex-1 transition-all duration-200"
                                  onClick={cancelEditingNote}
                                  disabled={isLoadingNotes}
                                >
                                  <Cancel size={16} />
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="text-gray-200">{note.content}</p>
                              <div className="flex justify-end gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <button
                                  className="flex items-center justify-center gap-1 px-2 py-1 text-xs rounded-lg bg-blue-600/80 text-white hover:bg-blue-700 transition-all duration-200"
                                  onClick={() => startEditingNote(note)}
                                  disabled={isLoadingNotes}
                                >
                                  <Edit2 size={12} />
                                  Edit
                                </button>
                                <button
                                  className="flex items-center justify-center gap-1 px-2 py-1 text-xs rounded-lg bg-red-600/80 text-white hover:bg-red-700 transition-all duration-200"
                                  onClick={() => handleDeleteNote(note._id)}
                                  disabled={isLoadingNotes}
                                >
                                  <Trash2 size={12} />
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelViewer;