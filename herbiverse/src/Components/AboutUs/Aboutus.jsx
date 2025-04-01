import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, Mail, Github, ArrowRight, User } from 'lucide-react';
import himesh from "/Photos/himesh.jpg"
import aaditya from "/Photos/Aaditya.jpg"
import pritik from "/Photos/pritik.jpg"
import shubham from"/Photos/shubham.jpg"
import amar from"/Photos/amar.jpg"

const AboutUs = () => {
  const [selectedMember, setSelectedMember] = useState(null);

  const teamMembers = [
    {
      id: 1,
      name: 'Himesh Laddha',
      role: 'MERN stack Developer',
      pronouns: 'he/him',
      description: 'Passionate about creating intuitive, accessible web experiences that bridge design and functionality.',
      skills: ['React', 'Javascript', 'Tailwind CSS', 'Node.js', 'Express.js', 'Three.js'],
      photo: himesh,
      linkedin: 'https://www.linkedin.com/in/himesh-laddha-00bb47293/',
      github: 'HimeshLaddha',
      email: 'himeshladdha@gmail.com'
    },
    {
      id: 2,
      name: 'Shubham Rade',
      role: 'Backend Engineer',
      pronouns: 'he/him',
      description: 'Cloud infrastructure expert specializing in scalable, secure system architectures.',
      skills: ['Kubernetes', 'Microservices', 'Cloud Native', 'Security'],
      photo: shubham,
      linkedin: 'https://www.linkedin.com/in/shubham-rade-10646b28a/',
      github: 'ssrade',
      email: 'shubhamrade27@gmail.com'
    },
    {
      id: 3,
      name: 'Aaditya Rasal',
      role: 'Product Manager',
      pronouns: 'he/him',
      description: 'Bridging technology and user needs through strategic product development and user-centric design.',
      skills: ['Product Strategy', 'UX Research', 'Agile Methodologies', 'Customer Empathy'],
      photo: aaditya,
      linkedin: 'https://www.linkedin.com/in/aadityarasal2005/',
      github: 'spirltwirl',
      email: 'rasalaaditya246@gmail.com'
    },
    {
      id: 4,
      name: 'Amar Raykar',
      role: 'UX Designer',
      pronouns: 'he/him',
      description: 'Creating beautiful, intuitive interfaces with a focus on inclusive design principles.',
      skills: ['Figma', 'User Testing', 'Prototyping', 'Illustration'],
      photo: amar,
      linkedin: 'https://www.linkedin.com/in/amar-raykar-40436a28a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
      github: 'Amarraykar07',
      email: 'raykaramar7@gmail.com'
    },
    {
      id: 5,
      name: 'Pritik Nanwani',
      role: 'DevOps Engineer',
      pronouns: 'he/him',
      description: 'Automation enthusiast who builds robust CI/CD pipelines and cloud infrastructure.',
      skills: ['AWS', 'Terraform', 'Docker', 'CI/CD'],
      photo: pritik,
      linkedin: 'https://linkedin.com/in/davidkim',
      github: 'davidkim',
      email: 'david@company.com'
    }
  ];

  const openMemberModal = (member) => {
    setSelectedMember(member);
  };

  const closeMemberModal = () => {
    setSelectedMember(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
            Meet Our Green Team
          </h1>
          <p className="text-xl text-green-600 max-w-2xl mx-auto">
            Sustainable innovators dedicated to eco-friendly technology solutions.
          </p>
        </motion.div>

        {/* Team Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
        >
          {teamMembers.map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all border border-green-100"
            >
              <div className="relative">
                {member.photo ? (
                  <img 
                    src={member.photo} 
                    alt={member.name} 
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="bg-green-100 h-48 flex items-center justify-center">
                    <User className="text-green-500" size={64} />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-900/70 to-transparent p-4 text-white">
                  <h2 className="text-xl font-bold">{member.name}</h2>
                  <p className="text-sm opacity-90">{member.role}</p>
                </div>
              </div>
              
              <div className="p-5">
                <p className="text-green-800 text-sm mb-3 line-clamp-2">{member.description}</p>
                
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {member.skills.map((skill) => (
                    <span 
                      key={skill} 
                      className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <button 
                  onClick={() => openMemberModal(member)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  View Profile
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Member Modal */}
        <AnimatePresence>
          {selectedMember && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              onClick={closeMemberModal}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-xl max-w-2xl w-full p-6 relative border-2 border-green-200"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={closeMemberModal}
                  className="absolute top-3 right-3 text-green-600 hover:text-green-800"
                >
                  ✕
                </button>

                <div className="flex flex-col md:flex-row items-center gap-6">
                  {selectedMember.photo ? (
                    <img 
                      src={selectedMember.photo} 
                      alt={selectedMember.name} 
                      className="w-32 h-32 rounded-full object-cover border-4 border-green-500"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-green-100 flex items-center justify-center">
                      <User className="text-green-500" size={48} />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-green-800">{selectedMember.name}</h2>
                    <p className="text-lg text-green-600 mb-1">{selectedMember.role}</p>
                    <p className="text-green-700 text-sm mb-4">{selectedMember.pronouns}</p>
                    
                    <p className="text-green-800 mb-4">{selectedMember.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedMember.skills.map((skill) => (
                        <span 
                          key={skill} 
                          className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex space-x-4">
                      {selectedMember.linkedin && (
                        <a 
                          href={selectedMember.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800"
                          aria-label={`${selectedMember.name}'s LinkedIn`}
                        >
                          <Linkedin size={20} />
                        </a>
                      )}
                      {selectedMember.github && (
                        <a 
                          href={`https://github.com/${selectedMember.github}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800"
                          aria-label={`${selectedMember.name}'s GitHub`}
                        >
                          <Github size={20} />
                        </a>
                      )}
                      {selectedMember.email && (
                        <a 
                          href={`mailto:${selectedMember.email}`}
                          className="text-green-600 hover:text-green-800"
                          aria-label={`Email ${selectedMember.name}`}
                        >
                          <Mail size={20} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="bg-white rounded-xl shadow-md p-8 max-w-3xl mx-auto border border-green-200">
            <h2 className="text-2xl font-bold text-green-800 mb-3">
              Grow With Our Team
            </h2>
            <p className="text-green-600 mb-5">
              We're cultivating a sustainable future and looking for passionate individuals to join our mission.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white font-medium py-2.5 px-6 rounded-full inline-flex items-center shadow-md hover:shadow-lg transition-all text-sm"
            >
              View Open Positions
              <ArrowRight className="ml-2" size={16} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;