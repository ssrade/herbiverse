import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import box from "../../assets/box.jpg";
import net from "../../assets/net.jpg";
import pot from "../../assets/pot.jpg";
import image1 from "../../assets/image1.png";
import image2 from "../../assets/image2.png";
import image3 from "../../assets/image3.png";
import image4 from "../../assets/image4.png";
import plantImage from "../../assets/AdobeStock_903316550_Preview.png";
import herb from "../../assets/herb.jpg";
import tree from "../../assets/tree.png";

function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentPlantIndex, setCurrentPlantIndex] = useState(0);
  
  const featuredPlants = [
    { img: pot, name: "Lavender", benefits: "Relaxation, Sleep" },
    { img: box, name: "Aloe Vera", benefits: "Skin Care, Healing" },
    { img: net, name: "Mint", benefits: "Digestion, Breath Freshener" },
    { img: box, name: "Chamomile", benefits: "Stress Relief, Sleep" },
    { img: net, name: "Ginger", benefits: "Immunity, Nausea Relief" }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    // Auto slide for featured plants
    const interval = setInterval(() => {
      setCurrentPlantIndex((prevIndex) => 
        prevIndex === featuredPlants.length - 3 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
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

  // Framer motion variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="font-sans bg-gradient-to-b from-green-50 to-white min-h-screen overflow-x-hidden">
      {/* Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center bg-white p-4 shadow-lg fixed top-0 left-0 w-full z-10"
      >
        <h1 className="text-xl font-bold text-emerald-700 flex items-center">
          <span className="text-2xl mr-2">🌿</span> Virtual Herbal Garden
        </h1>
        <ul className="flex space-x-6 font-semibold text-gray-700">
          {["HOME", "HERB CATALOG", "VIRTUAL TOUR", "FAVOURITES", "ABOUT US"].map((item, index) => (
            <li key={index} className="hover:text-emerald-500 cursor-pointer transition-all duration-300 relative group">
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
            </li>
          ))}
        </ul>
        <div className="flex items-center border border-emerald-200 px-3 py-2 rounded-full bg-white shadow-sm hover:shadow transition-all duration-300">
          <input 
            type="text" 
            placeholder="Search herbs..." 
            className="outline-none bg-transparent text-gray-600 w-32 focus:w-40 transition-all duration-300" 
          />
          <button className="ml-2 text-emerald-600 hover:text-emerald-800 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="flex items-center justify-between bg-gradient-to-r from-emerald-50 to-green-100 p-10 pt-24 mt-10 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-1/2 text-left z-10"
        >
          <h1 className="text-5xl font-extrabold text-emerald-700 leading-tight">
            Welcome to <br /> 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-green-500">
              Virtual Herbal Garden
            </span>
          </h1>
          <p className="text-gray-600 mt-4 text-lg max-w-md">
            Explore the World of Medicinal Plants and Unlock Traditional Healing Secrets from Nature's Pharmacy.
          </p>
          <motion.button 
            className="mt-6 bg-gradient-to-r from-emerald-600 to-green-500 text-white px-8 py-3 rounded-full flex items-center shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Exploring <span className="ml-2">→</span>
          </motion.button>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-1/2 flex justify-center relative"
        >
          <motion.div 
            className="absolute w-72 h-72 rounded-full bg-emerald-300 opacity-20 blur-3xl"
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
            className="w-3/4 rounded-lg shadow-xl relative z-10"
            whileHover={{ rotate: -2, scale: 1.03 }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      </section>

      {/* Featured Plants Section */}
      <motion.section 
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="text-center mt-16 px-4"
      >
        <h2 className="text-4xl font-extrabold text-emerald-700 relative inline-block">
          Explore Our Featured Plants
          <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-green-300"></span>
        </h2>
        <p className="text-gray-600 text-lg mt-4">Discover Popular Medicinal Plants and Their Benefits</p>

        <div className="flex justify-center items-center space-x-4 mt-10 relative">
          <motion.button 
            onClick={prevPlant}
            className="text-emerald-700 bg-white p-2 rounded-full shadow-md z-10"
            whileHover={{ scale: 1.1, backgroundColor: "#e6fffa" }}
            whileTap={{ scale: 0.9 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          
          <div className="flex space-x-6 overflow-hidden w-full max-w-3xl">
            <motion.div 
              className="flex space-x-6"
              animate={{ x: -currentPlantIndex * 230 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            >
              {featuredPlants.map((plant, index) => (
                <motion.div 
                  key={index}
                  className="relative bg-white p-6 rounded-xl shadow-lg w-52 flex-shrink-0"
                  whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="relative overflow-hidden rounded-lg mb-4 h-48">
                    <img 
                      src={plant.img} 
                      alt={plant.name} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <p className="text-white p-3 font-medium">{plant.benefits}</p>
                    </div>
                  </div>
                  <h3 className="text-emerald-700 font-bold text-lg mb-1">{plant.name}</h3>
                  <motion.button 
                    className="mt-2 bg-emerald-600 text-white text-xs px-4 py-1.5 rounded-full shadow-md hover:bg-emerald-700 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    VIEW 3D MODEL
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          <motion.button 
            onClick={nextPlant}
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
          {Array.from({ length: featuredPlants.length - 2 }).map((_, index) => (
            <button 
              key={index}
              onClick={() => setCurrentPlantIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentPlantIndex === index ? "bg-emerald-600 w-6" : "bg-emerald-200"
              }`}
            />
          ))}
        </div>
      </motion.section>

      {/* Why Medicinal Plants Section */}
      <motion.section 
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="text-center mt-20 px-4"
      >
        <h2 className="text-4xl font-extrabold text-emerald-700 relative inline-block">
          Why Medicinal Plants?
          <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-green-300"></span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 max-w-5xl mx-auto">
          {[
            { 
              title: "Boost Immunity", 
              desc: "Strengthen your body's natural defenses with herbal remedies that have been used for centuries.", 
              img: image1,
              color: "from-blue-400 to-emerald-400"
            },
            { 
              title: "Natural Remedies", 
              desc: "Discover plant-based solutions for common ailments that work in harmony with your body's systems.", 
              img: image2,
              color: "from-emerald-400 to-green-400"
            },
            { 
              title: "Sustainable Medicine", 
              desc: "Learn how herbal medicine supports eco-friendly, sustainable healthcare practices for our planet.", 
              img: image3,
              color: "from-green-400 to-yellow-400"
            },
            { 
              title: "Holistic Healing", 
              desc: "Experience the power of plants in improving both mental and physical well-being for a balanced life.", 
              img: image4,
              color: "from-yellow-400 to-emerald-400"
            },
          ].map((item, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full"
              whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className={`bg-gradient-to-r ${item.color} p-6 flex items-center justify-center`}>
                <img src={item.img} alt={item.title} className="w-16 h-16 filter drop-shadow-lg" />
              </div>
              <div className="p-6 text-left flex-grow">
                <h3 className="text-xl font-bold text-emerald-700 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
              <div className="px-6 pb-4">
                <motion.button 
                  className="text-emerald-600 font-medium flex items-center hover:text-emerald-800 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  Learn more 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Virtual Garden Tour Section */}
      <motion.section 
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="text-center mt-20 mb-16 px-4"
      >
        <h2 className="text-4xl font-extrabold text-emerald-700 relative inline-block">
          Take a Virtual Garden Tour
          <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-green-300"></span>
        </h2>
        <p className="text-gray-600 text-lg mt-4 max-w-3xl mx-auto">
          Explore a digital garden filled with medicinal plants. Click on plants to learn about their uses, origins, and discover the healing properties that have been used for generations.
        </p>
        
        <div className="relative max-w-4xl mx-auto mt-10 group">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-400 rounded-xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
          
          <motion.div 
            className="relative overflow-hidden rounded-xl shadow-2xl"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <img 
              src={herb} 
              alt="Virtual Garden" 
              className="w-full rounded-xl shadow-xl transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Interactive 3D Garden</h3>
                <p className="mb-4">Navigate through different zones featuring medicinal herbs from around the world</p>
              </div>
            </div>
          </motion.div>
        </div>
        
        <motion.button 
          className="mt-10 bg-gradient-to-r from-emerald-600 to-green-500 text-white px-8 py-3 rounded-full flex items-center mx-auto shadow-xl hover:shadow-2xl transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start 3D Tour <span className="ml-2">→</span>
        </motion.button>
      </motion.section>
      
      <motion.section 
  variants={fadeIn}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.3 }}
  className="bg-gradient-to-r from-emerald-800 to-green-700 text-white py-12 px-4"
>
  <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between">
    <div className="md:w-1/2 mb-6 md:mb-0">
      <h2 className="text-3xl font-bold mb-2">Join Our Herbal Community</h2>
      <p className="text-emerald-100">Get monthly tips, recipes, and updates on medicinal herbs.</p>
    </div>
    <div className="md:w-1/2 flex justify-end items-center space-x-4">
      {/* Subscribe Button */}
      <motion.button 
        className="bg-emerald-500 hover:bg-emerald-400 px-12 py-4 rounded-md font-medium shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Subscribe
      </motion.button>
      {/* Tree Image */}
      <img src={tree} alt="Tree" className="w-24 h-24 object-contain" />
    </div>
  </div>
</motion.section>


      
      {/* Footer */}
      <footer className="bg-gray-50 py-10 px-4 border-t border-gray-200">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-emerald-700 flex items-center">
              <span className="text-2xl mr-2">🌿</span> Virtual Herbal Garden
            </h3>
            <p className="text-gray-600 mt-2">Explore the world of medicinal plants and traditional healing knowledge.</p>
          </div>
          
          {[
            {
              title: "Quick Links",
              links: ["Home", "Herb Catalog", "Virtual Tour", "Favorites", "About Us"]
            },
            {
              title: "Resources",
              links: ["Growing Guides", "Medicinal Uses", "Research Papers", "Herbal Recipes", "Plant Identification"]
            },
            {
              title: "Connect",
              links: ["Contact Us", "FAQ", "Privacy Policy", "Terms of Service", "Subscribe"]
            }
          ].map((section, idx) => (
            <div key={idx}>
              <h3 className="font-semibold text-gray-800 mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a href="#" className="text-gray-600 hover:text-emerald-600 transition-colors duration-300">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Virtual Herbal Garden. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Home;