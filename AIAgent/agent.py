from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
import os

# ==========================================
# Load Environment Variables
# ==========================================
load_dotenv()

# ==========================================
# LLM
# ==========================================
llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0.6,
    max_tokens=2000
)

# ==========================================
# Helper Functions
# ==========================================

def get_score(name):
    while True:
        try:
            score = float(input(f"Enter {name} (0-100): "))
            if 0 <= score <= 100:
                return score
            print("Score must be between 0 and 100")
        except:
            print("Invalid input. Please enter a number.")

def get_level(score):
    if score <= 25:
        return "Minimal"
    elif score <= 50:
        return "Moderate"
    elif score <= 75:
        return "Severe"
    return "Extremely Severe"

# ==========================================
# Scores
# ==========================================

print("=== Mental Wellness Assessment ===\n")
depression = get_score("Depression")
anxiety = get_score("Anxiety")
stress = get_score("Stress")
attention = get_score("Attention")

scores = {
    "Depression": depression,
    "Anxiety": anxiety,
    "Stress": stress,
    "Attention Deficit": 100 - attention
}

primary_concern = max(scores, key=scores.get)

print("\n" + "="*60)
print("ASSESSMENT SUMMARY")
print("="*60)
print(f"Depression : {get_level(depression)} ({depression}%)")
print(f"Anxiety    : {get_level(anxiety)} ({anxiety}%)")
print(f"Stress     : {get_level(stress)} ({stress}%)")
print(f"Attention  : {attention}%")
print(f"Primary Concern : {primary_concern}")
print("="*60)

# ==========================================
# Dynamic Questions
# ==========================================

answers = {}

print("\nLet's understand your situation better.\n")

if primary_concern == "Attention Deficit":
    answers["study_hours"] = input("1. How many hours do you study daily? ")
    answers["main_distraction"] = input("2. What distracts you the most? (Mobile/Social Media/Noise/Thoughts/Other): ")
    answers["sleep_hours"] = input("3. How many hours do you sleep daily? ")
    answers["screen_time"] = input("4. Daily screen time in hours? ")
    answers["focus_method"] = input("5. Do you use any focus techniques (Pomodoro/Time Blocking/None)? ")

elif primary_concern == "Stress":
    answers["stress_source"] = input("1. Main source of stress? (Studies/Career/Family/Finance/Other): ")
    answers["overwhelmed"] = input("2. How often do you feel overwhelmed? ")
    answers["sleep_hours"] = input("3. How many hours do you sleep daily? ")
    answers["exercise"] = input("4. Do you exercise regularly? ")
    answers["stress_management"] = input("5. How do you currently manage stress? ")

elif primary_concern == "Anxiety":
    answers["overthinking"] = input("1. Do you often overthink? ")
    answers["nervousness"] = input("2. Do you feel nervous before exams/interviews? ")
    answers["racing_thoughts"] = input("3. How often do you experience racing thoughts? ")
    answers["relaxation"] = input("4. Do you practice relaxation techniques? ")
    answers["sleep_quality"] = input("5. How would you rate your sleep quality? ")

else:  # Depression
    answers["motivation"] = input("1. Do you struggle with motivation? ")
    answers["social_support"] = input("2. Do you have people you can talk to? ")
    answers["exercise"] = input("3. Do you exercise regularly? ")
    answers["sleep_hours"] = input("4. How many hours do you sleep daily? ")
    answers["hobbies"] = input("5. What activities do you enjoy? ")

# ==========================================
# Improved AI Coach Prompt
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
User's Background: {answers}

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
# Start Conversational Session
# ==========================================

print("\n" + "="*70)
print("WELLNESS COACHING SESSION")
print("="*70)

history = []

initial_input = {
    "depression": depression,
    "anxiety": anxiety,
    "stress": stress,
    "attention": attention,
    "level_depression": get_level(depression),
    "level_anxiety": get_level(anxiety),
    "level_stress": get_level(stress),
    "primary_concern": primary_concern,
    "answers": str(answers),
    "history": "This is the beginning of the conversation."
}

response = chain.invoke(initial_input)
print("\nCoach:", response.content)
history.append(f"Coach: {response.content}")

print("\n(Type 'exit', 'quit', or 'bye' to end)\n")

while True:
    user_input = input("You: ").strip()
    
    if user_input.lower() in ['exit', 'quit', 'bye', 'thank you']:
        print("\nCoach: Take care of yourself. You've already taken a positive step today. I'm here whenever you need to talk. 💙")
        break
    
    if not user_input:
        continue

    history.append(f"You: {user_input}")
    context_history = "\n".join(history[-8:])   # Keep recent context

    response = chain.invoke({
        "depression": depression,
        "anxiety": anxiety,
        "stress": stress,
        "attention": attention,
        "level_depression": get_level(depression),
        "level_anxiety": get_level(anxiety),
        "level_stress": get_level(stress),
        "primary_concern": primary_concern,
        "answers": str(answers),
        "history": context_history
    })
    
    print("\nCoach:", response.content)
    history.append(f"Coach: {response.content}")