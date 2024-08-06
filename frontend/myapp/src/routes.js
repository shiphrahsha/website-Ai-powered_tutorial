import React, { useState } from 'react';
import AuthPage from './components/pages/AuthPage';
import HomePage from './components/pages/HomePage';
import Dashboard from './components/Dashboard/Dashboard';
import CodingPlatform from './components/Dashboard/CodingPlatform';
import GenerativeCourses from './components/Dashboard/GenerativeCourse';
import UserDetails from './components/Dashboard/UserDetails';
import Logout from './components/Dashboard/Logout';
import UpgradeToPro from './components/Dashboard/UpgradeToPro';
import Courses from './components/Dashboard/Courses';
import QuestionsBank from './components/Dashboard/QuestionsBank';


const Routes = () => {
  const [currentPage, setCurrentPage] = useState('home'); // Set initial state to 'home'

  const navigate = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="App">
      {currentPage === 'auth' && <AuthPage navigate={navigate} />}
      {currentPage === 'home' && <HomePage navigate={navigate} />}
      {currentPage === 'dashboard' && <Dashboard navigate={navigate} />}
      {currentPage === 'coding-platform' && <CodingPlatform navigate={navigate} />}
      {currentPage === 'generative-courses' && <GenerativeCourses navigate={navigate} />}
      {currentPage === 'user-details' && <UserDetails navigate={navigate} />}
      {currentPage === 'logout' && <Logout navigate={navigate} />}
      {currentPage === 'upgrade-to-pro' && <UpgradeToPro navigate={navigate} />}
      {currentPage === 'courses' && <Courses navigate={navigate} />}
      {currentPage === 'questions-banks' && <QuestionsBank navigate={navigate} />}

    </div>
  );
};

export default Routes;
