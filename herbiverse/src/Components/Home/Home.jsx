import React from 'react';
import mint from "../../assets/mint.jpg";
import box from "../../assets/box.jpg";
import garden from "../../assets/garden.jpg";
import net from "../../assets/net.jpg";
import pot from "../../assets/pot.jpg";
import image1 from "../../assets/image1.png";
import image2 from "../../assets/image2.png";
import image3 from "../../assets/image3.png";
import image4 from "../../assets/image4.png";
import plantImage from "../../assets/AdobeStock_903316550_Preview.png";

function Home() {
  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-white p-4 shadow-md fixed top-0 left-0 w-full z-10">
        <h1 className="text-xl font-bold text-green-700">Virtual Herbal Garden</h1>
        <ul className="flex space-x-6 font-semibold text-gray-700">
          {["HOME", "HERB CATALOG", "VIRTUAL TOUR", "FAVOURITES", "ABOUT US"].map((item, index) => (
            <li key={index} className="hover:text-green-500 cursor-pointer transition-all duration-300">
              {item}
            </li>
          ))}
        </ul>
        <div className="flex items-center border px-2 py-1 rounded-lg bg-gray-100 shadow-inner">
          <input type="text" placeholder="Search" className="outline-none bg-transparent text-gray-600" />
          <button className="ml-2 hover:text-green-500 transition-all duration-300">🔍</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex items-center justify-between bg-green-100 p-10 mt-16 relative">
        <div className="w-1/2 text-left">
          <h1 className="text-5xl font-extrabold text-green-700 leading-tight">
            Welcome to <br /> Virtual Herbal Garden.
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Explore the World of Medicinal Plants and Unlock Traditional Healing Secrets.
          </p>
          <button className="mt-4 bg-green-700 text-white px-8 py-3 rounded-full flex items-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
            Start Exploring <span className="ml-2">➡</span>
          </button>
        </div>
        <div className="w-1/2 flex justify-center">
          <img src={plantImage} alt="Herbal Plant" className="w-3/4 rounded-lg shadow-xl" />
        </div>
      </section>

      {/* Featured Plants Section */}
      <section className="text-center mt-10">
        <h2 className="text-4xl font-extrabold text-green-700">Explore Our Featured Plants</h2>
        <p className="text-gray-600 text-lg">Discover Popular Medicinal Plants</p>

        <div className="flex justify-center items-center space-x-4 mt-6">
          <button className="text-green-700 text-3xl hover:text-green-500 transition duration-300">⬅</button>
          <div className="flex space-x-6">
            {[pot, box, net].map((img, index) => (
              <div key={index} className="relative bg-white p-6 rounded-lg shadow-lg transform hover:scale-110 transition-all duration-300">
                <img src={img} alt={`Plant ${index + 1}`} className="w-48 h-48 mx-auto rounded-lg object-cover shadow-md" />
                <button className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-3 py-1 rounded-full shadow-md hover:bg-green-700 transition-all duration-300">
                  3D MODEL
                </button>
              </div>
            ))}
          </div>
          <button className="text-green-700 text-3xl hover:text-green-500 transition duration-300">➡</button>
        </div>
      </section>
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

      {/* Virtual Garden Tour Section */}
      <section className="text-center mt-10">
        <h2 className="text-4xl font-extrabold text-green-700">Take a Virtual Garden Tour</h2>
        <p className="text-gray-600 text-lg mt-2">
          Explore a digital garden filled with medicinal plants. Click on plants to learn about their uses, origins, and benefits.
        </p>
        <div className="flex justify-center mt-6">
          <img src={garden} alt="Virtual Garden" className="w-3/4 rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300" />
        </div>
        <button className="mt-6 bg-gradient-to-r from-green-600 to-green-800 text-white px-8 py-3 rounded-full flex items-center mx-auto shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-1">
          Start Exploring <span className="ml-2">➡</span>
        </button>
      </section>
    </div>
  );
}

export default Home;
