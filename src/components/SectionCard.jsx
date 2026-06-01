import React from "react";
import { SCALE_OPTIONS } from "../data/questions";

export default function SectionCard({
  section,
  answers,
  onAnswer,
  missingQuestions,
}) {
  const answeredInSection = section.questions.filter(
    (_, i) => answers[`${section.id}-${i}`] !== undefined
  ).length;
  const total = section.questions.length;
  const sectionProgress = Math.round((answeredInSection / total) * 100);

  return (
    <section className="section-card" id={`section-${section.id}`}>
      <div className="section-header">
        <div className="section-header-text">
          <h2 className="section-title">{section.title}</h2>
          {section.description && (
            <p className="section-description">{section.description}</p>
          )}
          <span className="section-meta">
            Timeframe: <strong>{section.timeframe}</strong> &nbsp;|&nbsp;
            {section.itemCount} items &nbsp;|&nbsp; Max Score:{" "}
            {section.maxTotal}
          </span>
          {section.reverseItems.length > 0 && (
            <span className="reverse-note">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
              Items {section.reverseItems.join(", ")} are reverse-scored (adjusted = 4 − raw)
            </span>
          )}
        </div>
        <div className="section-progress-ring">
          <svg viewBox="0 0 36 36" className="circular-progress">
            <path
              className="circle-bg"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="circle-fill"
              strokeDasharray={`${sectionProgress}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="ring-label">
            <span>{answeredInSection}/{total}</span>
            <span>complete</span>
          </div>
        </div>
      </div>

      <div className="questions-list">
        {section.questions.map((question, qi) => {
          const key = `${section.id}-${qi}`;
          const isMissing = missingQuestions.includes(key);
          const isReverse = section.reverseItems.includes(qi + 1);

          return (
            <div
              key={key}
              id={`q-${key}`}
              className={`question-row ${isMissing ? "question-row--missing" : ""} ${
                answers[key] !== undefined ? "question-row--answered" : ""
              }`}
            >
              <div className="question-number">
                {qi + 1}
                {isReverse && <span className="reverse-badge">R</span>}
              </div>
              <div className="question-text">{question}</div>
              <div className="radio-group">
                {SCALE_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={`radio-label ${
                      answers[key] === opt.value ? "radio-label--selected" : ""
                    }`}
                    title={opt.label}
                  >
                    <input
                      type="radio"
                      name={key}
                      value={opt.value}
                      checked={answers[key] === opt.value}
                      onChange={() => onAnswer(section.id, qi, opt.value)}
                      className="radio-input"
                    />
                    <span className="radio-value">{opt.value}</span>
                    <span className="radio-desc">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
