import React from "react";
import { FaCopyright, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

// ---------------- HERO SECTION ----------------
const HeroSection = () => {
  const navigate = useNavigate();

  const handleTestNavigation = () => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      navigate('/resume-upload');
    } else {
      navigate('/login');
    }
  };

  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 bg-gradient-to-r from-purple-50 to-white dark:bg-gradient-to-r dark:from-purple-900 dark:to-black">
      <h1 className="text-5xl sm:text-5xl font-bold text-gray-900 mb-6 dark:text-white">
      Practice to Perfection, Speak with Direction.
      </h1>
      <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mb-8 dark:text-gray-300">
      Train with realistic interview scenarios, AI feedback, and tailored guidance to land your dream job.
      </p>
      <button
        onClick={handleTestNavigation}
        className="px-6 py-3 bg-purple-600 text-white text-lg rounded hover:bg-purple-700 transition dark:bg-purple-800 dark:hover:bg-purple-700"
      >
        Take Test
      </button>
    </section>
  );
};


// ---------------- ABOUT SECTION ----------------
const AboutSection = () => (
  <section id="about-us" className="py-20 bg-white px-6 dark:bg-gray-800">
    <div className="max-w-4xl mx-auto text-center">
    <h2 className="text-3xl font-bold text-gray-800 mb-4 dark:text-white">
      About Us
      </h2>
      <p className="text-gray-600 mb-8 dark:text-gray-300">
       is an innovative virtual interview platform designed to help candidates practice and prepare for interviews using AI-driven simulations. Our goal is to provide realistic mock interviews with personalized feedback, empowering users to excel in their job search. Whether you're prepping for a technical, HR, or behavioral interview, VINTERVU offers a dynamic and interactive experience. With cutting-edge technology, we ensure that every practice session enhances confidence and interview readiness. Join us to take your interview preparation to the next level!


      </p>
    </div>
  </section>
);


// ---------------- FOOTER ----------------
const Footer = () => (
  <footer className="bg-white border-t py-6 text-center text-gray-600 text-sm flex flex-col items-center gap-2 dark:bg-gray-800 dark:text-gray-300">
    <div className="flex gap-4 justify-center">
      <a href="https://github.com" target="_blank" rel="noopener noreferrer">
        <FaGithub size={20} />
      </a>
      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
        <FaLinkedin size={20} />
      </a>
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
        <FaTwitter size={20} />
      </a>
    </div>
    <div className="flex items-center gap-1">
      <FaCopyright size={14} />
      <span>2025 VIntervu. All rights reserved.</span>
    </div>
  </footer>
);
// ---------------- CONTACT SECTION ----------------


const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(""); // success | error
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      await axios.post("http://localhost:5000/send-email", formData);
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending message", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-purple-50 px-6 dark:bg-purple-900">
      <div className="max-w-3xl mx-auto text-center">
        <h3 className="text-3xl font-bold text-gray-800 mb-4 dark:text-white">
          Have questions or feedback?
        </h3>
        <p className="text-gray-600 mb-6 dark:text-gray-300">
          We’d love to hear from you! Fill out the form below and we'll get back to you.
        </p>

        <form
          className="max-w-2xl mx-auto bg-white p-6 rounded shadow-lg dark:bg-gray-800"
          onSubmit={handleSubmit}
        >
          {status === "success" && (
            <p className="text-green-600 mb-4">Message sent successfully!</p>
          )}
          {status === "error" && (
            <p className="text-red-600 mb-4">Failed to send message. Try again later.</p>
          )}

          <div className="mb-4">
            <label htmlFor="name" className="block text-lg font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-lg font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="message" className="block text-lg font-medium text-gray-700 dark:text-gray-300">Message</label>
            <textarea
              id="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          <div className="mb-4 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition dark:bg-purple-700 dark:hover:bg-purple-600 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};





// ---------------- HOME PAGE ----------------
const Home = () => {
  return (
    <div className="font-sans dark:bg-gray-900">
      <main className="pt-20"> {/* Padding top to avoid overlap with fixed header */}
        <HeroSection />
        <AboutSection/>
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
