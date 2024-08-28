import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './FeedBack.css';

const FeedbackModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [sentiment, setSentiment] = useState('');
  const [polarity, setPolarity] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [showingResponse, setShowingResponse] = useState(false);

  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleFeedbackChange = (e) => setFeedback(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5000/analyze-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, feedback }),
      });

      const result = await response.json();

      if (response.ok) {
        setSentiment(result.sentiment);
        setPolarity(result.polarity);

        // Generate a response message based on the sentiment
        switch (result.sentiment) {
          case 'Positive':
            setResponseMessage('Thank you for your positive feedback!');
            break;
          case 'Neutral':
            setResponseMessage('Thank you for your feedback!');
            break;
          case 'Negative':
            setResponseMessage('We\'re sorry to hear that you had a negative experience.');
            break;
          default:
            setResponseMessage('Thank you for your feedback!');
        }

        // Delay for 5 seconds before showing the response message and closing the modal
        setShowingResponse(true);
        setTimeout(() => {
          setShowingResponse(false);
          onClose();
        }, 5000); // 5000 milliseconds = 5 seconds
      } else {
        setResponseMessage('Something went wrong. Please try again.');
        setShowingResponse(true);
        setTimeout(() => {
          setShowingResponse(false);
          onClose();
        }, 5000);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setResponseMessage('An error occurred. Please try again.');
      setShowingResponse(true);
      setTimeout(() => {
        setShowingResponse(false);
        onClose();
      }, 5000);
    }

    // Reset form
    setName('');
    setEmail('');
    setFeedback('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <FontAwesomeIcon
          icon={faTimes}
          className="close-icon"
          onClick={onClose}
        />
        <h2>Submit Your Feedback</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div>
            <label htmlFor="feedback">Feedback:</label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={handleFeedbackChange}
              required
            />
          </div>
          <button type="submit">Submit Feedback</button>
        </form>
        {showingResponse && (
          <div className="feedback-response">
            <h3>Feedback Response</h3>
            <p>{responseMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default FeedbackModal;