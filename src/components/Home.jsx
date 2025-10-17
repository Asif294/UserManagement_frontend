import React from "react";

const Home = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col justify-center items-center text-center px-6 pt-24 md:pt-32 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 animate-gradient-x opacity-30"></div>

      {/* Hero Section */}
      <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-4 animate-fade-in">
        Welcome to <span className="text-blue-600">UserManage</span>
      </h1>

      <p className="text-gray-600 text-lg md:text-xl max-w-2xl mb-8 leading-relaxed animate-fade-in delay-300">
        Manage your users, profiles, and dashboards easily with our secure and
        powerful management system. Built for performance, designed for you.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 animate-fade-in delay-500">
        <a
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-transform transform hover:scale-105 font-medium shadow-md"
        >
          Get Started
        </a>
        <a
          href="/"
          className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-transform transform hover:scale-105 font-medium shadow-sm"
        >
          Learn More
        </a>
      </div>

      {/* Illustration */}
      <div className="mt-16 animate-float">
        <img
          src="https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
          alt="User Management Illustration"
          className="w-64 md:w-80 drop-shadow-2xl"
        />
      </div>

      {/* Footer */}
      <footer className="mt-20 text-gray-500 text-sm animate-fade-in delay-700">
        © {new Date().getFullYear()} UserManage. All rights reserved.
      </footer>

      {/* Custom Animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
          }
          .animate-float { animation: float 4s ease-in-out infinite; }

          @keyframes fade-in {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in { animation: fade-in 1s forwards; }
          .animate-fade-in.delay-300 { animation-delay: 0.3s; }
          .animate-fade-in.delay-500 { animation-delay: 0.5s; }
          .animate-fade-in.delay-700 { animation-delay: 0.7s; }

          @keyframes gradient-x {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 15s ease infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Home;
