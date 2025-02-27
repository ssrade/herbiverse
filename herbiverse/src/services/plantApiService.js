// src/services/plantApiService.js

/**
 * Service for handling plant-related API operations
 */

const API_BASE_URL = "http://localhost:8000/api";

// Helper function to get the auth token
const getAuthToken = () => localStorage.getItem("token");

// Helper to check if user is logged in
export const isUserLoggedIn = () => !!getAuthToken();

/**
 * Check if a plant is in user's favorites
 * @param {string} plantId - The ID of the plant to check
 * @returns {Promise<boolean>} - Whether the plant is in favorites
 */
export const checkFavoriteStatus = async (plantId) => {
  if (!plantId || !isUserLoggedIn()) {
    console.log("Cannot check favorite: No plant ID or user not logged in");
    return false;
  }

  try {
    const token = getAuthToken();
    console.log(`Checking favorite status for plant ${plantId} with token ${token?.substring(0, 10)}...`);

    const response = await fetch(`${API_BASE_URL}/favourite/${plantId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Cache-Control": "no-cache"
      }
    });

    if (!response.ok) {
      throw new Error("Failed to check favorite status");
    }

    const data = await response.json();
    console.log("Favorite status response:", data);

    return data.isFavourite;
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return false;
  }
};

/**
 * Add a plant to user's favorites
 * @param {string} plantId - The ID of the plant to add
 * @returns {Promise<Object>} - Response data
 */
export const addToFavorites = async (plantId) => {
  if (!plantId || !isUserLoggedIn()) {
    throw new Error("Cannot add to favorites: No plant ID or user not logged in");
  }

  try {
    const token = getAuthToken();
    console.log(`Adding plantId ${plantId} to favorites`);

    const response = await fetch(`${API_BASE_URL}/favourite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ plantId })
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      // For "already in favorites" error, handle specially
      if (response.status === 409 || 
          responseData.error?.includes("already in favourites") || 
          responseData.message?.includes("already")) {
        return { alreadyFavorite: true, message: "Plant is already in your favorites" };
      }
      throw new Error(responseData.error || responseData.message || "Failed to add to favorites");
    }

    return { success: true, message: "Added to Favorites" };
  } catch (error) {
    console.error("Error adding to favorites:", error);
    throw error;
  }
};

/**
 * Remove a plant from user's favorites
 * @param {string} plantId - The ID of the plant to remove
 * @returns {Promise<Object>} - Response data
 */
export const removeFromFavorites = async (plantId) => {
  if (!plantId || !isUserLoggedIn()) {
    throw new Error("Cannot remove from favorites: No plant ID or user not logged in");
  }

  try {
    const token = getAuthToken();
    console.log(`Removing plantId ${plantId} from favorites`);

    const response = await fetch(`${API_BASE_URL}/favourite/${plantId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || "Failed to remove from favorites");
    }

    return { success: true, message: "Removed from Favorites" };
  } catch (error) {
    console.error("Error removing from favorites:", error);
    throw error;
  }
};

/**
 * Fetch notes for a specific plant
 * @param {string} plantId - The ID of the plant
 * @returns {Promise<Array>} - Array of notes
 */
export const fetchNotes = async (plantId) => {
  if (!plantId || !isUserLoggedIn()) {
    console.log("Cannot fetch notes: No plant ID or user not logged in");
    return [];
  }

  try {
    const token = getAuthToken();
    console.log(`Fetching notes for plant ${plantId}`);

    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Cache-Control": "no-cache"
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch notes");
    }

    const allNotes = await response.json();
    console.log("All notes:", allNotes);

    // Filter notes for the specific plant
    const plantNotes = allNotes.filter(note => 
      note.plant && (
        (typeof note.plant === 'string' && note.plant === plantId) || 
        (typeof note.plant === 'object' && note.plant._id === plantId)
      )
    );

    console.log("Notes for this plant:", plantNotes);
    return plantNotes;
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }
};

/**
 * Add a new note for a plant
 * @param {string} plantId - The ID of the plant
 * @param {string} content - The note content
 * @returns {Promise<Object>} - The created note
 */
export const addNote = async (plantId, content) => {
  if (!plantId || !isUserLoggedIn()) {
    throw new Error("Cannot add note: No plant ID or user not logged in");
  }

  if (!content.trim()) {
    throw new Error("Note content cannot be empty");
  }

  try {
    const token = getAuthToken();
    console.log(`Adding note for plant ${plantId}: ${content}`);

    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ 
        plantId, 
        content 
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || "Failed to add note");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding note:", error);
    throw error;
  }
};

/**
 * Update an existing note
 * @param {string} noteId - The ID of the note
 * @param {string} content - The updated content
 * @returns {Promise<Object>} - The updated note
 */
export const updateNote = async (noteId, content) => {
  if (!isUserLoggedIn()) {
    throw new Error("Cannot update note: User not logged in");
  }

  if (!content.trim()) {
    throw new Error("Note content cannot be empty");
  }

  try {
    const token = getAuthToken();
    console.log(`Updating note ${noteId}: ${content}`);

    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || "Failed to update note");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating note:", error);
    throw error;
  }
};

/**
 * Delete a note
 * @param {string} noteId - The ID of the note
 * @returns {Promise<boolean>} - Success status
 */
export const deleteNote = async (noteId) => {
  if (!isUserLoggedIn()) {
    throw new Error("Cannot delete note: User not logged in");
  }

  try {
    const token = getAuthToken();
    console.log(`Deleting note ${noteId}`);

    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || "Failed to delete note");
    }

    return true;
  } catch (error) {
    console.error("Error deleting note:", error);
    throw error;
  }
};