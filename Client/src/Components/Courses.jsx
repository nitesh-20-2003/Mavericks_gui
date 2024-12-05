import React, { useState, useEffect } from "react";
import axios from "axios";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5100/api/courses");
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses", error);
      }
    };
    fetchCourses();
  }, []);

  const handleCardClick = (playlistUrl) => {
    window.open(playlistUrl, "_blank");
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-screen-xl mx-auto text-center">
        {/* Top description */}
        <div className="mb-12 text-gray-800">
          <h1 className="text-4xl font-extrabold mb-4">Learn ISL from these Courses</h1>
          <p className="text-lg">
            These carefully curated courses will guide you through the basics of Indian Sign Language (ISL),
            providing you with a deeper understanding of ISL and enabling you to communicate more effectively.
            Start learning and become fluent in ISL with our comprehensive video playlists.
          </p>
        </div>

        {/* Courses Grid */}
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">Explore Our Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              className="course-card bg-white border border-gray-200 rounded-lg shadow-xl transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
              key={course._id}
              onClick={() => handleCardClick(course.playlistUrl)}
            >
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-56 object-cover rounded-t-lg transition-transform duration-300 hover:scale-105"
              />
              <div className="p-6 flex flex-col">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 overflow-hidden text-ellipsis line-clamp-3">
                  {course.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
