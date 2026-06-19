from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
import os

# ==========================================
# Load Environment Variables
# ==========================================
load_dotenv()

app = Flask(__name__)
CORS(app)  # Allow React dev server to call this API

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 3001))
    app.run(host="0.0.0.0", port=port)

# ==========================================
# LLM Setup
# ==========================================
llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0.6,
    max_tokens=2000
)

# ==========================================
# Helper Functions (shared with agent.py)
# ==========================================

def get_level(score):
    if score <= 25:
        return "Minimal"
    elif score <= 50:
        return "Moderate"
    elif score <= 75:
        return "Severe"
    return "Extremely Severe"

def get_primary_concern(scores_dict):
    return max(scores_dict, key=scores_dict.get)

def get_followup_questions(primary_concern):
    """Return the 5 dynamic follow-up questions for the primary concern."""
    if primary_concern == "Attention Deficit":
        return [
            "How many hours do you study daily?",
            "What distracts you the most? (Mobile / Social Media / Noise / Thoughts / Other)",
            "How many hours do you sleep daily?",
            "What is your daily screen time in hours?",
            "Do you use any focus techniques? (Pomodoro / Time Blocking / None)"
        ]
    elif primary_concern == "Stress":
        return [
            "What is your main source of stress? (Studies / Career / Family / Finance / Other)",
            "How often do you feel overwhelmed?",
            "How many hours do you sleep daily?",
            "Do you exercise regularly?",
            "How do you currently manage stress?"
        ]
    elif primary_concern == "Anxiety":
        return [
            "Do you often overthink situations?",
            "Do you feel nervous before exams or interviews?",
            "How often do you experience racing thoughts?",
            "Do you practice any relaxation techniques?",
            "How would you rate your sleep quality?"
        ]
    else:  # Depression
        return [
            "Do you struggle with motivation day-to-day?",
            "Do you have people you can talk to for support?",
            "Do you exercise regularly?",
            "How many hours do you sleep daily?",
            "What activities do you enjoy or used to enjoy?"
        ]

# ==========================================
# LLM Prompt
# ==========================================

prompt = ChatPromptTemplate.from_template("""
You are an empathetic, warm, and practical AI Mental Wellness Coach. 
Speak like a caring, experienced therapist who gives clear, actionable guidance.

=== USER CONTEXT ===
Assessment Results:
- Depression: {depression}% ({level_depression})
- Anxiety: {anxiety}% ({level_anxiety})
- Stress: {stress}% ({level_stress})
- Attention: {attention}%
Primary Concern: {primary_concern}
User's Background Answers: {answers}

=== CONVERSATION HISTORY ===
{history}

=== CRITICAL SAFETY DIRECTIVE ===
If the user mentions self-harm, wanting to die, or severe hopelessness in their background or messages, YOU MUST prioritize their safety. Acknowledge their pain deeply and gently encourage them to seek immediate professional help, talk to a loved one, or contact a crisis hotline.

=== CORE GUIDELINES & LOGIC ===
Keep responses between 150-280 words. Be hopeful, non-judgmental, and supportive. Focus strongly on the Primary Concern.

Analyze the Conversation History and follow the correct path below:

PATH A: If the user explicitly asks for a specific tool (e.g., "7 day plan", "remedies", "meditation", "help me focus"):
- DO NOT offer a menu of options.
- IMMEDIATELY provide the specific plan, routine, or remedy they asked for using bullet points or numbered lists.
- End by asking a single question about how they feel about trying this specific plan.

PATH B: If the user is just starting, asking for general help, or venting:
1. Empathetically acknowledge their feelings (1-2 sentences).
2. Provide a short insight based on their answers.
3. Offer 2-3 clear options of how you can help (e.g., a 7-day schedule, breathing exercises, motivational support).
4. End with a direct question asking which of those specific options they want to explore.
""")

chain = prompt | llm

# ==========================================
# API Routes
# ==========================================

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": "llama-3.3-70b-versatile"})


@app.route("/api/start", methods=["POST"])
def start_session():
    """
    Called when results are shown. Initialises the coaching session.
    Body: { depression, anxiety, stress, attention, answers }
    Returns: { message, primaryConcern, questions }
    """
    data = request.get_json()

    depression = float(data.get("depression", 0))
    anxiety    = float(data.get("anxiety", 0))
    stress     = float(data.get("stress", 0))
    attention  = float(data.get("attention", 0))
    answers    = data.get("answers", {})   # questionnaire answers from the web form

    scores = {
        "Depression":       depression,
        "Anxiety":          anxiety,
        "Stress":           stress,
        "Attention Deficit": 100 - attention,
    }
    primary_concern = get_primary_concern(scores)
    questions       = get_followup_questions(primary_concern)

    try:
        response = chain.invoke({
            "depression":       depression,
            "anxiety":          anxiety,
            "stress":           stress,
            "attention":        attention,
            "level_depression": get_level(depression),
            "level_anxiety":    get_level(anxiety),
            "level_stress":     get_level(stress),
            "primary_concern":  primary_concern,
            "answers":          str(answers),
            "history":          "This is the beginning of the conversation."
        })
        return jsonify({
            "message":        response.content,
            "primaryConcern": primary_concern,
            "questions":      questions
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/chat", methods=["POST"])
def chat():
    """
    Multi-turn chat endpoint.
    Body: { message, history (list of strings), depression, anxiety, stress, attention, answers }
    Returns: { reply }
    """
    data = request.get_json()

    depression = float(data.get("depression", 0))
    anxiety    = float(data.get("anxiety", 0))
    stress     = float(data.get("stress", 0))
    attention  = float(data.get("attention", 0))
    answers    = data.get("answers", {})
    history    = data.get("history", [])   # list of "You: ..." / "Coach: ..." strings
    user_msg   = data.get("message", "")

    scores = {
        "Depression":       depression,
        "Anxiety":          anxiety,
        "Stress":           stress,
        "Attention Deficit": 100 - attention,
    }
    primary_concern = get_primary_concern(scores)

    history_str = "\n".join(history[-8:])  # Keep last 8 turns for context

    try:
        response = chain.invoke({
            "depression":       depression,
            "anxiety":          anxiety,
            "stress":           stress,
            "attention":        attention,
            "level_depression": get_level(depression),
            "level_anxiety":    get_level(anxiety),
            "level_stress":     get_level(stress),
            "primary_concern":  primary_concern,
            "answers":          str(answers),
            "history":          history_str
        })
        return jsonify({"reply": response.content})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==========================================
# Run
# ==========================================
if __name__ == "__main__":
    print("=" * 60)
    print("  Mental Wellness AI Coach — Flask Backend")
    print("  Running on http://localhost:5001")
    print("=" * 60)
    app.run(host="0.0.0.0", port=5001, debug=True)
