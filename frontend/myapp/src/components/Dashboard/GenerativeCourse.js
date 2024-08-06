import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './GenerativeCourse.css';

const GenerativeCourses = ({ name, navigate }) => {
  const goBack = () => {
    navigate('dashboard');
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [courseContent, setCourseContent] = useState('');
  const [pdfPath, setPdfPath] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/generate_course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ searchTerm })
      });
      const data = await response.json();
      setCourseContent(data.course_content);
      setPdfPath(data.pdf_path);
    } catch (error) {
      console.error('Error:', error);
    }
    setIsLoading(false);
  };

  const handleDownload = () => {
    window.open(`http://127.0.0.1:5000/${pdfPath}`, '_blank');
  };

  const handleVideoButtonClick = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/generate_video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ courseContent })
      });
      const data = await response.json();
      setVideoUrl(data.video_url);
    } catch (error) {
      console.error('Error:', error);
    }
  };

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

        {isLoading && <p>Loading...</p>}

        {courseContent && (
          <div className="results-section">
            <p>{courseContent}</p>
            <button onClick={handleDownload} className="download-button">Download PDF</button>
          </div>
        )}

        {videoUrl && (
          <div className="video-section">
            <video src={videoUrl} controls />
          </div>
        )}

        <button className="learn-button" onClick={handleVideoButtonClick}>Learn through video</button>
      </main>
    </div>
  );
};

export default GenerativeCourses;
