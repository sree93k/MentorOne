"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CoursesPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("All tutorials");
  const navigate = useNavigate();

  const filters = ["All tutorials", "Paid", "Free", "Packages"];

  const topTutorials = [
    {
      id: 1,
      title: "Namaste JavaScript",
      episodes: 10,
      rating: 4.7,
      views: "5k",
      price: 3400,
      image: "/js-logo.png",
      badge: "JavaScript",
      color: "bg-purple-600",
    },
    {
      id: 2,
      title: "Namaste Node JS",
      episodes: 3,
      season: true,
      rating: 4.7,
      views: "3k",
      price: 3400,
      image: "/node-logo.png",
      badge: "Node Js",
      color: "bg-red-500",
    },
    {
      id: 3,
      title: "Namaste React JS",
      episodes: 21,
      rating: 4.7,
      views: "5k",
      price: 3400,
      image: "/react-logo.png",
      badge: "React JS",
      color: "bg-green-500",
    },
    {
      id: 4,
      title: "Namaste MongoDB",
      episodes: 27,
      rating: 4.7,
      views: "5k",
      price: 3400,
      image: "/mongo-logo.png",
      badge: "Mongo DB",
      color: "bg-yellow-400",
    },
  ];

  const jsTopTutorials = [
    {
      id: 1,
      title: "Namaste JavaScript",
      episodes: 10,
      rating: 4.7,
      views: "5k",
      price: 3400,
      image: "/js-logo.png",
      badge: "JavaScript",
      color: "bg-purple-600",
    },
    {
      id: 5,
      title: "Namaste JavaScript",
      episodes: 10,
      rating: 4.7,
      views: "5k",
      price: 3400,
      image: "/js-logo.png",
      badge: "JavaScript",
      color: "bg-purple-600",
    },
    {
      id: 6,
      title: "Namaste JavaScript",
      episodes: 10,
      rating: 4.7,
      views: "5k",
      price: 3400,
      image: "/js-logo.png",
      badge: "JavaScript",
      color: "bg-purple-600",
    },
    {
      id: 7,
      title: "Namaste JavaScript",
      episodes: 10,
      rating: 4.7,
      views: "5k",
      price: 3400,
      image: "/js-logo.png",
      badge: "JavaScript",
      color: "bg-purple-600",
    },
  ];

  const handleCardClick = (id: number) => {
    navigate(`/seeker/digitalcontent/${id}`);
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <div className="flex-1">
        {/* Main Content */}
        <main className="p-6">
          {/* Filters */}
          <div className="flex gap-4 mb-8  border-b p-2">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                className={`rounded-full ${
                  activeFilter === filter
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </Button>
            ))}
          </div>

          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Top Tutorials</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topTutorials.map((tutorial) => (
                <div
                  key={tutorial.id}
                  className="bg-white rounded-lg overflow-hidden border cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleCardClick(tutorial.id)}
                >
                  <div
                    className={`relative h-40 ${tutorial.color} flex items-center justify-center`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-full opacity-20">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <div
                            key={i}
                            className="absolute rounded-full border border-white opacity-20"
                            style={{
                              width: `${(i + 1) * 40}px`,
                              height: `${(i + 1) * 40}px`,
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                    <div className="z-10 bg-yellow-300 p-4 rounded-lg">
                      <span className="text-3xl font-bold">JS</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="bg-white rounded-full py-1 px-4 shadow text-center mb-2 w-3/4 mx-auto -mt-6 relative z-20">
                      {tutorial.badge}
                    </div>
                    <h3 className="font-bold text-lg">{tutorial.title}</h3>
                    <p className="text-gray-600">
                      {tutorial.season
                        ? `${tutorial.episodes} Season`
                        : `${tutorial.episodes} Episodes`}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className="font-bold text-red-500">
                        {tutorial.rating}
                      </span>
                      <div className="flex ml-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill={i < 4 ? "gold" : "none"}
                            stroke="gold"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M11.0489 3.92705C11.3483 3.00574 12.6517 3.00574 12.9511 3.92705L14.0206 7.21885C14.1545 7.63087 14.5385 7.90983 14.9717 7.90983H18.4329C19.4016 7.90983 19.8044 9.14945 19.0207 9.71885L16.2205 11.7533C15.87 12.0079 15.7234 12.4593 15.8572 12.8713L16.9268 16.1631C17.2261 17.0844 16.1717 17.8506 15.388 17.2812L12.5878 15.2467C12.2373 14.9921 11.7627 14.9921 11.4122 15.2467L8.61204 17.2812C7.82833 17.8506 6.77385 17.0844 7.0732 16.1631L8.14277 12.8713C8.27665 12.4593 8.12999 12.0079 7.7795 11.7533L4.97933 9.71885C4.19562 9.14945 4.59839 7.90983 5.56712 7.90983H9.02832C9.46154 7.90983 9.8455 7.63087 9.97937 7.21885L11.0489 3.92705Z" />
                          </svg>
                        ))}
                        {tutorial.id === 2 && (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="gold"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M11.0489 3.92705C11.3483 3.00574 12.6517 3.00574 12.9511 3.92705L14.0206 7.21885C14.1545 7.63087 14.5385 7.90983 14.9717 7.90983H18.4329C19.4016 7.90983 19.8044 9.14945 19.0207 9.71885L16.2205 11.7533C15.87 12.0079 15.7234 12.4593 15.8572 12.8713L16.9268 16.1631C17.2261 17.0844 16.1717 17.8506 15.388 17.2812L12.5878 15.2467C12.2373 14.9921 11.7627 14.9921 11.4122 15.2467L8.61204 17.2812C7.82833 17.8506 6.77385 17.0844 7.0732 16.1631L8.14277 12.8713C8.27665 12.4593 8.12999 12.0079 7.7795 11.7533L4.97933 9.71885C4.19562 9.14945 4.59839 7.90983 5.56712 7.90983H9.02832C9.46154 7.90983 9.8455 7.63087 9.97937 7.21885L11.0489 3.92705Z" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 6.5C13.1046 6.5 14 5.60457 14 4.5C14 3.39543 13.1046 2.5 12 2.5C10.8954 2.5 10 3.39543 10 4.5C10 5.60457 10.8954 6.5 12 6.5Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 21.5C13.1046 21.5 14 20.6046 14 19.5C14 18.3954 13.1046 17.5 12 17.5C10.8954 17.5 10 18.3954 10 19.5C10 20.6046 10.8954 21.5 12 21.5Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M4.93 10.5C5.48524 11.3967 6.5 12 7.5 12C8.5 12 9.51476 11.3967 10.07 10.5C10.6252 9.60332 10.6252 8.39668 10.07 7.5C9.51476 6.60332 8.5 6 7.5 6C6.5 6 5.48524 6.60332 4.93 7.5C4.37476 8.39668 4.37476 9.60332 4.93 10.5Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M19.07 16.5C19.6252 15.6033 19.6252 14.3967 19.07 13.5C18.5148 12.6033 17.5 12 16.5 12C15.5 12 14.4852 12.6033 13.93 13.5C13.3748 14.3967 13.3748 15.6033 13.93 16.5C14.4852 17.3967 15.5 18 16.5 18C17.5 18 18.5148 17.3967 19.07 16.5Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="ml-1 text-gray-500">
                          {tutorial.views}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-bold">₹ {tutorial.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Top Javascript Tutorials</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {jsTopTutorials.map((tutorial) => (
                <div
                  key={tutorial.id}
                  className="bg-white rounded-lg overflow-hidden border cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleCardClick(tutorial.id)}
                >
                  <div
                    className={`relative h-40 ${tutorial.color} flex items-center justify-center`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-full opacity-20">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <div
                            key={i}
                            className="absolute rounded-full border border-white opacity-20"
                            style={{
                              width: `${(i + 1) * 40}px`,
                              height: `${(i + 1) * 40}px`,
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                    <div className="z-10 bg-yellow-300 p-4 rounded-lg">
                      <span className="text-3xl font-bold">JS</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="bg-white rounded-full py-1 px-4 shadow text-center mb-2 w-3/4 mx-auto -mt-6 relative z-20">
                      {tutorial.badge}
                    </div>
                    <h3 className="font-bold text-lg">{tutorial.title}</h3>
                    <p className="text-gray-600">
                      {tutorial.episodes} Episodes
                    </p>
                    <div className="flex items-center mt-2">
                      <span className="font-bold text-red-500">
                        {tutorial.rating}
                      </span>
                      <div className="flex ml-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill={i < 4 ? "gold" : "none"}
                            stroke="gold"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M11.0489 3.92705C11.3483 3.00574 12.6517 3.00574 12.9511 3.92705L14.0206 7.21885C14.1545 7.63087 14.5385 7.90983 14.9717 7.90983H18.4329C19.4016 7.90983 19.8044 9.14945 19.0207 9.71885L16.2205 11.7533C15.87 12.0079 15.7234 12.4593 15.8572 12.8713L16.9268 16.1631C17.2261 17.0844 16.1717 17.8506 15.388 17.2812L12.5878 15.2467C12.2373 14.9921 11.7627 14.9921 11.4122 15.2467L8.61204 17.2812C7.82833 17.8506 6.77385 17.0844 7.0732 16.1631L8.14277 12.8713C8.27665 12.4593 8.12999 12.0079 7.7795 11.7533L4.97933 9.71885C4.19562 9.14945 4.59839 7.90983 5.56712 7.90983H9.02832C9.46154 7.90983 9.8455 7.63087 9.97937 7.21885L11.0489 3.92705Z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 6.5C13.1046 6.5 14 5.60457 14 4.5C14 3.39543 13.1046 2.5 12 2.5C10.8954 2.5 10 3.39543 10 4.5C10 5.60457 10.8954 6.5 12 6.5Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 21.5C13.1046 21.5 14 20.6046 14 19.5C14 18.3954 13.1046 17.5 12 17.5C10.8954 17.5 10 18.3954 10 19.5C10 20.6046 10.8954 21.5 12 21.5Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M4.93 10.5C5.48524 11.3967 6.5 12 7.5 12C8.5 12 9.51476 11.3967 10.07 10.5C10.6252 9.60332 10.6252 8.39668 10.07 7.5C9.51476 6.60332 8.5 6 7.5 6C6.5 6 5.48524 6.60332 4.93 7.5C4.37476 8.39668 4.37476 9.60332 4.93 10.5Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M19.07 16.5C19.6252 15.6033 19.6252 14.3967 19.07 13.5C18.5148 12.6033 17.5 12 16.5 12C15.5 12 14.4852 12.6033 13.93 13.5C13.3748 14.3967 13.3748 15.6033 13.93 16.5C14.4852 17.3967 15.5 18 16.5 18C17.5 18 18.5148 17.3967 19.07 16.5Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="ml-1 text-gray-500">
                          {tutorial.views}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-bold">₹ {tutorial.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CoursesPage;
