# EEG Mental Wellness App

A modern full-stack web application that combines a React/Vite frontend with an AI mental wellness coach powered by Flask, LangChain, and Groq. This platform unifies digital psychometric profiling with neuro-clinical machine learning foundations to create an objective, scalable mental health triage screening system.

## 📋 Table of Contents

* [Overview & Core Features](https://www.google.com/search?q=%23-overview--core-features)
* [Application Demonstration](https://www.google.com/search?q=%23-application-demonstration)
* [Diagnostic Dataset Description](https://www.google.com/search?q=%23-diagnostic-dataset-description)
* [Fork or Clone the Repository](https://www.google.com/search?q=%231-fork-or-clone-the-repository)
* [Prerequisites](https://www.google.com/search?q=%232-prerequisites)
* [Install Dependencies](https://www.google.com/search?q=%233-install-dependencies)
* [Run the Application](https://www.google.com/search?q=%234-run-the-application)
* [Alternative Manual Start](https://www.google.com/search?q=%235-alternative-manual-start)
* [Build for Production](https://www.google.com/search?q=%236-build-for-production)
* [Project Structure](https://www.google.com/search?q=%237-project-structure)
* [Troubleshooting](https://www.google.com/search?q=%238-troubleshooting)
* [Contributing & Authors](https://www.google.com/search?q=%239-contributing--authors)
* [License](https://www.google.com/search?q=%2310-license)

---

## 🧠 Overview & Core Features

### 📡 Neurophysiological EEG Core

The system maps cortical brainwave dynamics across specific frequency bands utilizing the international 10-20 system framework. While designed to ingest wireless, consumer-grade EEG telemetry (e.g., Muse 2 or Emotiv hardware), the mathematical module tracks foundational biomarkers including:

* 
**Frontal Alpha Asymmetry (FAA):** Evaluates hemispheric power imbalances between left and right frontal lobes (F3 / F4) to mathematically gauge depressive traits.


* 
**Theta/Beta Ratio (TBR):** Monitored over central and prefrontal channels to track real-time cognitive fatigue, concentration drops, and attentional resources.


* 
**Attention Index:** Derives active mental engagement based on alpha wave suppression and alert beta activation.



### 📝 The Custom Psychometric Instrument: IMHMA

The frontend hosts the Integrated Mental Health Monitoring Assessment (IMHMA). The IMHMA unifies 5 gold-standard clinical scales (PHQ-9, GAD-7, ASRS v1.1, DASS-21, and PSS-10) into a single, cohesive 65-question intake. The system processes raw scores, adjusts for reverse-scored items , and scales four normalized target labels (0-100) mapped to specific severity ranges (Minimal, Mild/Moderate, Severe, Extremely Severe):

* 
**Section 1: Emotional Wellbeing** → Depression target label.


* 
**Section 2: Calm & Resilience** → Anxiety target label.


* 
**Section 3: Handling Life's Pressures** → Perceived Stress target label.


* 
**Section 4: Focus & Concentration** → Attention Span / ADHD screening flag.



### 🤖 The Conversational AI Wellness Coach

Powered by Llama 3.3 70B Versatile via the low-latency Groq API and managed by LangChain, the coach reads structural assessment score inputs to provide personalized guidance. It adapts responses using conversation history context, suggests scannable self-care activities, and adheres to strict ethical guardrails that route acute user distress directly toward counselor references and helpline resources.

### 📊 LightGBM Diagnostic Engine

Housed in the processing folders, a Light Gradient Boosting Machine (LightGBM) framework stands ready to run binary screening classifications on multi-channel EEG signals. Trained on a 945-patient matrix, the pipeline isolates Absolute Power features, groups cognitive missing values , and implements Principal Component Analysis (PCA) to crush 1,026 correlated network coherence channels into 15 dense independent components without data leakage.

---

## 🖼️ Application Demonstration

### Holistic Wellbeing Portal & Intake Interface

The client-facing portal handles user enrollment and establishes our anonymous evaluation session pipeline.

![Main Page](Photo\Main.jpg)

### Dynamic Question Assessment Workspace

Interactive Likert choice architecture dynamically evaluates user parameters across all 65 cross-validated clinical stems.
![Questionare](Photo\Questionare.jpg)

### Real-Time Metric Severity Dashboard

Upon submission, the data transformation backend instantly evaluates individual domain raw scores and outputs mapped stratification levels.
![Assesment Score](Photo\Assesment_score.jpg)

### Conversational AI Wellness Coach Terminal

The stateful, session-aware agent processes user profiles via LangChain memory blocks to recommend custom lifestyle strategies.
![LLM](Photo\LLM.jpg)
---

## 📊 Diagnostic Dataset Description

The binary screening classification sub-system runs against a comprehensive **EEG Psychiatric Disorders Dataset** tracking High-Dimensional, Low-Sample-Size parameters:

### Cohort Distributions & Metadata Summary

* 
**Total Rows (Clinical Samples):** 945 entries.


* 
**Total Columns (Attributes):** 1,149 attributes spanning metadata, raw band metrics, and relational indicators.


* **Global Sex Demographics:** Male (M: 601) | Female (F: 344).



**Missing Values Security:** Missing demographic variables (`education`, `IQ`) are managed using **Grouped Median Imputation** mapped strictly inside the subject's primary disorder branch to prevent cross-contamination noise.



### Sample Counts by Clinical Branch Target

The primary target array is distributed across 7 core psychiatric profiles:

```text
Main Disorder Classification Category     Sample Count    Mean Age
──────────────────────────────────────────────────────────────────
Mood disorder                             266             30.9
Addictive disorder                        186             29.6
Trauma and stress related disorder        128             36.1
Schizophrenia                             117             31.7
Anxiety disorder                          107             29.0
Healthy control (Baseline Matrix Pool)     95              25.7
Obsessive compulsive disorder              46              28.5

```

### Neurophysiological Attribute Naming Convention

The 1,144 floating-point columns utilize a strict clinical naming architecture representing specific mathematical processing variables:

1. **Measurement Type Prefix:**
* 
`AB`: **Absolute Power** → Measures the microvolt voltage amplitude strength at a specific sensor location.


* 
`COH`: **Coherence** → Quantifies cross-spectral synchronization and connection properties between two target structural channels.




2. 
**Frequency Band Subscales:** Covers `delta`, `theta`, `alpha`, `beta`, `highbeta`, and `gamma`.


3. 
**Scalp Electrode Configuration Mapping:** Maps 19 separate hardware sensors based on the International 10-20 Standard (e.g., `FP1`, `F3`, `Cz`, `P8`, `O2`). Frontal decision markers use odd numbers for the left hemisphere and even numbers for the right hemisphere.



*Structural Code Mapping Examples:*

* 
`AB.A.delta.a.FP1` → Absolute power strength of slow delta sleep wave frequencies recorded at the Left Frontal Pole channel.


* 
`COH.F.gamma.l.T4.o.Pz` → Network sync connectivity signature calculated within the fast gamma band between the Right Temporal node and Midline Parietal site.



---

## 1. Fork or Clone the Repository

### Option A: Fork on GitHub

1. Open the repository on GitHub.
2. Click **Fork** in the top-right corner.
3. Choose your GitHub account as the destination.
4. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/EEG.git
cd EEG

```

### Option B: Clone Directly

```bash
git clone https://github.com/ORIGINAL_OWNER/EEG.git
cd EEG

```

---

## 2. Prerequisites

Make sure you have the following installed on your system:

* Node.js (recommended: 18 or later)
* Python 3.10+
* npm
* pip

You will also need a Groq API key.

Create a `.env` file inside `AIAgent/` with your key:

```env
GROQ_API_KEY=your_groq_api_key_here

```

---

## 3. Install Dependencies

### Frontend dependencies

```bash
npm install

```

### Backend dependencies

```bash
cd AIAgent
pip install flask flask-cors python-dotenv langchain-groq langchain-core
cd ..

```

---

## 4. Run the Application

The project is now set up so you can start both the frontend and AI backend together with one command:

```bash
npm run dev

```

This command will:

* start the Flask AI backend from `AIAgent/server.py`
* start the Vite frontend in your browser

### Default local URLs

* Frontend: http://localhost:5173 (or the next available Vite port)
* Backend: http://localhost:5001

---

## 5. Alternative Manual Start

If you want to run the two parts separately:

### Start the backend

```bash
cd AIAgent
python server.py

```

### Start the frontend

```bash
npm run dev

```

---

## 6. Build for Production

To create a production build of the frontend:

```bash
npm run build

```

---

## 7. Project Structure

```text
EEG/
├── AIAgent/          # Flask + AI coaching backend
├── model/            # EEG/model-related scripts (LightGBM configuration)
├── src/              # React/Vite frontend source files
├── public/           # Static assets
├── data/             # Datasets and documentation
└── package.json      # Frontend scripts and dependencies

```

---

## 8. Troubleshooting

### Port already in use

If port `5173` is busy, Vite will automatically switch to the next available port.

### Python or package errors

Try upgrading pip and reinstalling dependencies:

```bash
python -m pip install --upgrade pip

```

### API key not working

Make sure your `.env` file is placed in `AIAgent/` and contains a valid `GROQ_API_KEY`.

---

## 9. Contributing & Authors

### Core Engineering Developers

* **Rochan Awasthi ** : rochansawasthi@gmail.com
* **Sayali Bambal** : sayalibambal218@gmail.com
* **Devansh Paltewar** : devanshpaltewar2005@gmail.com

### Project Advisors & Institutional Mentors

* **Dr. Fr. Paul Chandrankunnel** — Director, SVPCET
* **Dr. Fr. Stanly Wilson** — Assistant Director, SVPCET
* **Dr. Vijay M. Wadhai** — Principal, SVPCET
* **Ms. Isha Suri** — Project Guide & Assistant Professor, SVPCET
* **Dr. Akshita Chanchlani** — Research Consultant
* **Dr. Minakshi Patil** — Research Consultant
* **Dr. Shweta Kanhere** — Research Consultant

---

## 10. License

This project is developed strictly for academic, research, and non-commercial educational purposes. Please check the repository license guidelines before attempting deployment in clinical healthcare settings.