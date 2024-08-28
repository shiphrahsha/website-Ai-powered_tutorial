import React from 'react';
import './UpgradeToPro.css'; // Ensure you have appropriate styles in this file

const UpgradeToPro = ({navigate}) => {
  const handleUpgrade = () => {
    // Handle the upgrade logic here
    alert('Upgrade process initiated!');
  };

const goBack = () => {
  navigate('dashboard');
};

  return (
    <div className="upgrade-container">
      <header className="upgrade-header">
        <button className="back-button" onClick={goBack}>Back</button>
        <h1>Upgrade to Pro</h1>
        <p>Unlock advanced features and take your experience to the next level.</p>
      </header>

      <section className="benefits-section">
        <h2>Why Go Pro?</h2>
        <div className="benefits-list">
          <div className="benefit-item">
            <h3>Advanced Features</h3>
            <p>Access exclusive tools and functionalities that enhance your experience.</p>
          </div>
          <div className="benefit-item">
            <h3>Priority Support</h3>
            <p>Get immediate assistance from our dedicated support team.</p>
          </div>
          <div className="benefit-item">
            <h3>Ad-Free Experience</h3>
            <p>Enjoy a seamless experience without interruptions from ads.</p>
          </div>
          <div className="benefit-item">
            <h3>Extended Quotas</h3>
            <p>Increase your limits for usage and data storage.</p>
          </div>
        </div>
      </section>

      <section className="pricing-section">
        <div className="pricing-card">
          <h3>Monthly Plan</h3>
          <p className="price">$19.99 / month</p>
          <ul>
            <li>All Pro Features</li>
            <li>Priority Support</li>
            <li>Ad-Free Experience</li>
          </ul>
          <button onClick={handleUpgrade} className="upgrade-button1">Upgrade Now</button>
        </div>
        <div className="pricing-card">
          <h3>Annual Plan</h3>
          <p className="price">$199.99 / year</p>
          <ul>
            <li>All Pro Features</li>
            <li>Priority Support</li>
            <li>Ad-Free Experience</li>
            <li>2 Months Free</li>
          </ul>
          <button onClick={handleUpgrade} className="upgrade-button2">Upgrade Now</button>
        </div>
      </section>
    </div>
  );
};

export default UpgradeToPro;