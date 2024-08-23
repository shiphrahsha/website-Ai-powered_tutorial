// // import React, { useState } from 'react';
// // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // import { faSearch } from '@fortawesome/free-solid-svg-icons';
// // import ClipLoader from 'react-spinners/ClipLoader';
// // import './GenerativeCourse.css';

// // const GenerativeCourses = ({ name, navigate }) => {
// //   const goBack = () => {
// //     navigate('dashboard');
// //   };

// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [courseContent, setCourseContent] = useState('');
// //   const [pdfPath, setPdfPath] = useState('');
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [videoUrl, setVideoUrl] = useState('');

// //   const handleSearch = async () => {
// //     setIsLoading(true);
// //     try {
// //       const response = await fetch('http://127.0.0.1:5000/generate_course', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json'
// //         },
// //         body: JSON.stringify({ searchTerm })
// //       });
// //       const data = await response.json();
// //       setCourseContent(data.course_content);
// //       setPdfPath(data.pdf_path);
// //     } catch (error) {
// //       console.error('Error:', error);
// //     }
// //     // setIsLoading(false);
// //   };

// //   const handleDownload = () => {
// //     window.open("http://127.0.0.1:5000/${pdfPath}", '_blank');
// //   };

// //   const handleVideoButtonClick = async () => {
// //     try {
// //       const response = await fetch('http://127.0.0.1:5000/generate_video', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json'
// //         },
// //         body: JSON.stringify({ courseContent })
// //       });
// //       const data = await response.json();
// //       setVideoUrl(data.video_url);
// //     } catch (error) {
// //       console.error('Error:', error);
// //     }
// //   };

// //   return (
// //     <div className="courses-container">
// //       <button onClick={goBack} className="back-button">Back</button>
// //       <main className="courses-content">
// //         <header className="dashboard-header">
// //           <h1>Welcome, {name}!</h1>
// //           <p>Explore our courses and enhance your skills.</p>
// //           <div className="search-bar-container">
// //             <input
// //               type="text"
// //               placeholder="Search..."
// //               value={searchTerm}
// //               onChange={e => setSearchTerm(e.target.value)}
// //               className="search-bar"
// //             />
// //             <button onClick={handleSearch} className="search-button">
// //               <FontAwesomeIcon icon={faSearch} />
// //             </button>
// //           </div>
// //         </header>

// //         {isLoading && (
// //           <div className="loading-section">
// //             <ClipLoader color="#000" loading={isLoading} size={50} />
// //             <p>Course generating...please wait</p>
// //           </div>
// //         )}

// //         {courseContent && (
// //           <div className="results-section">
// //             <div className="course-content" dangerouslySetInnerHTML={{ __html: courseContent }} />
// //             <button onClick={handleDownload} className="download-button">Download PDF</button>
// //           </div>
// //         )}

// //         {videoUrl && (
// //           <div className="video-section">
// //             <video src={videoUrl} controls />
// //           </div>
// //         )}

// //         <button className="learn-button" onClick={handleVideoButtonClick}>Learn through video</button>
// //       </main>
// //     </div>
// //   );
// // };

// // export default GenerativeCourses;
// import React, { useState, useRef } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSearch, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
// import ClipLoader from 'react-spinners/ClipLoader';
// import './GenerativeCourse.css';

// const GenerativeCourses = ({ name, navigate }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [courseContent, setCourseContent] = useState('');
//   const [pdfPath, setPdfPath] = useState('');
//   const [audioPath, setAudioPath] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const audioRef = useRef(null);

//   const goBack = () => {
//     navigate('dashboard');
//   };

//   const handleSearch = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch('http://127.0.0.1:5000/generate_course', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ searchTerm }),
//       });
//       const data = await response.json();
//       setCourseContent(data.course_content);
//       setPdfPath(data.pdf_path);
//       setAudioPath(data.audio_path);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//     setIsLoading(false);
//   };

