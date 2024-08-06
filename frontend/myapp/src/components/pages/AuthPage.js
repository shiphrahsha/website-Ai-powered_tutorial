// src/pages/AuthPage.js
import React from 'react';
import AuthForm from '../auth/AuthForm';

const AuthPage = ({ navigate }) => {
  return (
    <div className="auth-page">
      <AuthForm navigate={navigate} />
    </div>
  );
};

export default AuthPage;
