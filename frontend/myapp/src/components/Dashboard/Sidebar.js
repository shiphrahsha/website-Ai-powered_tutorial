import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBook, faUser, faCode, faStar, faQuestionCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css'; // Import the separate CSS file
import logo from '../assets/icon.png'; // Adjust the path to your PNG image

const Sidebar = ({navigate}) => {
  const navigateToCodingPlayground = () => {
    navigate('coding-platform');
  };
  const navigateToGenerativeCourses = () => {
    navigate('generative-courses');
  };
  const navigateToUserDetails = () => {
    navigate('user-details');
  };
  const navigateToLogout = () => {
    navigate('logout');
  }
  const navigateToUpgradeToPro = () => {
    navigate('upgrade-to-pro');
  }
  const navigateToCourses = () => {
    navigate('courses');
  }
  const navigateToQuestionsbanks = () => {
    navigate('questions-banks');
  }
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="Dashboard Logo" className="sidebar-logo" />
      </div>
      <ul>
        <li><FontAwesomeIcon icon={faHome} className="sidebar-icon" /> Home</li>
        <li onClick={navigateToCourses}><FontAwesomeIcon icon={faBook} className="sidebar-icon" /> Courses</li>
        <li onClick={navigateToUserDetails}><FontAwesomeIcon icon={faUser} className="sidebar-icon" /> User Details</li>
        <li onClick={navigateToCodingPlayground}><FontAwesomeIcon icon={faCode} className="sidebar-icon" /> Coding Playground</li>
        <li onClick={navigateToGenerativeCourses}><FontAwesomeIcon icon={faStar} className="sidebar-icon" /> Generative Course</li>
        <li onClick={navigateToQuestionsbanks}><FontAwesomeIcon icon={faQuestionCircle} className="sidebar-icon" /> Questions Banks</li>
        <li onClick={navigateToLogout}><FontAwesomeIcon icon={faSignOutAlt} className="sidebar-icon" /> Logout</li>
        <li className="upgrade-button" onClick={navigateToUpgradeToPro}>Upgrade to PRO</li>
      </ul>
    </aside>
  );
};

export default Sidebar;
