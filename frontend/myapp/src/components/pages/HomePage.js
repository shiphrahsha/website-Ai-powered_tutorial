import React from "react";
import "../pages/HomePage.css";

// Importing assets
import heroImage from "../assets/background.png";
import featureIcon1 from "../assets/1.png";
import featureIcon2 from "../assets/2.png";
import featureIcon3 from "../assets/3.png";
import studentTestimonial from "../assets/4.png";
import parentTestimonial from "../assets/5.png";
import tutorTestimonial from "../assets/6.png";

const Homepage = ({ navigate }) => {
  const navigateToLogin = () => {
    navigate("auth");
  };
  return (
    <div className="homepage">
      {/* Header Section */}
      <header className="header">
        <div className="logo">{/* <img src={logo} alt="Logo" /> */}</div>
        <nav className="nav">
          <ul style={{marginRight: "12px"}}>
            <li>
              <a href="#features" style={{ color: "white" }}>
                Features
              </a>
            </li>
            <li>
              <a href="#how-it-works" style={{ color: "white" }}>
                How It Works
              </a>
            </li>
            <li>
              <a href="#testimonials" style={{ color: "white" }}>
                Testimonials
              </a>
            </li>
            <li>
              <a href="#courses" style={{ color: "white" }}>
                Courses
              </a>
            </li>
            <li>
              <a href="#pricing" style={{ color: "white" }}>
                Pricing
              </a>
            </li>
            <li>
              <a href="#faq" style={{ color: "white" }}>
                FAQ
              </a>
            </li>
            <li>
              <a href="#contact" style={{ color: "white" }}>
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 style={{textAlign:"left"}}>Achieve Academic Excellence with AI-Powered Tutoring</h1>
          <p>
            Personalized learning paths and real-time assistance for students of
            all ages.
          </p>
          <div className="cta-buttons">
            <button className="cta-button" onClick={navigateToLogin}>
              Get Started
            </button>
          </div>
        </div>
        <div className="hero-image">
          <img src={heroImage} alt="AI Tutoring" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <h2>Features</h2>
        <div className="features-container">
          <div className="feature-item">
            <img src={featureIcon1} alt="Personalized Learning" />
            <h3>Personalized Learning</h3>
            <p>AI tailors lessons to individual needs.</p>
          </div>
          <div className="feature-item">
            <img src={featureIcon2} alt="Interactive Lessons" />
            <h3>Interactive Lessons</h3>
            <p>Multimedia-rich content, quizzes, and interactive exercises.</p>
          </div>
          <div className="feature-item">
            <img src={featureIcon3} alt="24/7 Accessibility" />
            <h3>24/7 Accessibility</h3>
            <p>Access the platform anytime, anywhere.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works" id="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step-item">
            <h3>Step 1</h3>
            <p>Sign Up and create your account.</p>
          </div>
          <div className="step-item">
            <h3>Step 2</h3>
            <p>Take an initial assessment to personalize your learning path.</p>
          </div>
          <div className="step-item">
            <h3>Step 3</h3>
            <p>Start learning with tailored lessons and track your progress.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials" id="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonials-container">
          <div className="testimonial-item">
            <img src={studentTestimonial} alt="Student Testimonial" />
            <p>
              "This platform has transformed my learning experience. The
              personalized lessons are amazing!"
            </p>
            <h4>- Student Name</h4>
          </div>
          <div className="testimonial-item">
            <img src={parentTestimonial} alt="Parent Testimonial" />
            <p>
              "My child's grades have improved significantly since using this
              tutoring platform."
            </p>
            <h4>- Parent Name</h4>
          </div>
          <div className="testimonial-item">
            <img src={tutorTestimonial} alt="Tutor Testimonial" />
            <p>
              "As a tutor, I find this platform incredibly helpful for providing
              tailored assistance to students."
            </p>
            <h4>- Tutor Name</h4>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="courses" id="courses">
        <h2>Courses and Subjects Offered</h2>
        <div className="courses-container">
          <div className="course-item">
            <h3>Math</h3>
            <p>
              Comprehensive math lessons from basic arithmetic to advanced
              calculus.
            </p>
          </div>
          <div className="course-item">
            <h3>Science</h3>
            <p>
              Explore physics, chemistry, biology, and more with interactive
              lessons.
            </p>
          </div>
          <div className="course-item">
            <h3>Languages</h3>
            <p>
              Learn new languages with tailored lessons and practice exercises.
            </p>
          </div>
          <div className="course-item">
            <h3>Test Prep</h3>
            <p>Prepare for exams with practice tests and study guides.</p>
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="pricing" id="pricing">
        <h2>Pricing Plans</h2>
        <div className="pricing-container">
          <div className="pricing-item">
            <h3>Basic</h3>
            <p>$9.99/month</p>
            <ul>
              <li>Access to all courses</li>
              <li>Basic progress tracking</li>
              <li>Email support</li>
            </ul>
            <button className="cta-button">Choose Basic</button>
          </div>
          <div className="pricing-item">
            <h3>Standard</h3>
            <p>$19.99/month</p>
            <ul>
              <li>Access to all courses</li>
              <li>Advanced progress tracking</li>
              <li>Priority email support</li>
            </ul>
            <button className="cta-button">Choose Standard</button>
          </div>
          <div className="pricing-item">
            <h3>Premium</h3>
            <p>$29.99/month</p>
            <ul>
              <li>Access to all courses</li>
              <li>Personalized tutoring sessions</li>
              <li>24/7 chat support</li>
            </ul>
            <button className="cta-button">Choose Premium</button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq" id="faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-container">
          <div className="faq-item">
            <h3>What is the AI-powered tutoring platform?</h3>
            <p>
              Our platform uses AI to provide personalized learning experiences
              for students of all ages.
            </p>
          </div>
          <div className="faq-item">
            <h3>How does the platform personalize learning?</h3>
            <p>
              We use an initial assessment to understand each student's needs
              and tailor lessons accordingly.
            </p>
          </div>
          <div className="faq-item">
            <h3>What subjects are available?</h3>
            <p>
              We offer a wide range of subjects including Math, Science,
              Languages, and Test Prep.
            </p>
          </div>
          <div className="faq-item">
            <h3>How much does it cost?</h3>
            <p>We offer various pricing plans starting from $9.99 per month.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" id="contact">
        <div className="footer-container">
          <div className="footer-links">
            <a href="/about">About Us</a>
            <a href="/careers">Careers</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
          </div>
          <div className="footer-social">
            <a href="https://facebook.com">Facebook</a>
            <a href="https://twitter.com">Twitter</a>
            <a href="https://instagram.com">Instagram</a>
            <a href="https://linkedin.com">LinkedIn</a>
          </div>
          <div className="footer-newsletter">
            <h3>Subscribe to our Newsletter</h3>
            <input type="email" placeholder="Enter your email" />
            <button className="cta-button">Subscribe</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;