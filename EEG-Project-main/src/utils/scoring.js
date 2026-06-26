// ============================================================
// Scoring Utilities
// ============================================================

/**
 * Calculate the raw sum for a section, applying reverse scoring where needed.
 * @param {Object} answers  – { "sectionId-qIndex": value, ... }
 * @param {Object} section  – section definition from questions.js
 * @returns {number|null}   – raw sum or null if any answer is missing
 */
export function calculateRawSum(answers, section) {
  let sum = 0;
  for (let i = 0; i < section.questions.length; i++) {
    const key = `${section.id}-${i}`;
    const raw = answers[key];
    if (raw === undefined || raw === null) return null; // unanswered

    const itemNumber = i + 1; // 1-indexed
    const isReverse = section.reverseItems.includes(itemNumber);
    const adjusted = isReverse ? 4 - raw : raw;
    sum += adjusted;
  }
  return sum;
}

/**
 * Calculate the percentile for a section.
 * percentile = (rawSum / maxTotal) * 100 — rounded to 1 decimal.
 */
export function calculatePercentile(rawSum, maxTotal) {
  return Math.round(((rawSum / maxTotal) * 100) * 10) / 10;
}

/**
 * Interpret a percentile score.
 */
export function interpretPercentile(pct) {
  if (pct <= 25) return "Minimal / Normal";
  if (pct <= 50) return "Mild / Moderate";
  if (pct <= 75) return "Severe";
  return "Extremely Severe";
}

/**
 * Get the CSS class for a severity level.
 */
export function severityClass(pct) {
  if (pct <= 25) return "severity-minimal";
  if (pct <= 50) return "severity-mild";
  if (pct <= 75) return "severity-severe";
  return "severity-extreme";
}

/**
 * Full scoring pipeline.
 * Returns null when any answer is missing, otherwise an object per section.
 */
export function scoreSection(answers, section) {
  const rawSum = calculateRawSum(answers, section);
  if (rawSum === null) return null;
  const percentile = calculatePercentile(rawSum, section.maxTotal);
  const interpretation = interpretPercentile(percentile);
  return { rawSum, percentile, interpretation, sectionTitle: section.title };
}
