import React from "react";
import { motion } from "framer-motion"; // For smooth animations

const ISLInfo = () => {
  const features = [
    {
      title: "Real-Time NMF Detection",
      description:
        "Leverage advanced AI to recognize Non-Manual Features (NMFs) like facial expressions and head movements in real-time, ensuring precise and seamless ISL translation into text or speech.",
      video: "https://www.w3schools.com/html/mov_bbb.mp4", // Replace with actual video URL
    },
    {
      title: "Crowd-Sourced Contributions",
      description:
        "Empower users to contribute by uploading ISL gesture videos. This crowd-sourcing initiative builds a diverse dataset, strengthening the system's ability to recognize and translate nuanced NMFs.",
      image: "https://via.placeholder.com/400x300", // Replace with actual image URL
    },
    {
      title: "Accessible and Inclusive Communication",
      description:
        "Break communication barriers by integrating ISL-NMF into applications, ensuring inclusive communication for the hearing-impaired community.",
      image: "https://via.placeholder.com/400x300", // Replace with actual image URL
    },
  ];

  const futureScope = [
    {
      title: "Enhanced Real-Time Translation",
      description:
        "Improve real-time detection models to capture even subtle NMFs like micro-expressions and slight posture shifts.",
      icon: "⚡",
    },
    {
      title: "Open API for Developers",
      description:
        "Offer APIs that developers can use to integrate ISL-NMF detection and translation into their applications.",
      icon: "💻",
    },
    {
      title: "Cross-Language Support",
      description:
        "Expand to support other sign languages worldwide, creating a global platform for sign language understanding.",
      icon: "🌍",
    },
    {
      title: "Mobile Applications",
      description:
        "Launch mobile apps to bring ISL-NMF capabilities to handheld devices, ensuring on-the-go accessibility.",
      icon: "📱",
    },
  ];

  return (
    <section className="bg-gray-100 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h1 className="text-5xl font-extrabold text-center text-blue-600 mb-16">
          About ISL-NMF
        </h1>

        {/* Features Section */}
        <div className="space-y-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col lg:flex-row items-center gap-12 ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div
                className="lg:w-1/2 transform hover:scale-105 transition-transform duration-300"
              >
                {feature.video ? (
                  <video
                    className="rounded-lg shadow-xl"
                    controls
                    src={feature.video}
                  />
                ) : (
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-auto object-cover rounded-lg shadow-xl"
                  />
                )}
              </div>
              <div className="lg:w-1/2">
                <h2 className="text-4xl font-semibold text-gray-800 mb-6">
                  {feature.title}
                </h2>
                <p className="text-lg text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Future Scope Section */}
        <div className="mt-20">
          <h2 className="text-4xl font-bold text-center text-blue-600 mb-12">
            Future Scope
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {futureScope.map((item, index) => (
              <motion.div
                key={index}
                className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center gap-4 hover:shadow-xl hover:scale-105 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-5xl text-blue-500">{item.icon}</div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-lg text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call-to-Action */}
        <div className="mt-20 text-center">
          <h2 className="text-4xl font-semibold text-gray-800 mb-6">
            Join the ISL-NMF Community
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            Contribute videos, explore datasets, and collaborate to refine our
            models. Together, we can advance accessibility and bridge
            communication gaps for the hearing-impaired community.
          </p>
          <a
            href="/contribute"
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-4 px-8 rounded-lg shadow-lg hover:opacity-90 transition-opacity duration-300"
          >
            Start Contributing
          </a>
        </div>
      </div>
    </section>
  );
};

export default ISLInfo;
