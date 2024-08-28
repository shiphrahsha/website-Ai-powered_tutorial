import React, { useState } from 'react';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement } from 'chart.js';
import Sidebar from './Sidebar';


import '../Dashboard/Dashboard.css';

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  BarElement, 
  CategoryScale, 
  LinearScale, 
  LineElement,
  PointElement
);

const Dashboard = ({ navigate }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const doughnutData = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const doughnutOptions = {
    plugins: {
      legend: {
        labels: {
          color: '#FFFFFF',
        },
      },
    },
  };
  
  const barData = {
    labels: ['January', 'February', 'March'],
    datasets: [
      {
        label: 'Sales',
        data: [50, 100, 150],
        backgroundColor: '#42A5F5',
      },
    ],
  };
  
  const barOptions = {
    plugins: {
      legend: {
        labels: {
          color: '#FFFFFF',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#FFFFFF',
        },
      },
      y: {
        ticks: {
          color: '#FFFFFF',
        },
      },
    },
  };

  const lineData = {
    labels: ['January', 'February', 'March', 'April'],
    datasets: [
      {
        label: 'Revenue',
        data: [20, 40, 60, 80],
        borderColor: '#FF7043',
        backgroundColor: 'rgba(255, 112, 67, 0.2)',
        fill: true,
      },
    ],
  };

  const lineOptions = {
    plugins: {
      legend: {
        labels: {
          color: '#FFFFFF',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#FFFFFF',
        },
      },
      y: {
        ticks: {
          color: '#FFFFFF',
        },
      },
    },
  };

  const user = {
    name: 'SHIPHRAH SHARONE',
    email: 'shiphrahsmadasu@gmail.com',
    recentActivities: [
      { description: 'Completed the course "Introduction to UX Design"', date: 'July 15, 2024' },
      { description: 'Received a new message from Sarah Williams', date: 'July 14, 2024' },
      { description: 'Updated the course "Advanced JavaScript"', date: 'July 13, 2024' },
    ],
    performanceMetrics: {
      totalCourses: 12,
      activeCourses: 5,
      completedCourses: 8,
      averageScore: 90,
    },
  };


  return (
    <div className="dashboard-container">
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} navigate={navigate} />
          <main className="main-content">
            <div className="user-details">
              <div className="user-profile">
                <div className="user-info">
                  <h1 style={{ color: 'white' }}>{user.name}</h1>
                  <p style={{ color: '#b0b0b0' }}>{user.email}</p>
                </div>
              </div>
            </div>
            <div className="dashboard-stats">
              <div className="stat-card">
                <p>Completed courses</p>
                <p>2</p>
              </div>
              <div className="stat-card">
                <p>Consistency</p>
                <p>2 days</p>
              </div>
              <div className="stat-card">
                <p>Free enrollments</p>
                <p>427</p>
              </div>
              <div className="stat-card">
                <p>Paid enrollments</p>
                <p>419</p>
              </div>
              <div className="stat-card">
                <p>Average learning time in a day</p>
                <p>3 hrs</p>
              </div>
            </div>
            <div className="top-selling-courses">
              <div className="course-chart">
                <div className="chart">
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                </div>
                <div className="chart">
                  <Bar data={barData} options={barOptions} />
                </div>
                <div className="chart">
                  <Line data={lineData} options={lineOptions} />
                </div>
              </div>
            </div>
            <div className="next-lessons">
              <h2 style={{ color: 'white' }}>Next lessons releases</h2>
              <div className="lessons-list">
                <div className="lesson-card">
                  <p>June 21</p>
                  <p>What is UX?</p>
                  <p>8:00 AM</p>
                </div>
                <div className="lesson-card">
                  <p>June 28</p>
                  <p>Getting pro with hashtags</p>
                  <p>10:30 AM</p>
                </div>
              </div>
            </div>
            <div className="articles-section">
              <h2 style={{ color: 'white' }}>Articles</h2>
              <div className="articles-grid">
                <div className="article-card">
                  <h3>How to use gamification in creating online courses</h3>
                </div>
                <div className="article-card">
                  <h3>How to structure your own online course</h3>
                </div>
                <div className="article-card">
                  <h3>How to make your lessons more engaging?</h3>
                </div>
                <div className="article-card">
                  <h3>4 tricks to make your courses more PRO</h3>
                </div>
              </div>
            </div>
            <div className="recent-activity">
              <h2 style={{ color: 'white' }}>Recent Activity</h2>
              <div className="activity-list">
                {user.recentActivities.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <p>{activity.description}</p>
                    <p><small>{activity.date}</small></p>
                  </div>
                ))}
              </div>
            </div>
            <div className="upcoming-webinars">
              <h2 style={{ color: 'white' }}>Upcoming Webinars</h2>
              <div className="webinar-list">
                <div className="webinar-card">
                  <p>August 5, 2024</p>
                  <p>Mastering React Hooks</p>
                  <p>2:00 PM</p>
                </div>
                <div className="webinar-card">
                  <p>August 12, 2024</p>
                  <p>Introduction to GraphQL</p>
                  <p>4:00 PM</p>
                </div>
              </div>
            </div>
          </main>


    </div>
  );
};

export default Dashboard;