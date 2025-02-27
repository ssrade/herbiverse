import axios from 'axios';

const getPlantId = async (plantName) => {
  try {
    const response = await axios.get(`/plants/name/${plantName}`);
    return response.data?._id || null; // Assuming the backend returns `_id`
  } catch (error) {
    console.error(`Error fetching plant ID for ${plantName}:`, error);
    return null;
  }
};

export default getPlantId;
