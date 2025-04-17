/*import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Interview.css';

const Interview = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [responses, setResponses] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isInterviewEnded, setIsInterviewEnded] = useState(false);
  const [debugMessage, setDebugMessage] = useState('');
  const [recognitionIsRunning, setRecognitionIsRunning] = useState(false);

  const webcamRef = useRef(null);
  const avatarVideoRef = useRef(null);
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
    if (webcamRef.current?.srcObject) {
      const tracks = webcamRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      webcamRef.current.srcObject = null;
      setDebugMessage(prev => prev + '; Webcam stopped');
    }
  };

  const switchAvatarVideo = async (filename, loop = true) => {
    if (!avatarVideoRef.current) return;

    const video = avatarVideoRef.current;
    video.pause();
    video.removeAttribute('src');
    video.load();

    video.src = `/assets/${filename}`;
    video.loop = loop;
    video.muted = true;
    video.playsInline = true;
    video.controls = false;

    try {
      await video.play();
      console.log(`▶️ Playing ${filename}`);
    } catch (error) {
      console.warn(`🚫 Video play failed: ${error.message}`);
    }
  };

  const fetchNextQuestion = async () => {
    if (isInterviewEnded) return;
  
    try {
      const response = await axios.get('http://localhost:5000/api/interview/next-question', {
        headers: { 'Cache-Control': 'no-cache' }
      });
  
      const questionText = response.data.question;
  
      if (questionText) {
        setCurrentQuestion(questionText);
  
        setTimeout(async () => {
          // 🔊 Start talking video as speech starts
          await switchAvatarVideo('talking.mp4', true);
  
          const utterance = new SpeechSynthesisUtterance(questionText);
          utterance.lang = 'en-US';
          utterance.rate = 1;
  
          // ⏹️ After speech ends, switch to silent avatar
          utterance.onend = async () => {
            await switchAvatarVideo('normal.mp4', true);
          };
  
          speechSynthesis.speak(utterance);
        }, 200);
      } else {
        // No more questions
        setCurrentQuestion(null);
        await switchAvatarVideo('normal.mp4', true);
      }
    } catch (error) {
      console.error('Fetch question error:', error);
    }
  };
  
  const startRecording = async () => {
    if (isInterviewEnded || !recognition || recognitionIsRunning) {
      if (!recognition) alert('Speech recognition not supported');
      return;
    }
  
    setIsRecording(true);
    setRecognitionIsRunning(true);
  
    recognition.onstart = () => {
      console.log('🎙️ Recording started');
      // 🚫 Do NOT switch video here
    };
  
    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('📝 Transcript:', transcript);
      await recordTranscript(transcript);
    };
  
    recognition.onerror = async (event) => {
      console.error('Speech error:', event.error);
      if (event.error === 'no-speech') {
        await recordTranscript('');
      }
      setIsRecording(false);
      setRecognitionIsRunning(false);
    };
  
    recognition.onend = () => {
      console.log('🛑 Recording ended');
      setIsRecording(false);
      setRecognitionIsRunning(false);
    };
  
    try {
      recognition.start();
    } catch (error) {
      console.error('Recognition start error:', error);
      setIsRecording(false);
      setRecognitionIsRunning(false);
    }
  };
  

  const recordTranscript = async (transcript) => {
    try {
      const response = await axios.post('http://localhost:5000/api/interview/record-response', {
        audio: transcript || 'No speech detected',
        question: currentQuestion
      });
      setResponses([...responses, {
        question: currentQuestion,
        response: response.data.response,
        score: response.data.score
      }]);
      setCurrentQuestion(null);
      await fetchNextQuestion();
    } catch (error) {
      console.error('Record error:', error);
    }
  };

  const endInterview = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/interview/end-interview');
      setIsInterviewEnded(true);
      stopWebcam();
      if (avatarVideoRef.current) avatarVideoRef.current.pause();
      navigate('/feedback', { state: response.data });
    } catch (error) {
      console.error('End interview error:', error);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentQuestion, responses]);

  return (
    <div className="interview-container">
      <div className="main-section">
        <div className="webcam-section">
          <video
            ref={avatarVideoRef}
            className="avatar-video"
            muted
            autoPlay
            playsInline
          />
          <video ref={webcamRef} autoPlay className="webcam-feed" />
        </div>
        <div className="chat-section">
          <div className="messages-list">
            {responses.map((res, index) => (
              <div key={index} className="message-group">
                <div className="message question-message">
                  <div className="question-bubble"><strong>Question:</strong> {res.question}</div>
                </div>
                <div className="message answer-message">
                  <div className="answer-bubble"><strong>Answer:</strong> {res.response}</div>
                </div>
              </div>
            ))}
            {currentQuestion && !isInterviewEnded && (
              <div className="message question-message">
                <div className="question-bubble"><strong>Question:</strong> {currentQuestion}</div>
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

export default Interview;*/

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Interview.css';

