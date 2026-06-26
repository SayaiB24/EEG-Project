// ─── DATA ───
const SECTIONS = [
  {
    id: 'section1',
    title: 'Section 1: Depression & Emotional State',
    timeframe: 'Timeframe: Past 2 weeks',
    headerClass: 's1',
    items: [
      'Little interest or pleasure in doing things',
      'Feeling down, depressed, or hopeless',
      'Trouble falling or staying asleep, or sleeping too much',
      'Feeling tired or having little energy',
      'Poor appetite or overeating',
      'Feeling bad about yourself or that you are a failure',
      'Trouble concentrating on things (e.g., reading or TV)',
      'Moving/speaking slowly, or being extremely restless',
      'Thoughts of self-harm or being better off dead',
      "Couldn't seem to experience any positive feeling at all",
      'Found it difficult to work up the initiative to do things',
      'Felt that you had nothing to look forward to',
      'Felt down-hearted and blue',
      'Unable to become enthusiastic about anything',
      "Felt you weren't worth much as a person",
      'Felt that life was meaningless'
    ],
    reverseItems: [],
    count: 16,
    maxTotal: 64
  },
  {
    id: 'section2',
    title: 'Section 2: Anxiety & Physiological Arousal',
    timeframe: 'Timeframe: Past 2 weeks',
    headerClass: 's2',
    items: [
      'Feeling nervous, anxious, or on edge',
      'Not being able to stop or control worrying',
      'Worrying too much about different things',
      'Trouble relaxing',
      'Being so restless that it is hard to sit still',
      'Becoming easily annoyed or irritated',
      'Feeling afraid as if something awful might happen',
      'Awareness of dryness of mouth',
      'Experiencing breathing difficulty without physical exertion',
      'Experiencing trembling (e.g., in the hands)',
      'Worried about situations where you might panic/make a fool of yourself',
      'Feeling close to panic',
      'Awareness of heart action/increased heart rate',
      'Feeling scared without any good reason'
    ],
    reverseItems: [],
    count: 14,
    maxTotal: 56
  },
  {
    id: 'section3',
    title: 'Section 3: Perception of Stress',
    timeframe: 'Timeframe: Past 1 month',
    headerClass: 's3',
    items: [
      'Being upset because of something that happened unexpectedly',
      'Feeling unable to control important things in life',
      'Feeling nervous and "stressed"',
      '(R) Feeling confident about ability to handle personal problems',
      '(R) Feeling that things were going your way',
      'Finding you could not cope with all the things you had to do',
      '(R) Being able to control irritations in your life',
      '(R) Feeling that you were on top of things',
      'Angered because of things outside of your control',
      'Feeling difficulties were piling up too high to overcome',
      'Found it hard to wind down',
      'Tended to over-react to situations',
      'Felt that you were using a lot of nervous energy',
      'Found yourself getting agitated',
      'Found it difficult to relax',
      'Intolerant of anything keeping you from your tasks',
      'Feeling rather touchy'
    ],
    reverseItems: [4, 5, 7, 8], // 1-indexed
    count: 17,
    maxTotal: 68
  },
  {
    id: 'section4',
    title: 'Section 4: Attention Span & ADHD Symptoms',
    timeframe: 'Timeframe: Past 6 months',
    headerClass: 's4',
    items: [
      'Trouble wrapping up final details of a project',
      'Difficulty getting things in order for organized tasks',
      'Problems remembering appointments or obligations',
      'Avoiding or delaying tasks that require a lot of thought',
      'Fidgeting or squirming when required to sit for long periods',
      'Feeling overly active, as if "driven by a motor"',
      'Making careless mistakes on boring/difficult projects',
      'Difficulty keeping attention on repetitive work',
      'Difficulty concentrating on what people say directly',
      'Misplace or have difficulty finding things',
      'Distracted by activity or noise around you',
      'Leaving your seat in situations where you should stay seated',
      'Feeling restless or fidgety',
      'Difficulty unwinding and relaxing',
      'Talking too much in social situations',
      'Finishing other people\'s sentences for them',
      'Difficulty waiting your turn',
      'Interrupting others when they are busy'
    ],
    reverseItems: [],
    count: 18,
    maxTotal: 72
  }
];

const SECTION_COLORS = {
  s1: '#3a7bd5',
  s2: '#6c5ce7',
  s3: '#00b894',
  s4: '#e17055'
};

