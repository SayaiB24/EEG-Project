import React from "react";
import { severityClass } from "../utils/scoring";

export default function Results({ results, name, date }) {
  return (
    <div className="results-wrapper" id="results-section">
      <div className="results-card">
        <div className="results-header">
          <h2 className="results-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            Assessment Results
          </h2>
          {(name || date) && (
            <p className="results-patient">
              {name && <span><strong>Participant:</strong> {name}</span>}
              {name && date && <span> &nbsp;|&nbsp; </span>}
              {date && <span><strong>Date:</strong> {date}</span>}
            </p>
          )}
        </div>

        <div className="results-grid">
          {results.sections.map((sec, i) => (
            <div
              key={i}
              className={`result-item ${severityClass(sec.percentile)}`}
            >
              <h3 className="result-section-name">{sec.sectionTitle}</h3>
              <div className="result-stats">
                <div className="result-stat">
                  <span className="stat-label">Raw Score</span>
                  <span className="stat-value">{sec.rawSum}</span>
                </div>
                <div className="result-stat">
                  <span className="stat-label">Percentile</span>
                  <span className="stat-value">{sec.percentile}%</span>
                </div>
              </div>
              <div className="result-bar-track">
                <div
                  className="result-bar-fill"
                  style={{ width: `${sec.percentile}%` }}
                />
              </div>
              <div className="result-interpretation">
                {sec.interpretation}
              </div>
            </div>
          ))}
        </div>

        {/* Overall */}
        <div className={`overall-result ${severityClass(results.overall.percentile)}`}>
          <h3 className="overall-label">Overall Assessment</h3>
          <div className="overall-score">
            <span className="overall-pct">{results.overall.percentile}%</span>
            <span className="overall-interp">
              {results.overall.interpretation}
            </span>
          </div>
          <div className="overall-bar-track">
            <div
              className="overall-bar-fill"
              style={{ width: `${results.overall.percentile}%` }}
            />
          </div>
          <p className="overall-note">
            Average of all four section percentiles
          </p>
        </div>
      </div>
    </div>
  );
}
