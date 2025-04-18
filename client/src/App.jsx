import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Interview from './components/Interview';
import ResumeUpload from './components/ResumeUpload';
import Feedback from './Feedback';
import Header from "./components/Header";
import Home from './components/Home';
import Login from "./components/Login";
import Signup from "./components/Signup";
import Analyze from "./components/ResumeAnalyzer";
import AboutSection from "./components/AboutSection";

const AppWrapper = () => {
  const location = useLocation();
  const hideHeaderRoutes = ['/interview'];

  return (
    <>
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/resume-upload" element={<ResumeUpload />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/AboutSection" element={<AboutSection />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
