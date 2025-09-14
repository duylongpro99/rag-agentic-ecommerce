from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from contextlib import asynccontextmanager
import logging
from agentic.utils.get_env import get_env
from sqlalchemy.orm import Session
from agentic.agents.orchestrator import OrchestratorAgent
from agentic.database.connection import test_connection, get_db
from agentic.database.models import Conversation, Message, User

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    runtime_env = get_env("RUNTIME_ENVIRONMENT")
    print(f"Runtime: {runtime_env}")
    if not test_connection():
        raise Exception("Failed to connect to database")
    print("API server started successfully!")
    yield
    # Shutdown
    print("API server shutting down...")

app = FastAPI(title="E-commerce RAG Agent API", version="1.0.0", lifespan=lifespan)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
    conversation_id: str
    user_id: str

class ChatResponse(BaseModel):
    response: str
    conversation_id: int

class MessageModel(BaseModel):
    role: str
    content: str
    created_at: Optional[str] = None

class ConversationModel(BaseModel):
    id: int
    title: str
    messages: List[MessageModel]



@app.get("/")
async def root():
    return {"message": "E-commerce RAG Agent API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected" if test_connection() else "disconnected"}

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest, db: Session = Depends(get_db)):
    """Main chat endpoint for conversational product search"""
    try:
        # Get or create conversation
        if request.conversation_id:
            # Get existing conversation
            conversation = db.query(Conversation).filter(
                Conversation.id == request.conversation_id,
                Conversation.user_id == request.user_id,
                Conversation.is_active == True
            ).first()
            
            if not conversation:
                raise HTTPException(status_code=404, detail="Conversation not found")
        else:
            # Create new conversation with a title based on the first message
            title = request.message[:50] + "..." if len(request.message) > 50 else request.message
            conversation = Conversation(
                user_id=request.user_id,
                title=title,
                is_active=True
            )
            db.add(conversation)
            db.commit()
            db.refresh(conversation)
        
        # Add user message to database
        # user_message = Message(
        #     conversation_id=conversation.id,
        #     content=request.message,
        #     role="user"
        # )
        # db.add(user_message)
        # db.commit()
        
        # Get agent response
        response = agent.chat(request.message)
        
        # Add assistant message to database
        # assistant_message = Message(
        #     conversation_id=conversation.id,
        #     content=response,
        #     role="assistant"
        # )
        # db.add(assistant_message)
        # db.commit()
        
        return ChatResponse(
            response=response,
            conversation_id=conversation.id
        )
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/conversations/{conversation_id}", response_model=ConversationModel)
async def get_conversation(conversation_id: int, user_id: str, db: Session = Depends(get_db)):
    """Get conversation history"""
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == user_id
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    messages = db.query(Message).filter(
        Message.conversation_id == conversation_id,
        Message.deleted_at == None
    ).order_by(Message.created_at).all()
    
    return ConversationModel(
        id=conversation.id,
        title=conversation.title,
        messages=[MessageModel(
            role=message.role,
            content=message.content,
            created_at=message.created_at.isoformat() if message.created_at else None
        ) for message in messages]
    )

@app.get("/conversations", response_model=List[ConversationModel])
async def list_conversations(user_id: str, db: Session = Depends(get_db)):
    """List all conversations for a user"""
    conversations = db.query(Conversation).filter(
        Conversation.user_id == user_id,
        Conversation.is_active == True,
        Conversation.deleted_at == None
    ).order_by(Conversation.updated_at.desc()).all()
    
    result = []
    for conversation in conversations:
        messages = db.query(Message).filter(
            Message.conversation_id == conversation.id,
            Message.deleted_at == None
        ).order_by(Message.created_at).all()
        
        result.append(ConversationModel(
            id=conversation.id,
            title=conversation.title,
            messages=[MessageModel(
                role=message.role,
                content=message.content,
                created_at=message.created_at.isoformat() if message.created_at else None
            ) for message in messages]
        ))
    
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)