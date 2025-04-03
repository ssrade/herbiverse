import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NavLink, useNavigate } from "react-router-dom";
import box from "../../assets/box.jpg";
import net from "../../assets/net.jpg";
import pot from "../../assets/pot.jpg";
import image1 from "../../assets/image1.png";
import image2 from "../../assets/image2.png";
import image3 from "../../assets/image3.png";
import image4 from "../../assets/image4.png";
import plantImage from "../../assets/heroimage.png";
import heroBackground from "../../assets/herobackground.png";
import HerbCard from '../../Components/Herb/Herbcard';

function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentPlantIndex, setCurrentPlantIndex] = useState(0);
  const [currentMedicinalPlantIndex, setCurrentMedicinalPlantIndex] = useState(0);
  const navigate = useNavigate();

  const featuredPlants = [
    { img: pot, name: "Lavender", benefits: "Relaxation, Sleep" },
    { img: box, name: "Aloe Vera", benefits: "Skin Care, Healing" },
    { img: net, name: "Mint", benefits: "Digestion, Breath Freshener" },
    { img: box, name: "Chamomile", benefits: "Stress Relief, Sleep" },
    { img: net, name: "Ginger", benefits: "Immunity, Nausea Relief" }
  ];

  const medicinalPlants = [
    { 
      name: "Aloe Vera", 
      scientificName: "Aloe barbadensis miller",
      category: ["skin", "healing"]
    },
    { 
      name: "Ashwagandha", 
      scientificName: "Withania somnifera",
      category: ["stress", "immunity"]
    },
    { 
      name: "Fennel(saunf)", 
      scientificName: "Foeniculum vulgare",
      category: ["digestion", "culinary"]
    },
    { 
      name: "Ginger", 
      scientificName: "Zingiber officinale",
      category: ["immunity", "digestion"]
    },
    { 
      name: "Hibiscus", 
      scientificName: "Hibiscus rosa-sinensis",
      category: ["heart", "skin"]
    },
    { 
      name: "Tulsi", 
      scientificName: "Ocimum sanctum",
      category: ["respiratory", "stress"]
    },
    { 
      name: "Turmeric", 
      scientificName: "Curcuma longa",
      category: ["inflammation", "immunity"]
    }
  ];

  useEffect(() => {
    setIsVisible(true);

    // Auto slide for featured plants
    const featuredInterval = setInterval(() => {
      setCurrentPlantIndex((prevIndex) =>
        prevIndex === featuredPlants.length - 3 ? 0 : prevIndex + 1
      );
    }, 5000);

    // Modified auto slide for medicinal plants with smooth infinite scrolling
    const medicinalPlantsInterval = setInterval(() => {
      setCurrentMedicinalPlantIndex((prevIndex) => {
        // When we reach the last plant, we'll prepare to loop back
        if (prevIndex >= medicinalPlants.length - 1) {
          return 0;
        }
        return prevIndex + 1;
      });
    }, 2000);
    
    return () => {
      clearInterval(featuredInterval);
      clearInterval(medicinalPlantsInterval);
    };
  }, []);

  const nextPlant = () => {
    setCurrentPlantIndex((prevIndex) =>
      prevIndex === featuredPlants.length - 3 ? 0 : prevIndex + 1
    );
  };

  const prevPlant = () => {
    setCurrentPlantIndex((prevIndex) =>
      prevIndex === 0 ? featuredPlants.length - 3 : prevIndex - 1
    );
  };

  const nextMedicinalPlant = () => {
    setCurrentMedicinalPlantIndex((prevIndex) => (prevIndex + 1) % medicinalPlants.length);
  };
  
  const prevMedicinalPlant = () => {
    setCurrentMedicinalPlantIndex((prevIndex) =>
      prevIndex === 0 ? medicinalPlants.length - 1 : prevIndex - 1
    );
  };
  
  // Framer motion variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const formatPlantData = () => {
    // List of all plants that should be displayed
    const allPlants = [
      "aloevera", "ashwagandha", "fennel(saunf)", "ginger", 
      "hibiscus", "tulsi", "turmeric"
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
          category: getCategoriesForPlant(plantName),
          scientificName: existingPlant.scientificName || getScientificName(plantName)
        };
      }
      
      // If the plant doesn't exist in original data, create a basic entry
      return {
        id: plantName.toLowerCase().replace(/\s+/g, '_'),
        name: plantName.charAt(0).toUpperCase() + plantName.slice(1),
        scientificName: getScientificName(plantName),
        description: "A medicinal plant with various health benefits.",
        image: `/images/${plantName.toLowerCase().replace(/\s+/g, '_')}.jpg`,
        careInstructions: "Water regularly and place in partial sunlight.",
        category: getCategoriesForPlant(plantName)
      };
    });
  };

  // Helper function to assign scientific names to plants
  const getScientificName = (plantName) => {
    const scientificNames = {
      "aloevera": "Aloe barbadensis miller",
      "ashwagandha": "Withania somnifera",
      "fennel(saunf)": "Foeniculum vulgare",
      "ginger": "Zingiber officinale",
      "hibiscus": "Hibiscus rosa-sinensis",
      "tulsi": "Ocimum sanctum",
      "turmeric": "Curcuma longa"
    };
    
    return scientificNames[plantName.toLowerCase()] || "Scientific name unavailable";
  };

  // Helper function (you'll need to define this or remove the references)
  const getCategoriesForPlant = (plantName) => {
    const categories = {
      "aloevera": ["skin", "healing"],
      "ashwagandha": ["stress", "immunity"],
      "fennel(saunf)": ["digestion", "culinary"],
      "ginger": ["immunity", "digestion"],
      "hibiscus": ["heart", "skin"],
      "tulsi": ["respiratory", "stress"],
      "turmeric": ["inflammation", "immunity"]
    };
    
    return categories[plantName.toLowerCase()] || ["medicinal"];
  };

  return (
    <div className="bg-gradient-to-b from-[#FFFAF7] to-[#DCFCE7] fixed overflow-y-auto inset-0 min-h-screen text-center py-12 px-4">


      {/* Hero Section */}
      <section className="flex items-center justify-between p-20 pt-24 mt-10 relative overflow-hidden">
        {/* Background image container - positioned absolutely */}
        <div className="absolute left-0 top-0 h-full w-[65%] z-0 overflow-hidden">
          <img 
            src={heroBackground}
            alt="Background"
            className="h-full w-full object-cover object-center"
          />
        </div>
        
        {/* Center Content - Heading, text and button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2 }}
          className="w-[80%] ml-[21%] z-10 text-center"
        >
          <h1 className="text-6xl font-extrabold text-emerald-800 leading-tight">
            Welcome to <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-green-500">
              Virtual Herbal Garden
            </span>
          </h1>
          <p className="text-black mt-4 text-lg mx-auto">
            Explore the World of Medicinal Plants and Unlock Traditional Healing Secrets from Nature's Pharmacy.
          </p>
          
          <motion.button
      className="mt-6 bg-gradient-to-r border-2 from-emerald-600 to-green-500 text-white px-8 py-3 rounded-full flex items-center mx-auto shadow-lg hover:shadow-xl transition-all duration-300" 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate("/Herbcatalog")}
    >
      Start Exploring <span className="ml-2">→</span>
    </motion.button>
    </motion.div>
        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 2, delay: 1 }}
          className="w-[40%] h-full flex justify-end relative"
        >
          <motion.div
            className="absolute w-72 h-72 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 10,
              ease: "easeInOut"
            }}
          />
          <motion.img
            src={plantImage}
            alt="Herbal Plant"
            className="w-[100%] h-full rounded-lg relative z-10"
            whileHover={{ scale: 1.07 }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      </section>

      {/* Plants Collection Section - Added below Hero Section */}
      <motion.section
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="text-center mt-16 px-4"
      >
        <h2 className="text-4xl font-extrabold text-emerald-700 relative inline-block">
          Medicinal Plants Collection
          <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-green-300"></span>
        </h2>
        <p className="text-gray-600 text-lg mt-4">Discover Nature's Healing Wonders</p>

        {/* Plant Slider with Navigation */}
        <div className="flex justify-center items-center space-x-4 mt-10 relative max-w-6xl mx-auto">
          {/* Left Arrow */}
          <motion.button
            onClick={prevMedicinalPlant}
            className="text-emerald-700 bg-white p-2 rounded-full shadow-md z-10"
            whileHover={{ scale: 1.1, backgroundColor: "#e6fffa" }}
            whileTap={{ scale: 0.9 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          {/* Plants Slider Container */}
          <div className="flex space-x-6 overflow-hidden w-full">
            <motion.div
              className="flex space-x-12"
              animate={{ 
                x: -currentMedicinalPlantIndex * 260,
                transition: { 
                  type: "spring", 
                  stiffness: 120, 
                  damping: 20,
                  // Make transition smooth when looping back
                  ...(currentMedicinalPlantIndex === 0 && {
                    type: "tween",
                    duration: 0.5
                  })
                }
              }}
            >
              {/* Duplicate the first few items at the end for seamless looping */}
              {[...medicinalPlants, ...medicinalPlants.slice(0, 3)].map((plant, index) => (
                <motion.div
                  key={`plant-${index}`}
                  className="flex-shrink-0"
                  whileHover={{ y: -10, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <HerbCard herb={plant} />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Arrow */}
          <motion.button
            onClick={nextMedicinalPlant}
            className="text-emerald-700 bg-white p-2 rounded-full shadow-md z-10"
            whileHover={{ scale: 1.1, backgroundColor: "#e6fffa" }}
            whileTap={{ scale: 0.9 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>

        {/* Dots for navigation */}
        <div className="flex justify-center mt-6 space-x-2">
          {medicinalPlants.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentMedicinalPlantIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentMedicinalPlantIndex === index ? "bg-emerald-600 w-6" : "bg-emerald-200"
              }`}
            />
          ))}
        </div>

        {/* View all plants button */}
        <motion.button
          className="mt-10 bg-gradient-to-r from-emerald-600 to-green-500 text-white px-8 py-3 rounded-full flex items-center mx-auto shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/Herbcatalog")}
        >
          View All Plants <span className="ml-2">→</span>
        </motion.button>
      </motion.section>

      <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#7EA172] to-transparent my-8 max-w-6xl mx-auto"></div>

      {/* Why Medicinal Plants Section */}
      <section className="text-center mt-10">
        <h2 className="text-4xl font-extrabold text-green-700">Why Medicinal Plants?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 px-4">
          {[
            {
              title: "Boost Immunity",
              desc: "Strengthen your body's natural defenses with herbal remedies.",
              img: image1
            },
            {
              title: "Natural Remedies",
              desc: "Discover plant-based solutions for common ailments and wellness.",
              img: image2
            },
            {
              title: "Sustainable Medicine",
              desc: "Learn how herbal medicine supports eco-friendly, sustainable healthcare.",
              img: image3
            },
            {
              title: "Holistic Healing",
              desc: "Experience the power of plants in improving mental and physical well-being.",
              img: image4
            },
          ].map((item, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center text-center">
              {/* Small Icon Styling */}
              <img src={item.img} alt={item.title} className="w-12 h-12 mb-3" />
              <h3 className="text-lg font-bold text-green-700">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-600 text-white py-10 mt-16">
        <div className="text-center">
          <p className="text-lg">© 2025 Virtual Herbal Garden</p>
          <p className="mt-2 text-sm">All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;