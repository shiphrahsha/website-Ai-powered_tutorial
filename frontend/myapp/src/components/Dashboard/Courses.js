import React, { useState } from 'react';
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

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVideoButtonClick = (courseTitle) => {
    alert('Playing video for: ' + courseTitle);
  };

  return (
    <div className="courses-container">
      <button onClick={() => navigate('dashboard')} className="back-button" style={{ backgroundColor:"red"}}>Back</button>
      <main className="courses-content">
        <header className="dashboard-header">
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
