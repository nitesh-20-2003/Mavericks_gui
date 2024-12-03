import { div } from "framer-motion/client";
import React from "react";



const NmfHeaders = () => {
    
  // Example categories (replace with your actual categories)
  const categories = [
    'All',
    'Happy',
    'Sad',
    'Asking',
    'Laugh',
    'Cry',
    'Angry',
  ];

  return (
    <div className="w-[90vw] max-w-[1120px] mx-auto py-8 border-b border-base-300">
      {/* Header */}
      <div className="flex text-center justify-center mb-6">
        <h1 className="font-greatVibes text-zinc-700">Non-Manual Features</h1>
      </div>

      {/* Buttons Grid */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((category, index) => (
          <button className="btn btn-outline" key={index}>
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NmfHeaders;

  
