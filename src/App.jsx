import { useState } from "react";
import Header from "./components/Header";
import SectionCard from "./components/SectionCard";
import Results from "./components/Results";
import Footer from "./components/Footer";
import { sections } from "./data/questions";
import { scoreSection, calculatePercentile, interpretPercentile } from "./utils/scoring";
import "./index.css";

function App() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [showValidation, setShowValidation] = useState(false);
  const [missingQuestions, setMissingQuestions] = useState([]);

  const handleAnswer = (sectionId, questionIndex, value) => {
    setAnswers((prev) => ({
      ...prev,
      [`${sectionId}-${questionIndex}`]: Number(value),
    }));
    // Clear validation error for this question
    if (showValidation) {
      setMissingQuestions((prev) =>
        prev.filter((k) => k !== `${sectionId}-${questionIndex}`)
      );
    }
  };

  const handleSubmit = () => {
    // Find all unanswered questions
    const missing = [];
    sections.forEach((sec) => {
      sec.questions.forEach((_, qi) => {
        const key = `${sec.id}-${qi}`;
        if (answers[key] === undefined || answers[key] === null) {
          missing.push(key);
        }
      });
    });

    if (missing.length > 0) {
      setShowValidation(true);
      setMissingQuestions(missing);
      // Scroll to first missing question
      const firstKey = missing[0];
      const el = document.getElementById(`q-${firstKey}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      alert(
        `Please answer all questions before submitting. ${missing.length} question(s) remaining.`
      );
      return;
    }

    // Calculate results for each section
    const sectionResults = sections.map((sec) => scoreSection(answers, sec));
    const avgPercentile =
      Math.round(
        (sectionResults.reduce((s, r) => s + r.percentile, 0) /
          sectionResults.length) *
          10
      ) / 10;
    const overallInterpretation = interpretPercentile(avgPercentile);

    setResults({
      sections: sectionResults,
      overall: {
        percentile: avgPercentile,
        interpretation: overallInterpretation,
      },
    });
    setShowValidation(false);
    setMissingQuestions([]);

    // Scroll to results
    setTimeout(() => {
      const resultsEl = document.getElementById("results-section");
      if (resultsEl) {
        resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleReset = () => {
    setName("");
    setDate("");
    setAnswers({});
    setResults(null);
    setShowValidation(false);
    setMissingQuestions([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Calculate progress
  const totalQuestions = sections.reduce((s, sec) => s + sec.questions.length, 0);
  const answeredCount = Object.keys(answers).length;
  const progressPct = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <div className="app-wrapper">
      <Header name={name} setName={setName} date={date} setDate={setDate} />

      {/* Progress bar */}
      <div className="progress-container">
        <div className="progress-info">
          <span>Progress</span>
          <span>
            {answeredCount} / {totalQuestions} questions answered ({progressPct}%)
          </span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Sections */}
      {sections.map((sec) => (
        <SectionCard
          key={sec.id}
          section={sec}
          answers={answers}
          onAnswer={handleAnswer}
          missingQuestions={missingQuestions}
        />
      ))}

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          className="btn btn-submit"
          onClick={handleSubmit}
          id="btn-submit"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Submit Assessment
        </button>
        <button
          className="btn btn-reset"
          onClick={handleReset}
          id="btn-reset"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
          Reset Form
        </button>
      </div>

      {/* Results */}
      {results && <Results results={results} name={name} date={date} />}

      <Footer />
    </div>
  );
}

export default App;
