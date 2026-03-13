import React from "react";
import { Link } from "react-router-dom";
import "../../style/landing.scss";

const Landing = () => {
  return (
    <div className="landing-page">
      <section className="hero-section">
        <h1>AI Resume & Interview Assistant</h1>
        <p>
          Create ATS-friendly resumes and generate personalized interview reports using advanced AI technology.
        </p>
        <div className="cta-buttons">
          <Link to="/login">
            <button className="button primary-button">Login</button>
          </Link>
          <Link to="/register">
            <button className="button primary-button">Register</button>
          </Link>
        </div>
      </section>

      <section className="features-section">
        <h2>Features</h2>
        <div className="features-list">
          <p>📄 Resume Generator - Create professional, ATS-optimized resumes</p>
          <p>🤖 AI Interview Reports - Get detailed feedback and improvement suggestions</p>
          <p>📊 Resume Analysis - Analyze your resume against job requirements</p>
          <p>🎯 Job Description Matching - Match your skills with job opportunities</p>
        </div>
      </section>

      {/* Unique 'See Created' Section */}
      <section className="see-created-section">
        <h2 className="see-created-title">
          <span role="img" aria-label="sparkle">✨</span> See What You've Created <span role="img" aria-label="sparkle">✨</span>
        </h2>
        <div className="see-created-gallery">
          <div className="see-created-card">
            <div className="see-created-icon">
              <span role="img" aria-label="resume">📝</span>
            </div>
            <div className="see-created-content">
              <h3>Stunning Resumes</h3>
              <p>Preview and download your AI-crafted, visually engaging resumes. Stand out from the crowd with modern, personalized designs.</p>
            </div>
          </div>
          <div className="see-created-card">
            <div className="see-created-icon">
              <span role="img" aria-label="report">📑</span>
            </div>
            <div className="see-created-content">
              <h3>Insightful Reports</h3>
              <p>Access interactive interview reports with actionable feedback, analytics, and growth charts to visualize your progress.</p>
            </div>
          </div>
          <div className="see-created-card">
            <div className="see-created-icon">
              <span role="img" aria-label="trophy">🏆</span>
            </div>
            <div className="see-created-content">
              <h3>Your Achievements</h3>
              <p>Celebrate your milestones with digital badges and shareable certificates for every goal you conquer!</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;