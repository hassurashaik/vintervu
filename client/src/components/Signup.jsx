import React, { useState } from 'react';
import axios from 'axios';
import bots from "/src/assets/bots.jpg";
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory

const Signup = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/signup', form);
      alert(res.data.message);

      // Redirect to the login page after successful signup using navigate
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <section className="bg-white min-h-screen">
      <div className="lg:grid lg:grid-cols-12 lg:min-h-screen">
        {/* Left Side */}
        <div className="relative bg-gray-900 lg:col-span-6 flex items-end">
          <img
            alt="Signup Background"
            src={bots}
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
          <div className="relative z-10 p-12 text-white max-w-xl">
            <a href="/" className="flex items-center space-x-2 mb-4">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
                alt="Logo"
                className="h-8 w-8"
              />
              <span className="text-xl font-bold">VINTERVU</span>
            </a>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">Prepare smarter with AI-powered mock interviews.✨</h2>
            <p className="text-white/90">Practice real-time with a lifelike avatar and tailored questions. Build confidence, get feedback, and ace your dream job.</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="lg:col-span-6 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-white">
          <div className="max-w-md w-full border rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-semibold mb-4 text-center">Create your account</h2>

            <form onSubmit={handleSignup}>
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="w-full border px-3 py-2 mb-4 rounded"
                value={form.username}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full border px-3 py-2 mb-4 rounded"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full border px-3 py-2 mb-4 rounded"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
              >
                Sign Up →
              </button>
            </form>

            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

            <p className="text-sm text-center mt-4">
              Already have an account?{' '}
              <a href="/login" className="text-purple-600 hover:underline">
                Login
              </a>
            </p>

          
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
