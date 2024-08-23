import React, { useState , useEffect} from 'react';
import axios from 'axios'; // Import axios
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './Courses.css';

const courses = [
  { id: 1, title: 'Java Basics', description: 'Introduction to Java programming.' },
  { id: 2, title: 'Advanced JavaScript', description: 'Deep dive into JavaScript.' },
  { id: 3, title: 'Python for Data Science', description: 'Learn Python for data analysis.' },
  { id: 4, title: 'React for Beginners', description: 'Getting started with React.' },
  { id: 5, title: 'Flutter Mobile Development', description: 'Building mobile apps with Flutter.' },
  { id: 6, title: 'MongoDB Essentials', description: 'Introduction to MongoDB.' },
  { id: 7, title: 'HTML & CSS Fundamentals', description: 'Building blocks of the web.' },
  { id: 8, title: 'Node.js for Backend', description: 'Building server-side applications.' },
  { id: 9, title: 'Machine Learning Basics', description: 'Introduction to machine learning.' },
  { id: 10, title: 'DevOps Principles', description: 'Fundamentals of DevOps.' },
  { id: 11, title: 'SQL for Beginners', description: 'Learn SQL for database management.' },
  { id: 12, title: 'JavaScript Frameworks', description: 'Explore popular JS frameworks like Angular and Vue.' },
  { id: 13, title: 'API Development', description: 'Create and manage APIs.' },
  { id: 14, title: 'Web Security', description: 'Basics of securing web applications.' },
  { id: 15, title: 'Cloud Computing', description: 'Introduction to cloud services and solutions.' },
];

const Courses = ({ name, navigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [meetingJoined, setMeetingJoined] = useState(false);
  const [isVoiceOn, setIsVoiceOn] = useState(false);
  const [peerConnection, setPeerConnection] = useState(null);
  const [ws, setWs] = useState(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:8080');
    websocket.onmessage = handleSignalingMessage;
    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVideoButtonClick = (courseTitle) => {
    alert('Playing video for: ' + courseTitle);
  };

  const handleCreateMeeting = async () => {
    try {
      // API call to create meeting
      const response = await fetch('http://localhost:5000/create_meeting', {
        method: 'POST',
      });
      const data = await response.json();
      alert('Meeting created. Share this ID with your friends to join: ' + data.meeting_id);
      setMeetingJoined(true); // Update state to show new buttons
    } catch (error) {
      console.error('Error creating meeting:', error);
    }
  };

  const handleJoinMeeting = async () => {
    const meetingID = prompt('Enter the Meeting ID:');
    if (meetingID) {
      try {
        // API call to join meeting
        const response = await fetch(`http://localhost:5000/join_meeting/${meetingID}`, {
          method: 'GET',
        });
        if (response.ok) {
          alert('Successfully joined meeting!');
          setMeetingJoined(true); // Update state to show new buttons
        } else {
          alert('Invalid Meeting ID.');
        }
      } catch (error) {
        console.error('Error joining meeting:', error);
      }
    }
  };

  const handleStartPresenting = async () => {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const videoElement = document.getElementById('screen-share-video');
        if (videoElement) {
            videoElement.srcObject = stream;
            videoElement.play();
        }

        const response = await fetch('http://localhost:5000/start_presenting', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ presenting: true })
        });
        if (response.ok) {
            alert('Started presenting.');
        }
    } catch (error) {
        console.error('Error starting screen sharing:', error);
    }
  };

  const handleTurnOnVoice = async () => {
    if (isVoiceOn) {
      alert('Voice is already on.');
      return;
    }
  
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const pc = new RTCPeerConnection();
  
      // Add the local audio track to the peer connection
      stream.getTracks().forEach(track => pc.addTrack(track, stream));
  
      // Handle ICE candidates
      pc.onicecandidate = event => {
        if (event.candidate) {
          ws.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
        }
      };
  
      // Create and send an offer to the remote peer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      ws.send(JSON.stringify({ type: 'offer', offer: offer }));
  
      setPeerConnection(pc);
      setIsVoiceOn(true); // Update state to indicate voice is on
  
      alert('Voice communication started.');
    } catch (error) {
      console.error('Error turning on voice communication:', error);
    }
  };
  
  const handleTurnOffVoice = async () => {
    if (!isVoiceOn) {
      alert('Voice is already off.');
      return;
    }
  
    try {
      if (peerConnection) {
        // Stop all tracks in the media stream
        const senders = peerConnection.getSenders();
        senders.forEach(sender => {
          if (sender.track) {
            sender.track.stop();
          }
        });
  
        // Close the peer connection
        peerConnection.close();
        setPeerConnection(null);
      }
  
      setIsVoiceOn(false); // Update state to indicate voice is off
  
      alert('Voice communication stopped.');
    } catch (error) {
      console.error('Error turning off voice communication:', error);
    }
  };
  const handleSignalingMessage = async (event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'offer') {
      if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        ws.send(JSON.stringify({ type: 'answer', answer: answer }));
      }
    } else if (data.type === 'answer') {
      if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
    } else if (data.type === 'candidate') {
      if (peerConnection) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    }
  };

  const handleLeaveMeeting = () => {
    alert('Leaving the meeting...');
    setMeetingJoined(false); 
  };

  return (
    <div className="courses-container">
      <button onClick={() => navigate('dashboard')} className="back-button" style={{ backgroundColor: "red" }}>Back</button>
      <main className="courses-content">
        <header className="dashboard-header">
          {!meetingJoined ? (
            <div className="meeting-buttons">
              <button onClick={handleCreateMeeting} className="meeting-button">Create Meeting</button>
              <button onClick={handleJoinMeeting} className="meeting-button">Join Meeting</button>
            </div>
          ) : (
            <div className="meeting-action-buttons">
              <button onClick={handleStartPresenting} className="meeting-button">Start Presenting</button>
              {isVoiceOn ? (
                <button onClick={handleTurnOffVoice} className="meeting-button">Turn off Voice</button>
              ) : (
                <button onClick={handleTurnOnVoice} className="meeting-button">Turn on Voice</button>
              )}
              <button onClick={handleLeaveMeeting} className="meeting-button">Leave Meeting</button>
            </div>
          )}
          <h1>Welcome, {name}!</h1>
          <p>Explore our extensive course catalog to enhance your skills.</p>
          <div className="search-bar-container">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-bar"
            />
            <button className="search-button">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </header>

        <div className="courses-grid">
          {filteredCourses.length > 0 ? (
            filteredCourses.map(course => (
              <div key={course.id} className="course-card">
                <h2>{course.title}</h2>
                <p>{course.description}</p>
                <button className="video-button" onClick={() => handleVideoButtonClick(course.title)}>
                  Play Video
                </button>
              </div>
            ))
          ) : (
            <p>No courses found</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Courses;