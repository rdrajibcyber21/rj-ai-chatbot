import requests
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    text: str

# 👉 Ollama function
def get_bot_response(user_input):
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama3",
                "prompt": user_input,
                "stream": False
            }
        )

        data = response.json()
        return data.get("response", "No response")

    except Exception as e:
        print("ERROR:", e)
        return "AI server not running"

@app.post("/chat")
def chat(message: Message):
    return {"response": get_bot_response(message.text)}