from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uuid
from ..agents.orchestrator import OrchestratorAgent
from ..database.connection import test_connection

app = FastAPI(title="E-commerce RAG Agent API", version="1.0.0")

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the orchestrator agent
agent = OrchestratorAgent()

# In-memory session storage (use Redis in production)
sessions = {}

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    conversation_id: str

@app.on_event("startup")
async def startup_event():
    """Test database connection on startup"""
    if not test_connection():
        raise Exception("Failed to connect to database")
    print("API server started successfully!")

@app.get("/")
async def root():
    return {"message": "E-commerce RAG Agent API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected" if test_connection() else "disconnected"}

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Main chat endpoint for conversational product search"""
    try:
        # Generate or use existing conversation ID
        conversation_id = request.conversation_id or str(uuid.uuid4())
        
        # Initialize session if new
        if conversation_id not in sessions:
            sessions[conversation_id] = {"history": []}
        
        # Add user message to history
        sessions[conversation_id]["history"].append({
            "role": "user",
            "content": request.message
        })
        
        # Get agent response
        response = agent.chat(request.message)
        
        # Add agent response to history
        sessions[conversation_id]["history"].append({
            "role": "assistant",
            "content": response
        })
        
        return ChatResponse(
            response=response,
            conversation_id=conversation_id
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/conversations/{conversation_id}")
async def get_conversation(conversation_id: str):
    """Get conversation history"""
    if conversation_id not in sessions:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    return sessions[conversation_id]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)