// ─── RENDER ───
function renderSections() {
  const container = document.getElementById('sections-container');
  container.innerHTML = '';

  SECTIONS.forEach((section) => {
    const card = document.createElement('div');
    card.className = 'section-card';
    card.id = section.id;

    let questionsHTML = '';
    section.items.forEach((text, idx) => {
      const qNum = idx + 1;
      const isReverse = section.reverseItems.includes(qNum);
      const name = `${section.id}_q${qNum}`;

      let radioHTML = '';
      for (let v = 0; v <= 4; v++) {
        radioHTML += `
          <div class="radio-option">
            <input type="radio" id="${name}_${v}" name="${name}" value="${v}">
            <label for="${name}_${v}">${v}</label>
          </div>`;
      }

      questionsHTML += `
        <div class="question-row" data-name="${name}">
          <div class="q-text">
            <span class="q-number">${qNum}.</span>${text}${isReverse ? '<span class="q-reverse">Reverse</span>' : ''}
          </div>
          <div class="radio-group">${radioHTML}</div>
        </div>`;
    });

    card.innerHTML = `
      <div class="section-header ${section.headerClass}">
        <h2>${section.title}</h2>
        <div class="timeframe">${section.timeframe} &nbsp;|&nbsp; ${section.count} items &nbsp;|&nbsp; Max score: ${section.maxTotal}</div>
      </div>
      <div class="section-body">${questionsHTML}</div>`;

    container.appendChild(card);
  });
}

// ─── INTERPRETATION ───
function getInterpretation(percentile) {
  if (percentile <= 25) return { label: 'Minimal / Normal', cls: 'severity-minimal' };
  if (percentile <= 50) return { label: 'Mild / Moderate', cls: 'severity-mild' };
  if (percentile <= 75) return { label: 'Severe', cls: 'severity-severe' };
  return { label: 'Extremely Severe', cls: 'severity-extreme' };
}

function getBarColor(percentile) {
  if (percentile <= 25) return '#38a169';
  if (percentile <= 50) return '#d69e2e';
  if (percentile <= 75) return '#e53e3e';
  return '#9b2c2c';
}

// ─── VALIDATION ───
function validateAll() {
  const unanswered = [];
  let firstUnanswered = null;

  SECTIONS.forEach((section) => {
    section.items.forEach((_, idx) => {
      const name = `${section.id}_q${idx + 1}`;
      const checked = document.querySelector(`input[name="${name}"]:checked`);
      if (!checked) {
        unanswered.push({ section: section.title, question: idx + 1, name });
        if (!firstUnanswered) firstUnanswered = name;
      }
    });
  });

  return { unanswered, firstUnanswered };
}

// ─── CALCULATE ───
function calculateScores() {
  const results = [];

  SECTIONS.forEach((section) => {
    let sum = 0;

    section.items.forEach((_, idx) => {
      const qNum = idx + 1;
      const name = `${section.id}_q${qNum}`;
      const checked = document.querySelector(`input[name="${name}"]:checked`);
      let raw = parseInt(checked.value, 10);

      // Reverse scoring for Section 3 items 4, 5, 7, 8
      if (section.reverseItems.includes(qNum)) {
        raw = 4 - raw;
      }

      sum += raw;
    });

    const maxPossible = section.count * 4;
    const percentile = parseFloat(((sum / maxPossible) * 100).toFixed(1));
    const interp = getInterpretation(percentile);

    results.push({
      title: section.title,
      headerClass: section.headerClass,
      rawSum: sum,
      maxTotal: section.maxTotal,
      percentile,
      interpretation: interp
    });
  });

  // Overall
  const avgPercentile = parseFloat(
    (results.reduce((acc, r) => acc + r.percentile, 0) / results.length).toFixed(1)
  );
  const overallInterp = getInterpretation(avgPercentile);

  return { sections: results, overall: { percentile: avgPercentile, interpretation: overallInterp } };
}

