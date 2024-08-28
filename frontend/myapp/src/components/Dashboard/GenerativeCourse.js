import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlay, faPause, faMicrophone } from '@fortawesome/free-solid-svg-icons';
import ClipLoader from 'react-spinners/ClipLoader';
import './GenerativeCourse.css';
import video from '../assets/Ai_Teacher.mp4';

const GenerativeCourses = ({ name, navigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [courseContent, setCourseContent] = useState('');
  const [pdfPath, setPdfPath] = useState('');
  const [audioPath, setAudioPath] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAIInteractionActive, setIsAIInteractionActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [responseAudioPath, setResponseAudioPath] = useState('');
  const [isResponsePlaying, setIsResponsePlaying] = useState(false);

  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const goBack = () => {
    navigate('dashboard');
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/generate_course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchTerm }),
      });
      const data = await response.json();
      setCourseContent(data.course_content);
      setPdfPath(data.pdf_path);
      setAudioPath(data.audio_path);
    } catch (error) {
      console.error('Error:', error);
    }
    setIsLoading(false);
  };

  const handleDownload = () => {
    window.open(`http://127.0.0.1:5000/${pdfPath}`, '_blank');
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  const handleAIInteraction = () => {
    setIsAIInteractionActive(!isAIInteractionActive);
  };

  const handleVoiceRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          audioChunksRef.current = [];

          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.wav');

          try {
            const response = await fetch('http://127.0.0.1:5000/convert-voice-to-text', {
              method: 'POST',
              body: formData,
            });

            if (!response.ok) {
              throw new Error(`Server error: ${response.statusText}`);
            }

            const responseBlob = await response.blob();
            const audioURL = URL.createObjectURL(responseBlob);
            setResponseAudioPath(audioURL);

            const transcribedData = await response.json();
            if (transcribedData.error) {
              throw new Error(transcribedData.error);
            }
            setTranscribedText(transcribedData.transcribed_text);

            // Trigger response audio playback
            setIsResponsePlaying(true);
          } catch (error) {
            console.error('Error:', error);
          }
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    }
  };

  useEffect(() => {
    const audioElement = audioRef.current;
    const videoElement = videoRef.current;

    if (audioElement) {
      const handlePlay = () => setIsResponsePlaying(true);
      const handlePause = () => setIsResponsePlaying(false);
      const handleEnded = () => setIsResponsePlaying(false);

      audioElement.addEventListener('play', handlePlay);
      audioElement.addEventListener('pause', handlePause);
      audioElement.addEventListener('ended', handleEnded);

      // Cleanup event listeners on unmount
      return () => {
        audioElement.removeEventListener('play', handlePlay);
        audioElement.removeEventListener('pause', handlePause);
        audioElement.removeEventListener('ended', handleEnded);
      };
    }
  }, [audioRef.current]);

  useEffect(() => {
    if (isAIInteractionActive) {
      videoRef.current?.pause(); // Ensure video is paused initially
    }
  }, [isAIInteractionActive]);

  useEffect(() => {
    if (isResponsePlaying) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  }, [isResponsePlaying]);

  return (
    <div className="courses-container">
      <button onClick={goBack} className="back-button">Back</button>
      <main className="courses-content">
        <header className="dashboard-header">
          <h1>Welcome, {name}!</h1>
          <p>Explore our courses and enhance your skills.</p>
          <div className="search-bar-container">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-bar"
            />
            <button onClick={handleSearch} className="search-button">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </header>

        {isLoading && (
          <div className="loading-section">
            <ClipLoader color="#000" loading={isLoading} size={50} />
            <p>Course generating...please wait (this may take a while)</p>
          </div>
        )}

        {courseContent && (
          <div className="results-section">
            <div className="course-content" dangerouslySetInnerHTML={{ __html: courseContent }} />
            <button onClick={handleDownload} className="download-button">Download PDF</button>
          </div>
        )}
<button onClick={handleAIInteraction} className='aiInteractionButton'>
            {isAIInteractionActive ? 'Stop Interaction' : 'Interaction with AI'}
          </button>
          
        {audioPath && (
          <div className="audio-controls">
            <button onClick={handlePlayPause} className="play-pause-button">
              <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
            </button>
            <p>{isPlaying ? 'Audio playing' : 'Audio paused'}</p>
            <audio ref={audioRef} src={`http://127.0.0.1:5000/${audioPath}`} />
          </div>
        )}

        {/* Video element for AI interaction */}
        {isAIInteractionActive && (
          <div className="ai-interaction-video">
            <video ref={videoRef} src={video} loop className="ai-video" style={{ width: '400px', height: '300px' }} />
            
              <FontAwesomeIcon onClick={handleVoiceRecording} icon={faMicrophone} className={`voice-chat-icon ${isRecording ? 'recording' : ''}`} />
            
            {transcribedText && <p className="transcribed-text">Wait, AI will answer you...</p>}
            {responseAudioPath && (
              <div className="response-audio">
                <audio
                  ref={audioRef}
                  src={responseAudioPath}
                  autoPlay
                  controls={false} // Hides the controls
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default GenerativeCourses;
