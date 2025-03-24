// import React, { useState, useEffect, useMemo } from "react";
// import HerbCard from '../../Components/Herb/Herbcard';
// import plantData from "../Herb/Getplantdata.json";

// import { FaChevronLeft, FaChevronRight, FaFilter, FaLeaf, FaSearch } from 'react-icons/fa';

// function Herbcatalog() {
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [filteredHerbs, setFilteredHerbs] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showFilters, setShowFilters] = useState(false);
//   const [filters, setFilters] = useState({
//     medicinalUses: [],
//   });

//   // Format plant data to match the structure expected by the component
//   const formatPlantData = () => {
//     // List of all plants that should be displayed
//     const allPlants = [
//       "aloevera", "amla", "ashwagandha", "cactus", "ceropegiamahabalei", 
//       "fennel(saunf)", "ficusginseng", "geraniumflower", "giloy", "ginger", 
//       "hibiscus", "iphigeniastellata", "kalmegh", "mimose", "neem", 
//       "palmtree", "redpoppy", "shatavari", "thalictrumdalzellii", "tulsi", "turmeric"
//     ];

//     // Use the existing plantData if it matches your requirements,
//     // or create data for the plants that need to be displayed
//     return allPlants.map(plantName => {
//       // Find if the plant exists in the original data
//       const existingPlant = plantData.find(p => 
//         p.name.toLowerCase() === plantName.toLowerCase() ||
//         p.name.toLowerCase().includes(plantName.toLowerCase())
//       );

//       if (existingPlant) {
//         return {
//           ...existingPlant,
//           id: existingPlant.name.toLowerCase().replace(/\s+/g, '_'),
//           image: `/images/${existingPlant.name.toLowerCase().replace(/\s+/g, '_')}.jpg`,
//           category: getCategoriesForPlant(plantName),
//           scientificName: existingPlant.scientificName || getScientificName(plantName)
//         };
//       }

//       // If the plant doesn't exist in original data, create a basic entry
//       return {
//         id: plantName.toLowerCase().replace(/\s+/g, '_'),
//         name: plantName.charAt(0).toUpperCase() + plantName.slice(1),
//         scientificName: getScientificName(plantName),
//         description: "A medicinal plant with various health benefits.",
//         image: `/images/${plantName.toLowerCase().replace(/\s+/g, '_')}.jpg`,
//         careInstructions: "Water regularly and place in partial sunlight.",
//         category: getCategoriesForPlant(plantName)
//       };
//     });
//   };

//   // Helper function to assign scientific names to plants
//   const getScientificName = (plantName) => {
//     const scientificNames = {
//       "aloevera": "Aloe barbadensis miller",
//       "amla": "Phyllanthus emblica",
//       "ashwagandha": "Withania somnifera",
//       "cactus": "Cactaceae spp.",
//       "ceropegiamahabalei": "Ceropegia mahabalei",
//       "fennel(saunf)": "Foeniculum vulgare",
//       "ficusginseng": "Ficus microcarpa",
//       "geraniumflower": "Pelargonium graveolens",
//       "giloy": "Tinospora cordifolia",
//       "ginger": "Zingiber officinale",
//       "hibiscus": "Hibiscus rosa-sinensis",
//       "iphigeniastellata": "Iphigenia stellata",
//       "kalmegh": "Andrographis paniculata",
//       "mimose": "Mimosa pudica",
//       "neem": "Azadirachta indica",
//       "palmtree": "Arecaceae family",
//       "redpoppy": "Papaver rhoeas",
//       "shatavari": "Asparagus racemosus",
//       "thalictrumdalzellii": "Thalictrum dalzellii",
//       "tulsi": "Ocimum sanctum",
//       "turmeric": "Curcuma longa"
//     };

//     return scientificNames[plantName.toLowerCase()] || "Scientific name unavailable";
//   };

