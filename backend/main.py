from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS (important for frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class Message(BaseModel):
    text: str

# Smart chatbot logic (Option 1)
def get_bot_response(user_input):
    user_input = user_input.lower()

    if "ai" in user_input:
        return "AI (Artificial Intelligence) is technology that allows machines to think, learn, and make decisions like humans."

    elif "hello" in user_input or "hi" in user_input:
        return "Hello! 👋 How can I help you today?"

    elif "name" in user_input:
        return "I am your personal AI assistant 🤖"

    elif "how are you" in user_input:
        return "I'm doing great! Thanks for asking 😊"

    elif "cyber" in user_input:
        return "Cybersecurity is about protecting systems, networks, and data from digital attacks."

    elif "study" in user_input:
        return "Stay consistent, practice daily, and focus on understanding concepts instead of memorizing."

    else:
        return "That's interesting! Tell me more 🙂"

# API route
@app.post("/chat")
def chat(message: Message):
    response = get_bot_response(message.text)
    return {"response": response}