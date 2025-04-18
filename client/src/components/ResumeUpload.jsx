import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [branch, setBranch] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/interview/upload-resume`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSkills(res.data.skills);
      setProjects(res.data.projects);  // Update state to include projects
      setBranch(res.data.branch);
    } catch (error) {
      console.error('Error uploading resume:', error);
    }
  };

  const handleStartInterview = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/interview/start`, { skills, branch });
      navigate('/interview');
    } catch (error) {
      console.error('Error starting interview:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 to-purple-300 p-6 mt-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-purple-600 mb-6">Upload Your Resume</h2>

        <div className="mb-4">
          <label htmlFor="resume" className="block text-lg font-medium mb-2 text-gray-700">
            Choose a Resume File (.pdf, .docx)
          </label>
          <input
            type="file"
            id="resume"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            className="block w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={!file}
          className={`w-full py-3 mt-6 bg-purple-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300 ${!file ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'}`}
        >
          Upload Resume
        </button>

        {skills.length > 0 && (
          <div className="mt-6 p-6 bg-gray-100 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-purple-600 mb-4">Extracted Information</h3>
            <p className="text-lg font-medium mb-2">
              <strong>Skills:</strong> {skills.join(', ')}
            </p>
            <p className="text-lg font-medium mb-2">
              <strong>Projects:</strong> {projects.length > 0 ? projects.join(', ') : 'No projects found'}
            </p>
            <p className="text-lg font-medium mb-4">
              <strong>Inferred Branch:</strong> {branch || 'Unknown'}
            </p>
            <button
              onClick={handleStartInterview}
              className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300 hover:bg-purple-700"
            >
              Start Interview
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeUpload;