//   const handleDownload = () => {
//     window.open('http://127.0.0.1:5000/${pdfPath}', '_blank');
//   };

//   const handlePlayPause = () => {
//     if (isPlaying) {
//       audioRef.current.pause();
//       setIsPlaying(false);
//     } else {
//       audioRef.current.play();
//       setIsPlaying(true);
//     }
//   };

//   return (
//     <div className="courses-container">
//       <button onClick={goBack} className="back-button">Back</button>
//       <main className="courses-content">
//         <header className="dashboard-header">
//           <h1>Welcome, {name}!</h1>
//           <p>Explore our courses and enhance your skills.</p>
//           <div className="search-bar-container">
//             <input
//               type="text"
//               placeholder="Search..."
//               value={searchTerm}
//               onChange={e => setSearchTerm(e.target.value)}
//               className="search-bar"
//             />
//             <button onClick={handleSearch} className="search-button">
//               <FontAwesomeIcon icon={faSearch} />
//             </button>
//           </div>
//         </header>

//         {isLoading && (
//           <div className="loading-section">
//             <ClipLoader color="#000" loading={isLoading} size={50} />
//             <p>Course generating...please wait (this may take a while)</p>
//           </div>
//         )}

//         {courseContent && (
//           <div className="results-section">
//             <div className="course-content" dangerouslySetInnerHTML={{ __html: courseContent }} />
//             <button onClick={handleDownload} className="download-button">Download PDF</button>
//           </div>
//         )}

//         {}
//         audioPath && (
//             <div className="audio-controls">
//             <button onClick={handlePlayPause} className="play-pause-button">
//               <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
//             </button>
//             <p>{isPlaying ? 'Audio playing' : 'Audio paused'}</p>
//             <audio ref={audioRef} src={'http://127.0.0.1:5000/${audioPath}'} />
//           </div>
//         )
//       </main>
//     </div>
//   );
// };

// export default GenerativeCourses;
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
  const [recording, setRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);


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
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (isAIInteractionActive && videoRef.current) {
      videoRef.current.play();
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [isAIInteractionActive]);
  
  const handleAIInteraction = () => {
    setIsAIInteractionActive(!isAIInteractionActive);
  };

  const handleVoiceInput = async () => {
    if (!recording) {
      // Start recording
      if (!mediaRecorderRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
  
        mediaRecorderRef.current.ondataavailable = (e) => {
          if (e.data.size > 0) {
            setRecordedAudio(e.data); // Save the Blob
          }
        };
      }
      mediaRecorderRef.current.start();
      setRecording(true);
    } else {
      // Stop recording and process the audio
      mediaRecorderRef.current.stop();
      setRecording(false);

      mediaRecorderRef.current.onstop = async () => {
        if (recordedAudio && recordedAudio instanceof Blob) {
          const formData = new FormData();
          formData.append('audio', recordedAudio, 'input_audio.wav');
      
          try {
            // Send the audio to the Flask API for processing
            const response = await fetch('http://127.0.0.1:5000/process', {
              method: 'POST',
              body: formData,
            });
      
            if (response.ok) {
              const audioUrl = URL.createObjectURL(await response.blob());
              const audio = new Audio(audioUrl);
              audio.play();
            } else {
              console.error('Failed to process voice input');
            }
          } catch (error) {
            console.error('Error:', error);
          }
        } else {
          console.error('Recorded audio is not a Blob');
        }
      };      
    }
  };
  
  return (
    <div className="courses-container">
      <button onClick={goBack} className="back-button">Back</button>
      <main className="courses-content">
        <header className="dashboard-header">
          <button onClick={handleAIInteraction}>
            {isAIInteractionActive ? 'Stop Interaction' : 'Interaction with AI'}
          </button>
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
            <FontAwesomeIcon icon={faMicrophone} className="voice-chat-icon" onClick={handleVoiceInput} />
          </div>
        )}
      </main>
    </div>
  );
};

export default GenerativeCourses;