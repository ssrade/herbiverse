import React, { useState, useEffect } from "react";
import HerbCard from '../../Components/Herb/Herbcard';
import plantData from "../Herb/Getplantdata.json";

function Herbcatalog() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredHerbs, setFilteredHerbs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    medicinalUses: [],
    region: [],
    plantType: [],
    cultivationMethod: []
  });

  // Format plant data to match the structure expected by the component
  const formatPlantData = () => {
    // List of all plants that should be displayed
    const allPlants = [
      "aloevera", "amla", "ashwagandha", "cactus", "ceropegiamahabalei", 
      "fennel(saunf)", "ficusginseng", "geraniumflower", "giloy", "ginger", 
      "hibiscus", "iphigeniastellata", "kalmegh", "mimose", "neem", 
      "palmtree", "redpoppy", "shatavari", "thalictrumdalzellii", "tulsi", "turmeric"
    ];
    
    // Use the existing plantData if it matches your requirements,
    // or create data for the plants that need to be displayed
    return allPlants.map(plantName => {
      // Find if the plant exists in the original data
      const existingPlant = plantData.find(p => 
        p.name.toLowerCase() === plantName.toLowerCase() ||
        p.name.toLowerCase().includes(plantName.toLowerCase())
      );
      
      if (existingPlant) {
        return {
          ...existingPlant,
          id: existingPlant.name.toLowerCase().replace(/\s+/g, '_'),
          image: `/images/${existingPlant.name.toLowerCase().replace(/\s+/g, '_')}.jpg`,
          category: getCategoriesForPlant(plantName)
        };
      }
      
      // If the plant doesn't exist in original data, create a basic entry
      return {
        id: plantName.toLowerCase().replace(/\s+/g, '_'),
        name: plantName.charAt(0).toUpperCase() + plantName.slice(1),
        scientificName: "Scientific name",
        description: "A medicinal plant with various health benefits.",
        image: `/images/${plantName.toLowerCase().replace(/\s+/g, '_')}.jpg`,
        careInstructions: "Water regularly and place in partial sunlight.",
        category: getCategoriesForPlant(plantName)
      };
    });
  };

  // Helper function to assign categories to plants
  const getCategoriesForPlant = (plantName) => {
    const plantCategories = [];
    const name = plantName.toLowerCase();
    
    // Digestive Health
    if (["amla", "fennel(saunf)", "ginger", "turmeric", "kalmegh"].includes(name)) {
      plantCategories.push("Digestive Health");
    }
    
    // Skin Care & Beauty
    if (["aloevera", "neem", "geraniumflower", "hibiscus", "turmeric", "cactus"].includes(name)) {
      plantCategories.push("Skin Care & Beauty");
    }
    
    // Immunity Boosting Herbs
    if (["tulsi", "giloy", "ashwagandha", "amla", "turmeric", "neem", "kalmegh", "shatavari"].includes(name)) {
      plantCategories.push("Immunity Boosting Herbs");
    }
    
    // Respiratory Support
    if (["tulsi", "kalmegh", "ginger", "thalictrumdalzellii", "iphigeniastellata"].includes(name)) {
      plantCategories.push("Respiratory Support");
    }
    
    // Stress & Anxiety
    if (["ashwagandha", "tulsi", "hibiscus", "redpoppy", "shatavari", "mimose"].includes(name)) {
      plantCategories.push("Stress & Anxiety");
    }
    
    // Make sure all plants are categorized
    if (plantCategories.length === 0) {
      plantCategories.push("Medicinal Herbs");
    }
    
    return plantCategories;
  };

  const herbsData = formatPlantData();

  // Filter herbs based on selected category and search query
  useEffect(() => {
    let herbsToShow = herbsData;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      herbsToShow = herbsToShow.filter(herb => 
        herb.name.toLowerCase().includes(query) || 
        herb.scientificName.toLowerCase().includes(query) ||
        herb.description.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter
    if (selectedCategory !== "all") {
      herbsToShow = herbsToShow.filter(herb => 
        herb.category.includes(selectedCategory)
      );
    }
    
    setFilteredHerbs(herbsToShow);
  }, [selectedCategory, filters, searchQuery]);

  // Group herbs by category
  const categories = [
    "Digestive Health",
    "Skin Care & Beauty",
    "Immunity Boosting Herbs",
    "Respiratory Support",
    "Stress & Anxiety"
  ];
  
  const herbsByCategory = {};
  
  categories.forEach(category => {
    herbsByCategory[category] = herbsData.filter(herb => 
      herb.category.includes(category)
    );
  });

  return (
    <div className="bg-white fixed overflow-y-auto inset-0 min-h-screen text-center py-12 px-4 font-merriwether">
      {/* Header Section */}
      <div className="flex justify-center items-center">
      <div className="text-center bg-[#FFFAF7] p-6 w-[95vw] flex flex-col items-center mt-[30px] shadow-md rounded-3xl">
        <h1 className="text-3xl font-bold">Herb Catalog</h1>
        <h2 className="text-xl mt-2 font-semibold">
          Explore Nature's Healing Wonders
        </h2>
        <div className="relative w-full max-w-2xl mx-auto mt-4">
          <input
            type="text"
            placeholder="Search for a plant by name or medicinal use"
            className="w-full py-2 pl-4 pr-10 border border-gray-400 rounded-full focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="absolute right-3 top-2.5 text-gray-600">🔍</span>
        </div>
        <p className="mt-4 text-gray-700 max-w-4xl mx-auto">
          Explore medicinal plants with detailed insights, 3D models, and
          natural healing benefits. Search, filter, and discover plants for your
          health needs.
        </p>
      </div>
      </div>

      {/* Main Section with Sidebar and Herbs */}
      <div className="flex flex-row w-full mt-6 px-4 md:px-6 gap-6">
        {/* Sidebar Filters */}
        <div className="bg-[#FFFAF7] shadow-lg rounded-3xl p-6 w-1/4">
          <h3 className="text-lg font-semibold border-b pb-2">Filters</h3>
          <div className="mt-4">
            <h4 className="font-semibold">🌿 Medicinal Uses</h4>
            {["Digestive Health", "Immunity", "Skin Care", "Respiratory Support"].map((use) => (
              <label key={use} className="flex items-center mt-1">
                <input type="checkbox" className="mr-2" /> {use}
              </label>
            ))}
          </div>

          <div className="mt-4">
            <h4 className="font-semibold">📍 Region</h4>
            {["India", "Africa", "Europe", "North America"].map((region) => (
              <label key={region} className="flex items-center mt-1">
                <input type="checkbox" className="mr-2" /> {region}
              </label>
            ))}
          </div>

          <div className="mt-4">
            <h4 className="font-semibold">🌱 Type of Plant</h4>
            {["Herbs", "Shrubs", "Trees", "Climber"].map((type) => (
              <label key={type} className="flex items-center mt-1">
                <input type="checkbox" className="mr-2" /> {type}
              </label>
            ))}
          </div>

          <div className="mt-4">
            <h4 className="font-semibold">Cultivation Method</h4>
            {["Indoor", "Outdoor", "Requires Shade", "Drought Resistant"].map((method) => (
              <label key={method} className="flex items-center mt-1">
                <input type="checkbox" className="mr-2" /> {method}
              </label>
            ))}
          </div>
        </div>

        {/* Herb Categories Section */}
        <div className="w-3/4 flex flex-col gap-6">
          {[
            { title: "Digestive Health", emoji: "🍃" },
            { title: "Skin Care & Beauty", emoji: "🌿" },
            { title: "Immunity Boosting Herbs", emoji: "🛡️" },
            { title: "Respiratory Support", emoji: "🌸" },
            { title: "Stress & Anxiety", emoji: "🌴" },
          ].map((category, index) => (
            <div key={index} className="bg-[#FFFAF7] shadow-lg rounded-3xl p-6">
              <h3 className="text-2xl font-bold flex items-center">
                {category.emoji} {category.title}
              </h3>
              <div className="flex flex-wrap justify-center gap-6 mt-4">
                {herbsByCategory[category.title]?.map((herb) => (
                  <HerbCard key={herb.id} herb={herb} />
                ))}
              </div>

              <button className="block mx-auto mt-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors">
                View All -&gt;
              </button>
            </div>
          ))}
          
          {/* Additional category for remaining plants */}
          <div className="bg-[#FFFAF7] shadow-lg rounded-3xl p-6">
            <h3 className="text-2xl font-bold flex items-center">
              🌱 Other Medicinal Plants
            </h3>
            <div className="flex flex-wrap justify-center gap-6 mt-4">
              {herbsData.filter(herb => 
                !categories.some(category => herb.category.includes(category))
              ).map((herb) => (
                <HerbCard key={herb.id} herb={herb} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Herbcatalog;