// ─── DISPLAY RESULTS ───
function displayResults(data) {
  const container = document.getElementById('results-container');
  container.innerHTML = '';

  const title = document.createElement('h2');
  title.className = 'results-title';
  title.textContent = '📊 Assessment Results';
  container.appendChild(title);

  data.sections.forEach((sec) => {
    const color = SECTION_COLORS[sec.headerClass] || '#3a7bd5';
    const card = document.createElement('div');
    card.className = 'result-card';
    card.innerHTML = `
      <div class="result-section-name">
        <span class="result-dot" style="background:${color}"></span>
        ${sec.title}
      </div>
      <div class="result-stats">
        <div class="result-stat">
          <div class="result-stat-label">Raw Score</div>
          <div class="result-stat-value">${sec.rawSum} <span style="font-size:0.8rem;font-weight:400;color:#718096">/ ${sec.maxTotal}</span></div>
        </div>
        <div class="result-stat">
          <div class="result-stat-label">Percentile</div>
          <div class="result-stat-value">${sec.percentile}%</div>
        </div>
        <div class="result-stat">
          <div class="result-stat-label">Interpretation</div>
          <div><span class="severity-badge ${sec.interpretation.cls}">${sec.interpretation.label}</span></div>
        </div>
      </div>
      <div class="result-bar-container">
        <div class="result-bar" style="background:${color}" data-width="${sec.percentile}"></div>
      </div>`;
    container.appendChild(card);
  });

  // Overall card
  const overallColor = getBarColor(data.overall.percentile);
  const overall = document.createElement('div');
  overall.className = 'result-card overall';
  overall.innerHTML = `
    <div class="result-section-name" style="justify-content:center;color:#fff;font-size:1.15rem;">
      Overall Assessment
    </div>
    <div class="result-stats">
      <div class="result-stat">
        <div class="result-stat-label">Average Percentile</div>
        <div class="result-stat-value">${data.overall.percentile}%</div>
      </div>
      <div class="result-stat" style="grid-column:span 2">
        <div class="result-stat-label">Overall Interpretation</div>
        <div><span class="severity-badge ${data.overall.interpretation.cls}">${data.overall.interpretation.label}</span></div>
      </div>
    </div>
    <div class="result-bar-container">
      <div class="result-bar" style="background:${overallColor}" data-width="${data.overall.percentile}"></div>
    </div>`;
  container.appendChild(overall);

  container.classList.add('visible');

  // Animate bars
  requestAnimationFrame(() => {
    setTimeout(() => {
      container.querySelectorAll('.result-bar').forEach((bar) => {
        bar.style.width = bar.dataset.width + '%';
      });
    }, 100);
  });

  container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─── MODAL ───
function showModal(title, message) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-message').textContent = message;
  document.getElementById('modal-overlay').classList.add('active');
}

function hideModal() {
  document.getElementById('modal-overlay').classList.remove('active');
}

// ─── EVENT LISTENERS ───
document.addEventListener('DOMContentLoaded', () => {
  renderSections();

  // Submit
  document.getElementById('btn-submit').addEventListener('click', () => {
    const { unanswered, firstUnanswered } = validateAll();

    if (unanswered.length > 0) {
      // Highlight unanswered questions
      document.querySelectorAll('.question-row').forEach((row) => row.classList.remove('unanswered-highlight'));

      unanswered.forEach((u) => {
        const row = document.querySelector(`.question-row[data-name="${u.name}"]`);
        if (row) row.classList.add('unanswered-highlight');
      });

      showModal(
        'Incomplete Assessment',
        `Please answer all questions before submitting. ${unanswered.length} question(s) remain unanswered.`
      );

      // Scroll to first unanswered
      const firstRow = document.querySelector(`.question-row[data-name="${firstUnanswered}"]`);
      if (firstRow) {
        firstRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Remove highlights
    document.querySelectorAll('.question-row').forEach((row) => row.classList.remove('unanswered-highlight'));

    const data = calculateScores();
    displayResults(data);
  });

  // Reset
  document.getElementById('btn-reset').addEventListener('click', () => {
    // Clear all radios
    document.querySelectorAll('input[type="radio"]').forEach((r) => (r.checked = false));
    // Clear name and date
    document.getElementById('field-name').value = '';
    document.getElementById('field-date').value = '';
    // Hide results
    const rc = document.getElementById('results-container');
    rc.classList.remove('visible');
    rc.innerHTML = '';
    // Remove highlights
    document.querySelectorAll('.question-row').forEach((row) => row.classList.remove('unanswered-highlight'));
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Modal dismiss
  document.getElementById('modal-close').addEventListener('click', hideModal);
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) hideModal();
  });

  // Clear highlight on answer
  document.addEventListener('change', (e) => {
    if (e.target.type === 'radio') {
      const row = e.target.closest('.question-row');
      if (row) row.classList.remove('unanswered-highlight');
    }
  });
});
