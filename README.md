# EEG Mental Wellness App

A modern full-stack web application that combines a React/Vite frontend with an AI mental wellness coach powered by Flask and Groq.

## Overview

This project includes:
- A responsive React frontend for the user experience
- An AI coaching backend in `AIAgent/server.py`
- EEG/mental wellness analysis support through the `model/` and `data/` folders

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
- Node.js (recommended: 18 or later)
- Python 3.10+
- npm
- pip

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
- start the Flask AI backend from `AIAgent/server.py`
- start the Vite frontend in your browser

### Default local URLs
- Frontend: http://localhost:5173 (or the next available Vite port)
- Backend: http://localhost:5001

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
├── model/            # EEG/model-related scripts
├── src/              # React frontend source files
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

## 9. Contributing

If you want to contribute:
1. Fork the repository
2. Create a new branch
3. Make your changes
4. Commit and push
5. Open a pull request

---

## 10. License

This project is for educational and research purposes. Please check the repository license before commercial use.
