import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    <div>
      <h2>Upload Resume</h2>
      <input type="file" accept=".pdf,.docx" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file}>
        Upload
      </button>
      {skills.length > 0 && (
        <div>
          <p>
            <strong>Extracted Skills:</strong> {skills.join(', ')}
          </p>
          <p>
            <strong>Extracted Projects:</strong> {projects.length > 0 ? projects.join(', ') : 'No projects found'}
          </p>
          <p>
            <strong>Inferred Branch:</strong> {branch || 'Unknown'}
          </p>
          <button onClick={handleStartInterview}>Start Interview</button>
        </div>
      )}
    </div>
  );
}

export default ResumeUpload;
