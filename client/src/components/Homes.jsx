import { useNavigate } from 'react-router-dom';

function Homes() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>AI Interview Bot</h1>
      <button onClick={() => navigate('/resume-upload')}>Take Test</button>
    </div>
  );
}

export default Homes;