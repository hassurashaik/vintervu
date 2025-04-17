import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Interview.css';

const Interview = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [responses, setResponses] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [debugMessage, setDebugMessage] = useState('');
  const [isInterviewEnded, setIsInterviewEnded] = useState(false);
  const webcamRef = useRef(null); // Renamed for clarity
  const avatarVideoRef = useRef(null); // For talking/normal video
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = 'en-US';
      recog.maxAlternatives = 1;
      setRecognition(recog);
      setDebugMessage('SpeechRecognition initialized');
    } else {
      setDebugMessage('SpeechRecognition not supported');
      alert('Please use Chrome or Edge for speech recognition');
    }

    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
          setDebugMessage(prev => prev + '; Webcam started');
        }
      } catch (error) {
        console.error('Webcam error:', error);
        setDebugMessage(prev => prev + '; Webcam error: ' + error.message);
      }
    };
    startWebcam();

    fetchNextQuestion();

    return () => {
      if (recognition) recognition.stop();
      stopWebcam();
      if (avatarVideoRef.current) avatarVideoRef.current.pause();
    };
  }, []);

  const stopWebcam = () => {
    if (webcamRef.current && webcamRef.current.srcObject) {
      const tracks = webcamRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      webcamRef.current.srcObject = null;
      setDebugMessage(prev => prev + '; Webcam stopped');
    }
  };

  const fetchNextQuestion = async () => {
    if (isInterviewEnded) return;
    try {
      console.log('Fetching next question');
      setDebugMessage(prev => prev + '; Fetching next question');
      const response = await axios.get('http://localhost:5000/api/interview/next-question', {
        headers: { 'Cache-Control': 'no-cache' }
      });
      console.log('Next question response:', response.data);
      setDebugMessage(prev => prev + '; Next question: ' + JSON.stringify(response.data));
      if (response.data.question) {
        setCurrentQuestion(response.data.question);
        // Play talking video
        if (avatarVideoRef.current) {
          avatarVideoRef.current.src = '/assets/talking.mp4';
          avatarVideoRef.current.loop = false;
          avatarVideoRef.current.play();
        }
      } else {
        setCurrentQuestion(null);
        setDebugMessage(prev => prev + '; No more questions');
        // Switch to normal video
        if (avatarVideoRef.current) {
          avatarVideoRef.current.src = '/assets/normal.mp4';
          avatarVideoRef.current.loop = true;
          avatarVideoRef.current.play();
        }
      }
    } catch (error) {
      console.error('Fetch next question error:', error);
      setDebugMessage(prev => prev + '; Fetch error: ' + error.message);
    }
  };

  const startRecording = async () => {
    if (isInterviewEnded || !recognition) {
      if (!recognition) alert('Speech recognition not supported');
      return;
    }

    // Switch to normal video when recording starts
    if (avatarVideoRef.current) {
      avatarVideoRef.current.src = '/assets/normal.mp4';
      avatarVideoRef.current.loop = true;
      avatarVideoRef.current.play();
    }

    try {
      const permission = await navigator.permissions.query({ name: 'microphone' });
      console.log('Microphone permission:', permission.state);
      setDebugMessage(prev => prev + '; Mic permission: ' + permission.state);
      if (permission.state === 'denied') {
        alert('Microphone access denied. Please enable it in browser settings.');
        return;
      }
    } catch (error) {
      console.error('Permission check error:', error);
      setDebugMessage(prev => prev + '; Permission error: ' + error.message);
    }

    setIsRecording(true);
    setDebugMessage(prev => prev + '; Speak now...');

    recognition.onstart = () => {
      console.log('Recording started');
      setDebugMessage(prev => prev + '; Recording started');
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('Transcribed speech:', transcript);
      setDebugMessage(prev => prev + '; Transcribed: ' + transcript);
      await recordTranscript(transcript);
    };

    recognition.onerror = async (event) => {
      console.error('Speech error:', event.error);
      setDebugMessage(prev => prev + '; Speech error: ' + event.error);
      if (event.error === 'no-speech') {
        setDebugMessage(prev => prev + '; No speech detected. Try speaking louder or longer.');
        await recordTranscript('');
      }
      setIsRecording(false);
    };

    recognition.onend = () => {
      console.log('Recording ended');
      setDebugMessage(prev => prev + '; Recording ended');
      setIsRecording(false);
    };

    try {
      recognition.start();
      console.log('Recognition started');
    } catch (error) {
      console.error('Start recognition error:', error);
      setDebugMessage(prev => prev + '; Start error: ' + error.message);
      setIsRecording(false);
    }
  };

  const recordTranscript = async (transcript) => {
    try {
      const response = await axios.post('http://localhost:5000/api/interview/record-response', {
        audio: transcript || 'No speech detected',
        question: currentQuestion
      });
      console.log('Backend response:', response.data);
      setDebugMessage(prev => prev + '; Backend response: ' + JSON.stringify(response.data));
      setResponses([...responses, { question: currentQuestion, response: response.data.response, score: response.data.score }]);
      setCurrentQuestion(null);
      await fetchNextQuestion();
    } catch (error) {
      console.error('Record response error:', error);
      setDebugMessage(prev => prev + '; Record error: ' + error.message);
    }
  };

  const endInterview = async () => {
    try {
      setDebugMessage(prev => prev + '; Ending interview');
      const response = await axios.post('http://localhost:5000/api/interview/end-interview');
      console.log('End interview response:', response.data);
      setDebugMessage(prev => prev + '; Feedback received');
      setIsInterviewEnded(true);
      stopWebcam();
      if (avatarVideoRef.current) {
        avatarVideoRef.current.pause();
      }
      navigate('/feedback', { state: response.data });
    } catch (error) {
      console.error('End interview error:', error);
      setDebugMessage(prev => prev + '; End interview error: ' + error.message);
    }
  };

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentQuestion, responses]);

  return (
    <div className="interview-container">
      <div className="main-section">
        <div className="webcam-section">
          <video ref={avatarVideoRef} className="avatar-video" muted />
          <video ref={webcamRef} autoPlay className="webcam-feed" />
        </div>
        <div className="chat-section">
          <div className="messages-list">
            {responses.map((res, index) => (
              <div key={index} className="message-group">
                <div className="message question-message">
                  <div className="question-bubble">
                    <strong>Question:</strong> {res.question}
                  </div>
                </div>
                <div className="message answer-message">
                  <div className="answer-bubble">
                    <strong>Answer:</strong> {res.response}
                  </div>
                </div>
              </div>
            ))}
            {currentQuestion && !isInterviewEnded && (
              <div className="message question-message">
                <div className="question-bubble">
                  <strong>Question:</strong> {currentQuestion}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
      <div className="controls">
        <button onClick={startRecording} disabled={isRecording || !currentQuestion || isInterviewEnded}>
          {isRecording ? 'Recording...' : 'Record Response'}
        </button>
        <button onClick={fetchNextQuestion} disabled={isRecording || isInterviewEnded}>
          Next Question
        </button>
        <button onClick={endInterview} disabled={isInterviewEnded}>
          End Interview
        </button>
      </div>
      
    </div>
  );
};

export default Interview;