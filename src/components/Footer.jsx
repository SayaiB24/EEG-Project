import React from "react";

export default function Footer() {
  return (
    <footer className="app-footer">
      <p>For research purposes only — not a diagnostic tool</p>
      <p className="footer-sub">
        Integrated Mental Health Monitoring Assessment (IMHMA) &copy;{" "}
        {new Date().getFullYear()}
      </p>
    </footer>
  );
}
