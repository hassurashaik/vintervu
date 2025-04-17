import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResumeUpload from './components/ResumeUpload';
import Interview from './components/Interview';
import Feedback from './Feedback';
import Homes from './components/Homes';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homes/>} />
        <Route path="/resume-upload" element={<ResumeUpload />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </Router>
  );
}

export default App;