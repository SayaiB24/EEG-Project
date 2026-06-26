import React, { useState } from "react";
import rochanPhoto from "../assets/rochan.png";
import devanshPhoto from "../assets/devansh.jpg";
import sayaliPhoto from "../assets/Sayali.png";
import paulPhoto from "../assets/director_paul_chandrankunnel.jpg";
import stanleyPhoto from "../assets/Stanley.jpeg";
import principalPhoto from "../assets/Principal.jpg";
import ishaPhoto from "../assets/isha.jpeg";
import akshitaPhoto from "../assets/akshita.jpeg";
import minaksheePhoto from "../assets/minakshee.jpeg";
import shwetaPhoto from "../assets/shweta.jpeg";

export default function About() {
  const [activeTab, setActiveTab] = useState("developers");

  const developers = [
    {
      name: "Rochan Awasthi",
      email: "rochansawasthi@gmail.com",
      linkedin: "https://www.linkedin.com/in/rochan-awasthi-393242302/",
      initials: "RA",
      image: rochanPhoto,
    },
    {
      name: "Sayali Bambal",
      email: "sayalibambal218@gmail.com",
      linkedin: "https://www.linkedin.com/in/sayali-bambal-1a6241302/",
      initials: "SB",
      image: sayaliPhoto,
    },
    {
      name: "Devansh Paltewar",
      email: "devanshpaltewar2005@gmail.com",
      linkedin: "https://www.linkedin.com/in/devansh-paltewar-981b8829a/",
      initials: "DP",
      image: devanshPhoto,
    },
  ];

  const mentors = [
    { name: "Dr. Fr. Paul Chandrankunnel", initials: "PL", image: paulPhoto },
    { name: "Dr. Fr. Stanly Wilson", initials: "FS", image: stanleyPhoto },
    { name: "Dr. Vijay M. Wadhai", initials: "VW", image: principalPhoto },
    { name: "Ms. Isha Suri", initials: "IS", image: ishaPhoto },
    { name: "Dr. Akshita Chanchlani", initials: "AK", image: akshitaPhoto },
    { name: "Dr. Minakshi Patil", initials: "DM", image: minaksheePhoto },
    { name: "Dr. Shweta Kanhere", initials: "SH", image: shwetaPhoto },
  ];

  return (
    <section className="about-section" id="about-section">
      <div className="about-header">
        <h2 className="about-title">About the Project</h2>
        <div className="about-underline"></div>
        <p className="about-desc">
          The Integrated Mental Health Monitoring Assessment (IMHMA) is developed to support clinical EEG research.
          This tool facilitates the standardized collection and computation of psychometric ground-truth indicators.
        </p>
      </div>

      <div className="about-subsection">
        {/* Segmented Tab Slider */}
        <div className="about-tabs-wrapper">
          <div className="about-tabs-track">
            <div
              className={`about-tabs-slider ${activeTab === "mentors" ? "about-tabs-slider--right" : ""}`}
            />
            <button
              className={`about-tab-seg ${activeTab === "developers" ? "about-tab-seg--active" : ""}`}
              onClick={() => setActiveTab("developers")}
              aria-pressed={activeTab === "developers"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Developers
            </button>
            <button
              className={`about-tab-seg ${activeTab === "mentors" ? "about-tab-seg--active" : ""}`}
              onClick={() => setActiveTab("mentors")}
              aria-pressed={activeTab === "mentors"}
            >
              Mentors
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="about-tab-content">
          {activeTab === "developers" && (
            <div className="developer-grid tab-panel-enter">
              {developers.map((dev, idx) => (
                <div key={idx} className="developer-card">
                  <div className="avatar-container">
                    {dev.image ? (
                      <img
                        src={dev.image}
                        alt={dev.name}
                        className="developer-avatar-img"
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        <span className="avatar-initials">{dev.initials}</span>
                        <svg className="avatar-icon-svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h4 className="developer-name">{dev.name}</h4>
                  <p className="developer-email">
                    <strong>Email:</strong> <a href={`mailto:${dev.email}`}>{dev.email}</a>
                  </p>
                  <div className="developer-linkedin">
                    <a href={dev.linkedin} target="_blank" rel="noopener noreferrer" className="linkedin-link">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                      </svg>
                      LinkedIn Profile
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "mentors" && (
            <div className="developer-grid tab-panel-enter">
              {mentors.map((sup, idx) => (
                <div key={idx} className="developer-card supporter-card">
                  <div className="avatar-container">
                    {sup.image ? (
                      <img
                        src={sup.image}
                        alt={sup.name}
                        className="developer-avatar-img"
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        <span className="avatar-initials">{sup.initials}</span>
                        <svg className="avatar-icon-svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h4 className="developer-name">{sup.name}</h4>
                  {sup.email && (
                    <p className="developer-email">
                      <strong>Email:</strong> <a href={`mailto:${sup.email}`}>{sup.email}</a>
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