//   // Helper function to assign categories to plants
//   const getCategoriesForPlant = (plantName) => {
//     const plantCategories = [];
//     const name = plantName.toLowerCase();

//     // Digestive Health
//     if (["amla", "fennel(saunf)", "ginger", "turmeric", "kalmegh"].includes(name)) {
//       plantCategories.push("Digestive Health");
//     }

//     // Skin Care & Beauty
//     if (["aloevera", "neem", "geraniumflower", "hibiscus", "turmeric", "cactus"].includes(name)) {
//       plantCategories.push("Skin Care & Beauty");
//     }

//     // Immunity Boosting Herbs
//     if (["tulsi", "giloy", "ashwagandha", "amla", "turmeric", "neem", "kalmegh", "shatavari"].includes(name)) {
//       plantCategories.push("Immunity Boosting Herbs");
//     }

//     // Respiratory Support
//     if (["tulsi", "kalmegh", "ginger", "thalictrumdalzellii", "iphigeniastellata"].includes(name)) {
//       plantCategories.push("Respiratory Support");
//     }

//     // Stress & Anxiety
//     if (["ashwagandha", "tulsi", "hibiscus", "redpoppy", "shatavari", "mimose"].includes(name)) {
//       plantCategories.push("Stress & Anxiety");
//     }

//     // Make sure all plants are categorized
//     if (plantCategories.length === 0) {
//       plantCategories.push("Medicinal Herbs");
//     }

//     return plantCategories;
//   };

//   const herbsData = formatPlantData();

//   // Filter herbs based on selected category and search query
//   useEffect(() => {
//     let herbsToShow = herbsData;

