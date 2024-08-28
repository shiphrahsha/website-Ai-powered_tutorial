
import React, { useState, useEffect } from 'react';
import './Logout.css'; // Ensure you have appropriate styles in this file

const Logout = ({ navigate }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    // Automatically show confirmation dialog when component mounts
    setShowConfirm(true);
  }, []);

  const handleLogout = () => {
    // Handle logout logic here (e.g., clearing session, etc.)
    navigate('home'); // Redirect to home or another page after logout
  };


  const goBack = () => {
    navigate('dashboard');
  };

  return (
    <div className="logout-container">
      {showConfirm && (
        <div className="confirm-dialog">
          <div className="confirm-dialog-content">
            <h2>Are you sure you want to logout?</h2>
            <div className="confirm-dialog-actions">
              <button onClick={handleLogout} className="confirm-yes">
                Yes, Logout
              </button>
              <button onClick={goBack} className="confirm-no">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logout;