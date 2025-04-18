import React, { useState } from "react";
import axios from "axios";

const jobRoles = [
  "data scientist", "machine learning engineer", "ai engineer", "web developer",
  "frontend developer", "backend developer", "full stack developer", "software engineer",
  "data analyst", "devops engineer", "cloud engineer", "mobile app developer",
  "android developer", "ios developer", "ui ux designer", "qa engineer",
  "security analyst", "network engineer", "blockchain developer", "game developer",
  "database administrator",
];

function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError("");
    setShowError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !jobRole) {
      setError("Please select a job role and upload a PDF resume.");
      setShowError(true);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_role", jobRole);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/interview/analyze-resume`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setResult(res.data);
      setError("");
      setShowError(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to connect to the backend!");
      setShowError(true);
    }
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"} min-h-screen flex items-center justify-center text-base`}>
      <div className="w-full max-w-xl p-6 text-center">
        <div className={`rounded-lg p-6 shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold">Resume Analyzer</h3>
            <label className="relative inline-block w-14 h-8">
              <input type="checkbox" className="opacity-0 w-0 h-0" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
              <span className={`absolute inset-0 bg-gray-300 rounded-full flex items-center justify-center text-xs font-semibold transition ${darkMode ? "bg-purple-400 text-white" : "text-gray-800"}`}>
                {darkMode ? "Light" : "Dark"}
              </span>
              <span className="absolute left-1 bottom-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 transform" style={{ transform: darkMode ? "translateX(28px)" : "translateX(0px)" }}></span>
            </label>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4 text-left">
              <label className="block mb-1 font-medium">Select Job Role</label>
              <select
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md text-sm ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
              >
                <option value="">Choose a role</option>
                {jobRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4 text-left">
              <label className="block mb-1 font-medium">Upload Resume (PDF)</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className={`w-full px-3 py-2 border rounded-md text-sm ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
              />
              {file && <small className="text-sm text-gray-500 block mt-1">Selected: {file.name}</small>}
            </div>

            <button type="submit" className="w-full py-3 text-white bg-purple-400 hover:bg-purple-500 rounded-md transition">
              Analyze
            </button>
          </form>

          {showError && (
            <div className={`mt-5 p-4 border rounded-md text-left relative ${darkMode ? "bg-red-800 text-pink-100 border-pink-200" : "bg-red-100 text-red-800 border-red-200"}`}>
              {error}
              <button
                onClick={() => setShowError(false)}
                className="absolute top-1 right-2 text-lg font-bold"
              >
                ×
              </button>
            </div>
          )}

          {result && (
            <div className="mt-6 text-left">
              <h5 className="text-lg font-semibold mb-3">Analysis for: {result.analysis.role}</h5>
              <ul className="mb-4">
                <li className="py-2 border-b border-gray-200 dark:border-gray-700">
                  <strong>Match Score:</strong> {result.analysis.score}%
                </li>
                <li className="py-2 border-b border-gray-200 dark:border-gray-700">
                  <strong>Found Skills:</strong> {result.analysis.found_keywords.join(", ") || "None"}
                </li>
                <li className="py-2 border-b border-gray-200 dark:border-gray-700">
                  <strong>Missing Skills:</strong> {result.analysis.missing_keywords.join(", ") || "None"}
                </li>
              </ul>

              {result.analysis.suggestions?.length > 0 && (
                <div>
                  <strong>Suggestions to Improve:</strong>
                  <ul className="list-disc pl-6 mt-2">
                    {result.analysis.suggestions.map((suggestion, idx) => (
                      <li key={idx}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResumeAnalyzer;
