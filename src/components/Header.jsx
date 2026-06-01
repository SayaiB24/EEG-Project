import React from "react";

export default function Header({
  name,
  setName,
  date,
  setDate,
  isTestStarted,
  onStartTest,
}) {
  return (
    <header className="header-card">

      <div className="header-badge">IMHMA</div>
      <h1 className="header-title">
        Holistic Wellbeing Assesment
      </h1>
      <p className="header-acronym">(IMHMA : Integrated Mental Health Monitoring Assessment)</p>

      {/* Patient Info */}
      <div className="patient-info">
        <div className="field-group">
          <label htmlFor="patient-name">Full Name</label>
          <input
            id="patient-name"
            type="text"
            placeholder="Enter participant name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="field-input"
          />
        </div>
        <div className="field-group">
          <label htmlFor="assessment-date">Date</label>
          <input
            id="assessment-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="field-input"
          />
        </div>
      </div>

      {/* Purpose */}
      <div className="info-block">
        <h3 className="info-block-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          Purpose
        </h3>
        <p>
          This tool is a comprehensive screening instrument designed to provide a
          &lsquo;ground truth&rsquo; psychological profile to assist in EEG data
          analysis. It evaluates four key areas of your mental well-being:
          Depression &amp; Mood, Anxiety &amp; Arousal, Perceived Stress, and
          Attention &amp; Executive Function.
        </p>
      </div>

      {/* Confidentiality */}
      <div className="info-block">
        <h3 className="info-block-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Confidentiality &amp; Data Privacy
        </h3>
        <p>
          This data is strictly confidential. All information collected including
          your questionnaire responses and EEG recordings will be stored
          securely. Your data will be anonymized for analysis, meaning your name
          will be replaced by a unique ID code to ensure that no personal
          identifiers are shared in the final research findings or project
          reports.
        </p>
      </div>

      {/* Instructions */}
      <div className="info-block info-block--instructions">
        <h3 className="info-block-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          Instructions
        </h3>
        <p>
          Please read each statement carefully and select the number (0-4) that
          best describes your experience. There are no right or wrong answers. To
          ensure the most accurate data, please respond based on your first
          instinct rather than over-thinking any specific question.
        </p>
      </div>

      {/* Scoring Scale */}
      <div className="scale-legend">
        <h3 className="info-block-title">Scoring Scale</h3>
        <div className="scale-items">
          <span className="scale-chip"><strong>0</strong> Never / Not at all</span>
          <span className="scale-chip"><strong>1</strong> Rarely / Almost never</span>
          <span className="scale-chip"><strong>2</strong> Sometimes / Several days</span>
          <span className="scale-chip"><strong>3</strong> Often / More than half the days</span>
          <span className="scale-chip"><strong>4</strong> Always / Nearly every day</span>
        </div>
      </div>

      {/* CTA Button */}
      {!isTestStarted && (
        <div className="cta-container">
          <button className="cta-btn" onClick={onStartTest}>
            <svg className="cta-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
            Know Your Mental Wellness
          </button>
        </div>
      )}
    </header>
  );
}
