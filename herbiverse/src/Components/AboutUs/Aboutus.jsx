import React from 'react';
import { Linkedin, Instagram } from 'lucide-react';

const teamMembers = [
  {
    name: "Himesh Laddha",
    image: "https://via.placeholder.com/200",
    description: "Frontend and Backend Developer, 3D modeling-rendering",
    linkedin: "https://linkedin.com/in/johndoe",
    instagram: "https://instagram.com/johndoe"
  },
  {
    name:"Shubham Rade",
    image: "https://via.placeholder.com/200",
    description: "Frontend and Backend Developer, 3D modeling-rendering",
    linkedin: "https://www.linkedin.com/in/shubham-rade-10646b28a/",
    instagram: "https://www.instagram.com/_shubham_r2705/?igsh=MWVmeWdhNjA2N2RkYw%3D%3D#"
  },
  {
    name: "Aaditya Rasal",
    image: "https://via.placeholder.com/200",
    description: "Frontend Developer and 3D modeling-rendering",
    linkedin: "https://linkedin.com/in/mikejohnson",
    instagram: "https://instagram.com/mikejohnson"
  },
  {
    name: "Amar Raykar",
    image: "https://via.placeholder.com/200",
    description: "Frontend Developer and 3D modeling-rendering",
    linkedin: "https://www.linkedin.com/in/amar-raykar-40436a28a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    instagram: "https://www.instagram.com/.amar_raykar.?igsh=NDRhZHBtb2RuYndw"
  },
  {
    name: "Pritik Nanawani",
    image: "https://via.placeholder.com/200",
    description: "Research and Design",
    linkedin: "https://linkedin.com/in/alexrodriguez",
    instagram: "https://instagram.com/alexrodriguez"
  }
];

const Aboutus = () => {
  return (
    <div className="container mx-auto px-4 py-16 bg-gradient-to-br from-green-50 to-green-100">
      <h2 className="text-4xl font-bold text-center mb-12 text-green-900">Our Team</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {teamMembers.map((member, index) => (
          <div 
            key={index} 
            className="relative group"
          >
            <div className="absolute inset-0 bg-green-500 bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-xl transition-all duration-300 group-hover:bg-opacity-20"></div>
            <div 
              className="relative z-10 bg-transparent rounded-2xl overflow-hidden transform transition-transform duration-300 hover:scale-105"
            >
              <div className="relative">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/50 to-transparent"></div>
              </div>
              <div className="p-6 text-center relative z-20">
                <h3 className="text-2xl font-bold mb-2 text-white drop-shadow-md tracking-wide">
                  {member.name}
                </h3>
                <p className="text-green-100 mb-4 text-base font-medium leading-relaxed tracking-tight opacity-90 drop-shadow-sm">
                  {member.description}
                </p>
                <div className="flex justify-center space-x-4">
                  <a 
                    href={member.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-300 hover:text-white transition-colors duration-300 ease-in-out transform hover:scale-110"
                  >
                    <Linkedin size={28} className="drop-shadow-md" />
                  </a>
                  <a 
                    href={member.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-300 hover:text-white transition-colors duration-300 ease-in-out transform hover:scale-110"
                  >
                    <Instagram size={28} className="drop-shadow-md" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Aboutus;