const Interview = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [responses, setResponses] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isInterviewEnded, setIsInterviewEnded] = useState(false);
  const [debugMessage, setDebugMessage] = useState('');
  const [recognitionIsRunning, setRecognitionIsRunning] = useState(false);
  const [isFetchingQuestion, setIsFetchingQuestion] = useState(false);

  const webcamRef = useRef(null);
  const avatarVideoRef = useRef(null);
  const messagesEndRef = useRef(null);
  const lastSpokenQuestionRef = useRef(null);
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
    switchAvatarVideo('normal.mp4', true);
    fetchNextQuestion();

    return () => {
      if (recognition) recognition.stop();
      stopWebcam();
      if (avatarVideoRef.current) avatarVideoRef.current.pause();
      speechSynthesis.cancel(); // Cancel any ongoing TTS on unmount
    };
  }, []);

  const stopWebcam = () => {
    if (webcamRef.current?.srcObject) {
      const tracks = webcamRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      webcamRef.current.srcObject = null;
      setDebugMessage(prev => prev + '; Webcam stopped');
    }
  };

  const switchAvatarVideo = async (filename, loop = true) => {
    if (!avatarVideoRef.current) return;

    const video = avatarVideoRef.current;
    video.pause();
    video.removeAttribute('src');
    video.load();

    video.src = `/assets/${filename}`;
    video.loop = loop;
    video.muted = true;
    video.playsInline = true;
    video.controls = false;

    try {
      await video.play();
      console.log(`▶️ Playing ${filename}`);
    } catch (error) {
      console.warn(`🚫 Video play failed: ${error.message}`);
    }
  };

  const fetchNextQuestion = async () => {
    if (isInterviewEnded || isFetchingQuestion) {
      console.log('fetchNextQuestion skipped: interview ended or already fetching');
      return;
    }
  
    setIsFetchingQuestion(true);
    try {
      console.log('Fetching next question...');
      const response = await axios.get('http://localhost:5000/api/interview/next-question', {
        headers: { 'Cache-Control': 'no-cache' }
      });
  
      const questionText = response.data.question;
      console.log('Fetched question:', questionText);
  
      // ✅ Only proceed if it's a new question
      if (questionText && questionText !== lastSpokenQuestionRef.current) {
        setCurrentQuestion(questionText);
        lastSpokenQuestionRef.current = questionText;
  
        // Delay then speak and show talking video
        setTimeout(async () => {
          await switchAvatarVideo('talking.mp4', true);
  
          speechSynthesis.cancel(); // cancel any old speech
          const utterance = new SpeechSynthesisUtterance(questionText);
          utterance.lang = 'en-US';
          utterance.rate = 1;
  
          utterance.onend = async () => {
            await switchAvatarVideo('normal.mp4', true);
          };
  
          speechSynthesis.speak(utterance);
        }, 200);
      } else if (!questionText) {
        console.log('No more questions available');
        setCurrentQuestion(null);
        await switchAvatarVideo('normal.mp4', true);
      } else {
        console.log('Duplicate question, skipping TTS');
      }
    } catch (error) {
      console.error('Fetch question error:', error);
      await switchAvatarVideo('normal.mp4', true);
    } finally {
      setIsFetchingQuestion(false);
    }
  };
  
  const startRecording = async () => {
    if (isInterviewEnded || !recognition || recognitionIsRunning) {
      if (!recognition) alert('Speech recognition not supported');
      return;
    }

    setIsRecording(true);
    setRecognitionIsRunning(true);

    recognition.onstart = () => {
      console.log('🎙️ Recording started');
      switchAvatarVideo('normal.mp4', true);
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('📝 Transcript:', transcript);
      await recordTranscript(transcript);
    };

    recognition.onerror = async (event) => {
      console.error('Speech error:', event.error);
      if (event.error === 'no-speech') {
        await recordTranscript('');
      }
      setIsRecording(false);
      setRecognitionIsRunning(false);
      await switchAvatarVideo('normal.mp4', true);
    };

    recognition.onend = () => {
      console.log('🛑 Recording ended');
      setIsRecording(false);
      setRecognitionIsRunning(false);
      switchAvatarVideo('normal.mp4', true);
    };

    try {
      recognition.start();
    } catch (error) {
      console.error('Recognition start error:', error);
      setIsRecording(false);
      setRecognitionIsRunning(false);
      await switchAvatarVideo('normal.mp4', true);
    }
  };

  const recordTranscript = async (transcript) => {
    try {
      console.log('Recording transcript for question:', currentQuestion);
      const response = await axios.post('http://localhost:5000/api/interview/record-response', {
        audio: transcript || 'No speech detected',
        question: currentQuestion
      });
      setResponses(prev => [...prev, {
        question: currentQuestion,
        response: response.data.response,
        score: response.data.score
      }]);
      setCurrentQuestion(null); // Clear current question immediately
      await fetchNextQuestion();
    } catch (error) {
      console.error('Record error:', error);
      await switchAvatarVideo('normal.mp4', true);
    }
  };

  const endInterview = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/interview/end-interview');
      setIsInterviewEnded(true);
      stopWebcam();
      if (avatarVideoRef.current) avatarVideoRef.current.pause();
      speechSynthesis.cancel();
      navigate('/feedback', { state: response.data });
    } catch (error) {
      console.error('End interview error:', error);
      await switchAvatarVideo('normal.mp4', true);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentQuestion, responses]);

  return (
    <div className="interview-container">
      <div className="main-section">
        <div className="webcam-section">
          <video
            ref={avatarVideoRef}
            className="avatar-video"
            muted
            autoPlay
            playsInline
          />
          <video ref={webcamRef} autoPlay className="webcam-feed" />
        </div>
        <div className="chat-section">
          <div className="messages-list">
            {responses.map((res, index) => (
              <div key={index} className="message-group">
                <div className="message question-message">
                  <div className="question-bubble"><strong>Question:</strong> {res.question}</div>
                </div>
                <div className="message answer-message">
                  <div className="answer-bubble"><strong>Answer:</strong> {res.response}</div>
                </div>
              </div>
            ))}
            {currentQuestion && !isInterviewEnded && (
              <div className="message question-message">
                <div className="question-bubble"><strong>Question:</strong> {currentQuestion}</div>
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
        <button onClick={fetchNextQuestion} disabled={isRecording || isInterviewEnded || isFetchingQuestion}>
          Next Question
        </button>
        <button onClick={endInterview} disabled={isInterviewEnded}>
          End Interview
        </button>
      </div>
      <div className="debug">{debugMessage}</div>
    </div>
  );
};

export default Interview;