//     // Apply search filter
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       herbsToShow = herbsToShow.filter(herb => 
//         herb.name.toLowerCase().includes(query) || 
//         herb.scientificName.toLowerCase().includes(query) ||
//         herb.description.toLowerCase().includes(query)
//       );
//     }

//     // Apply category filter
//     if (selectedCategory !== "all") {
//       herbsToShow = herbsToShow.filter(herb => 
//         herb.category.includes(selectedCategory)
//       );
//     }

//     setFilteredHerbs(herbsToShow);
//   }, [selectedCategory, filters, searchQuery]);

//   // Group herbs by category
//   const categories = [
//     "Digestive Health",
//     "Skin Care & Beauty",
//     "Immunity Boosting Herbs",
//     "Respiratory Support",
//     "Stress & Anxiety"
//   ];

//   const herbsByCategory = {};

//   categories.forEach(category => {
//     herbsByCategory[category] = herbsData.filter(herb => 
//       herb.category.includes(category)
//     );
//   });

//   // Horizontal scroll handler for plant cards
//   const scrollCategory = (categoryId, direction) => {
//     const container = document.getElementById(`category-container-${categoryId}`);
//     if (container) {
//       const scrollAmount = direction === 'left' ? -300 : 300;
//       container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
//     }
//   };

//   const toggleFilters = () => {
//     setShowFilters(!showFilters);
//   };

//   // Custom color theme for premium look
//   const theme = {
//     primary: "#2D513E",         // Deep forest green
//     secondary: "#7EA172",       // Sage green
//     accent: "#F0B67F",          // Warm amber
//     light: "#F8F4E3",           // Cream/parchment
//     dark: "#1A2F24"             // Very dark green
//   };

//   const filtered = useMemo(() => {
//     return herbsData.filter(herb =>
//       herb.name.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   }, [herbsData, searchQuery]);

//   return (
//     <div className="bg-gradient-to-b from-[#FFFAF7] to-[#DCFCE7] fixed overflow-y-auto inset-0 min-h-screen text-center py-12 px-4 font-merriwether">
//       {/* Header Section */}
//       <div className="flex justify-center items-center">
//         <div className="text-center w-[95vw] flex flex-col items-center mt-[30px]">
//           <div className="flex items-center justify-center mb-2 mt-5">
//             <FaLeaf className="text-[#2D513E] mr-2 text-3xl" />
//             <h1 className="text-4xl font-bold text-[#2D513E]">Herb Catalog</h1>
//           </div>
//           <h2 className="text-xl mt-2 font-semibold text-[#7EA172] italic">
//             Nature's Healing Wisdom • Curated Collection
//           </h2>
//           <div className="relative w-full max-w-2xl mx-auto mt-6">
//             <input
//               type="text"
//               placeholder="Search for a plant by name"
//               className="w-full py-3 pl-5 pr-12 border border-[#7EA172] rounded-full focus:outline-none focus:ring-2 focus:ring-[#2D513E] focus:border-transparent text-[#1A2F24]"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             /> 
//             <FaSearch className="absolute right-4 top-3.5 text-[#7EA172] text-xl" />
//             <span className="absolute right-4 top-3.5 text-[#7EA172]">
//               {/* <FaSearch className="text-xl" /> */}
//             </span>
//           </div>

//           <p className="mt-6 text-gray-700 max-w-4xl mx-auto leading-relaxed italic text-lg">
//             Discover nature's botanical treasures — a premium collection of medicinal plants with detailed profiles, 
//             healing properties, and cultivation insights for your holistic wellness journey.
//           </p>
//         </div>
//       </div>

//       {/* Decorative horizontal divider */}
//       <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#7EA172] to-transparent my-8 max-w-6xl mx-auto"></div>

//       {/* Main Section with Sidebar and Herbs */}
//       <div className="flex w-full mt-6 px-4 md:px-6 relative">
//         {/* Filter Button - not fixed and hidden when filter is shown */}
//         {!showFilters && (
//           <div className="absolute top-0 left-0 z-20">
//             <button 
//               onClick={toggleFilters} 
//               className="bg-[#2D513E] text-white p-3 pl-4 pr-5 rounded-r-lg shadow-lg flex items-center transition-all hover:bg-[#1A2F24]"
//             >
//               <FaFilter />
//               <span className="ml-2 font-medium">Filter</span>
//             </button>
//           </div>
//         )}

//         {/* Sliding Filter Panel */}
//         <div 
//           className={`absolute top-0 bottom-0 w-72 bg-[#F8F4E3] shadow-xl z-10 overflow-y-auto transition-all duration-300 rounded-r-2xl border-r border-t border-b border-[#7EA172] border-opacity-20 ${
//             showFilters ? 'left-0' : '-left-72'
//           }`}
//         >
//           <div className="p-8 pt-10">
//             <div className="flex justify-between items-center border-b border-[#7EA172] border-opacity-30 pb-4">
//               <h3 className="text-xl font-semibold text-[#2D513E] flex items-center">
//                 <FaFilter className="mr-2" /> Filter Collection
//               </h3>
//               <button 
//                 onClick={toggleFilters} 
//                 className="text-[#7EA172] hover:text-[#2D513E] transition-colors text-xl"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="mt-6">
//               <h4 className="font-semibold text-[#2D513E] flex items-center text-lg">
//                 <span className="mr-2">🌿</span> Medicinal Benefits
//               </h4>
//               {["Digestive Health", "Immunity", "Skin Care", "Respiratory Support"].map((use) => (
//                 <label key={use} className="flex items-center mt-3 text-[#1A2F24] cursor-pointer group transition-all">
//                   <input type="checkbox" className="mr-3 accent-[#7EA172]" /> 
//                   <span className="group-hover:text-[#2D513E]">{use}</span>
//                 </label>
//               ))}
//             </div>

//             {/* <div className="mt-8">
//               <h4 className="font-semibold text-[#2D513E] flex items-center text-lg">
//                 <span className="mr-2">📍</span> Origin Region
//               </h4>
//               {["India", "Africa", "Europe", "North America"].map((region) => (
//                 <label key={region} className="flex items-center mt-3 text-[#1A2F24] cursor-pointer group transition-all">
//                   <input type="checkbox" className="mr-3 accent-[#7EA172]" /> 
//                   <span className="group-hover:text-[#2D513E]">{region}</span>
//                 </label>
//               ))}
//             </div> */}

//             {/* <div className="mt-8">
//               <h4 className="font-semibold text-[#2D513E] flex items-center text-lg">
//                 <span className="mr-2">🌱</span> Plant Category
//               </h4>
//               {["Herbs", "Shrubs", "Trees", "Climbers"].map((type) => (
//                 <label key={type} className="flex items-center mt-3 text-[#1A2F24] cursor-pointer group transition-all">
//                   <input type="checkbox" className="mr-3 accent-[#7EA172]" /> 
//                   <span className="group-hover:text-[#2D513E]">{type}</span>
//                 </label>
//               ))}
//             </div> */}

//             {/* <div className="mt-8">
//               <h4 className="font-semibold text-[#2D513E] flex items-center text-lg">
//                 <span className="mr-2">☀️</span> Growing Conditions
//               </h4>
//               {["Indoor", "Outdoor", "Shade-loving", "Drought Resistant"].map((method) => (
//                 <label key={method} className="flex items-center mt-3 text-[#1A2F24] cursor-pointer group transition-all">
//                   <input type="checkbox" className="mr-3 accent-[#7EA172]" /> 
//                   <span className="group-hover:text-[#2D513E]">{method}</span>
//                 </label>
//               ))}
//             </div> */}

//             <div className="mt-8 flex justify-center">
//               <button 
//                 className="bg-[#2D513E] text-white px-6 py-3 rounded-full shadow-md hover:bg-[#1A2F24] transition-colors font-medium flex items-center"
//               >
//                 <span>Apply Selections</span>
//                 <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Main Content - Adjusts based on filter panel state */}
//         <div 
//           className={`w-full flex flex-col gap-0 transition-all duration-300 ${
//             showFilters ? 'ml-72' : 'ml-0'
//           }`}
//         >
//           {[
//             { title: "Digestive Health", emoji: "🍃", id: "digestive", description: "Plants that soothe and support optimal digestive function" },
//             { title: "Skin Care & Beauty", emoji: "🌿", id: "skincare", description: "Natural botanical treasures for radiant, healthy skin" },
//             { title: "Immunity Boosting Herbs", emoji: "🛡️", id: "immunity", description: "Strengthen natural defenses with these powerful herbs" },
//             { title: "Respiratory Support", emoji: "🌸", id: "respiratory", description: "Breathe freely with these respiratory-enhancing plants" },
//             { title: "Stress & Anxiety", emoji: "🌴", id: "stress", description: "Find calm and balance with these gentle nervines" },
//           ].map((category, index) => (
//             <div key={index} className="py-8">
//               <h3 className="text-2xl font-bold flex items-center justify-center text-[#2D513E] mb-2">
//                 {category.emoji} {category.title}
//               </h3>
//               <p className="text-[#7EA172] italic mb-6 text-center">{category.description}</p>
//               <div className="relative">
//                 <button 
//                   className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-md z-10 hover:bg-[#F0B67F] transition-colors text-[#2D513E]"
//                   onClick={() => scrollCategory(category.id, 'left')}
//                 >
//                   <FaChevronLeft className="text-current" />
//                 </button>

//                 <div 
//                   id={`category-container-${category.id}`}
//                   className="flex overflow-x-auto py-4 px-10 hide-scrollbar"
//                   style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//                 >
//                   <div className="flex gap-8 mx-auto justify-center">
//                     {herbsByCategory[category.title]?.map((herb) => (
//                       <HerbCard key={herb.id} herb={{...herb, scientificName: herb.scientificName}} />
//                     ))}
//                   </div>
//                 </div>

//                 <button 
//                   className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-md z-10 hover:bg-[#F0B67F] transition-colors text-[#2D513E]"
//                   onClick={() => scrollCategory(category.id, 'right')}
//                 >
//                   <FaChevronRight className="text-current" />
//                 </button>
//               </div>

//               <button className="block mx-auto mt-6 bg-[#7EA172] text-white px-6 py-2 rounded-full hover:bg-[#2D513E] transition-colors font-medium shadow-sm">
//                 View All {category.title} Herbs
//               </button>

//               {/* Horizontal divider after each section */}
//               <div className="w-full h-[1px] bg-[#7EA172] opacity-50 mt-8"></div>
//             </div>
//           ))}

//           {/* Additional category for remaining plants */}
//           <div className="py-8">
//             <h3 className="text-2xl font-bold flex items-center justify-center text-[#2D513E] mb-2">
//               🌱 Rare Botanical Treasures
//             </h3>
//             <p className="text-[#7EA172] italic mb-6 text-center">Discover unique and specialized medicinal plants with extraordinary properties</p>
//             <div className="relative">
//               <button 
//                 className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-md z-10 hover:bg-[#F0B67F] transition-colors text-[#2D513E]"
//                 onClick={() => scrollCategory('other', 'left')}
//               >
//                 <FaChevronLeft className="text-current" />
//               </button>

//               <div 
//                 id="category-container-other"
//                 className="flex overflow-x-auto py-4 px-10 hide-scrollbar"
//                 style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//               >
//                 <div className="flex gap-8 mx-auto justify-center">
//                   {herbsData.filter(herb => 
//                     !categories.some(category => herb.category.includes(category))
//                   ).map((herb) => (
//                     <HerbCard key={herb.id} herb={{...herb, scientificName: herb.scientificName}} />
//                   ))}
//                 </div>
//               </div>

//               <button 
//                 className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-md z-10 hover:bg-[#F0B67F] transition-colors text-[#2D513E]"
//                 onClick={() => scrollCategory('other', 'right')}
//               >
//                 <FaChevronRight className="text-current" />
//               </button>
//             </div>

//             <button className="block mx-auto mt-6 bg-[#7EA172] text-white px-6 py-2 rounded-full hover:bg-[#2D513E] transition-colors font-medium shadow-sm">
//               Explore Rare Specimens
//             </button>

//             {/* Final horizontal divider */}
//             <div className="w-full h-[1px] bg-[#7EA172] opacity-50 mt-8"></div>
//           </div>
//         </div>
//       </div>

//       {/* Add some custom styles for hiding scrollbars */}
//       <style jsx="true">{`
//         .hide-scrollbar::-webkit-scrollbar {
//           display: none;
//         }

//         /* Additional custom styles for premium look */
//         body {
//           font-family: 'Merriweather', serif;
//         }

//         /* Subtle animations */
//         button {
//           transition: all 0.2s ease;
//         }

//         button:hover {
//           transform: translateY(-2px);
//         }

//         /* Custom highlight style */
//         ::selection {
//           background-color: rgba(126, 161, 114, 0.3);
//           color: #2D513E;
//         }
//       `}</style>
//     </div>
//   );
// }

// export default Herbcatalog;

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
    if (["aloevera", "neem", "geraniumflower", "hibiscus", "turmeric", "cactus"].includes(name)) categories.push("Skin Care & Beauty");
    if (["tulsi", "giloy", "ashwagandha", "amla", "turmeric", "neem", "kalmegh", "shatavari"].includes(name)) categories.push("Immunity Boosting Herbs");
    if (["tulsi", "kalmegh", "ginger", "thalictrumdalzellii", "iphigeniastellata"].includes(name)) categories.push("Respiratory Support");
    if (["ashwagandha", "tulsi", "hibiscus", "redpoppy", "shatavari", "mimosa"].includes(name)) categories.push("Stress & Anxiety");
    if (["ceropegiamahabalei", "ficusginseng", "palmtree"].includes(name)) categories.push("Rare Botanical Treasure");

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
