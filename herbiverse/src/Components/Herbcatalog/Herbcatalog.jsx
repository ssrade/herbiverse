import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import HerbCard from "../../Components/Herb/Herbcard";
import plantData from "../Herb/Getplantdata.json";
import { FaLeaf, FaSearch, FaFilter } from "react-icons/fa";

function Herbcatalog() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const allCategories = [
    "All", "Digestive Health", "Skin Care & Beauty", "Immunity Boosting Herbs",
    "Respiratory Support", "Stress & Anxiety", "Rare Botanical Treasure"
  ];

  const navigate = useNavigate();

  // 🏗️ Function to format plant data
  const formatPlantData = () => {
    const allPlants = [
      "aloe vera", "amla", "ashwagandha", "cactus", "ceropegia mahabalei",
      "fennel(saunf)", "ficusginseng", "geranium flower", "giloy", "ginger",
      "hibiscus", "iphigeniastellata", "kalmegh", "mimosa", "neem",
      "palmtree", "redpoppy", "shatavari", "thalictrumdalzellii", "tulsi", "turmeric"
    ];

    return allPlants.map(plantName => {
      const existingPlant = plantData.find(p =>
        p.name.toLowerCase() === plantName.toLowerCase() ||
        p.name.toLowerCase().includes(plantName.toLowerCase())
      );

      return {
        id: plantName.toLowerCase().replace(/\s+/g, '_'),
        name: existingPlant?.name || plantName.charAt(0).toUpperCase() + plantName.slice(1),
        scientificName: existingPlant?.scientificName || getScientificName(plantName),
        description: existingPlant?.description || "A medicinal plant with various health benefits.",
        image: `/images/${plantName.toLowerCase().replace(/\s+/g, '_')}.jpg`,
        careInstructions: existingPlant?.careInstructions || "Water regularly and place in partial sunlight.",
        category: getCategoriesForPlant(plantName)
      };
    });
  };

  // 🌱 Function to get scientific names
  const getScientificName = (plantName) => {
    const scientificNames = {
      "aloe vera": "Aloe barbadensis miller", "amla": "Phyllanthus emblica",
      "ashwagandha": "Withania somnifera", "cactus": "Cactaceae spp.",
      "ceropegiamahabalei": "Ceropegia mahabalei", "fennel(saunf)": "Foeniculum vulgare",
      "ficusginseng": "Ficus microcarpa", "geranium flower": "Pelargonium graveolens",
      "giloy": "Tinospora cordifolia", "ginger": "Zingiber officinale",
      "hibiscus": "Hibiscus rosa-sinensis", "iphigeniastellata": "Iphigenia stellata",
      "kalmegh": "Andrographis paniculata", "mimose": "Mimosa pudica", "neem": "Azadirachta indica",
      "palmtree": "Arecaceae family", "redpoppy": "Papaver rhoeas", "shatavari": "Asparagus racemosus",
      "thalictrumdalzellii": "Thalictrum dalzellii", "tulsi": "Ocimum sanctum", "turmeric": "Curcuma longa"
    };
    return scientificNames[plantName.toLowerCase()] || "Scientific name unavailable";
  };

  // 🏷️ Function to get categories for each plant
  const getCategoriesForPlant = (plantName) => {
    const categories = [];
    const name = plantName.toLowerCase();

    if (["amla", "fennel(saunf)", "ginger", "turmeric", "kalmegh"].includes(name)) categories.push("Digestive Health");
    if (["aloe vera", "neem", "geranium flower", "hibiscus", "turmeric", "cactus"].includes(name)) categories.push("Skin Care & Beauty");
    if (["tulsi", "giloy", "ashwagandha", "amla", "turmeric", "neem", "kalmegh", "shatavari"].includes(name)) categories.push("Immunity Boosting Herbs");
    if (["tulsi", "kalmegh", "ginger", "thalictrumdalzellii", "iphigeniastellata"].includes(name)) categories.push("Respiratory Support");
    if (["ashwagandha", "tulsi", "hibiscus", "redpoppy", "shatavari", "mimosa"].includes(name)) categories.push("Stress & Anxiety");
    if (["ceropegia mahabalei", "ficusginseng", "palmtree"].includes(name)) categories.push("Rare Botanical Treasure");

    if (categories.length === 0) categories.push("Medicinal Herbs");

    return categories;
  };

  const herbsData = formatPlantData();

  // 🔎 Filter herbs based on search & category
  const filteredHerbs = useMemo(() => {
    return herbsData.filter(herb => {
      const matchesSearch = herb.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || herb.category.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [herbsData, searchQuery, selectedCategory]);

  // 📌 Group herbs by category
  const groupedHerbs = useMemo(() => {
    if (selectedCategory !== "All") return { [selectedCategory]: filteredHerbs };

    return filteredHerbs.reduce((acc, herb) => {
      herb.category.forEach(cat => {
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(herb);
      });
      return acc;
    }, {});
  }, [filteredHerbs, selectedCategory]);

  const handleViewDetails = (herb, viewType) => {
    navigate(`/herb/${herb.name.toLowerCase().replace(/\s+/g, '')}`, { state: { herb, viewType } });
  };

  return (
    <div className="bg-gradient-to-b from-[#FFFAF7] to-[#DCFCE7] fixed overflow-y-auto inset-0 min-h-screen text-center py-12 px-4 font-merriwether">
      <div className="flex justify-center items-center">
        <div className="text-center w-[95vw] flex flex-col items-center mt-[30px]">
          <div className="flex items-center justify-center mb-2 mt-5">
            <FaLeaf className="text-[#2D513E] mr-2 text-3xl" />
            <h1 className="text-4xl font-bold text-[#2D513E]">Herb Catalog</h1>
          </div>
          <h2 className="text-xl mt-2 font-semibold text-[#7EA172] italic">
            Nature's Healing Wisdom • Curated Collection
          </h2>

          {/* 🔍 Search & Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-center w-full max-w-2xl mx-auto mt-6 gap-3">
            <input
              type="text"
              placeholder="Search for a herb..."
              className="w-full py-3 pl-5 pr-12 border border-[#7EA172] rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select className="w-full sm:w-56 py-3 px-4 border border-[#7EA172] rounded-full"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}>
              {allCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <p className="mt-6 text-gray-700 max-w-4xl mx-auto leading-relaxed italic text-lg">
        Discover nature's botanical treasures — a premium collection of medicinal plants with detailed profiles,
        healing properties, and cultivation insights for your holistic wellness journey.
      </p>
      <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#7EA172] to-transparent my-8 max-w-6xl mx-auto"></div>

      {/* 🌱 Display Herbs */}
      <div className="mt-6 px-4">
        {Object.entries(groupedHerbs).map(([category, herbs], index, array) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-semibold text-[#2D513E] mb-3">{category} 🌿</h2>
            <div className="flex overflow-x-auto space-x-4 px-4 py-2 scrollbar-hide justify-center">
              {herbs.map(herb => <HerbCard key={herb.id} herb={herb} onViewDetails={handleViewDetails} />)}
            </div>
            {index < array.length - 1 && (
              <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#7EA172] to-transparent my-8 max-w-6xl mx-auto"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Herbcatalog;