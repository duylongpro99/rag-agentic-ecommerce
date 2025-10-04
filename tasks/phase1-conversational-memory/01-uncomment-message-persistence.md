# Task 01: Uncomment Message Persistence Code

## Description
Activate the existing message persistence infrastructure that's already implemented but commented out in the main API file.

## File Location
`agentic/api/main.py` (lines 100-118)

## Implementation Checklist

- [ ] Open `agentic/api/main.py`
- [ ] Locate lines 100-118 (commented message persistence code)
- [ ] Uncomment the message saving logic
- [ ] Verify the code connects to the database correctly
- [ ] Ensure User, Conversation, and Message models are imported
- [ ] Test that messages are persisted to PostgreSQL
- [ ] Verify conversation_id is properly tracked across requests
- [ ] Check that both user and assistant messages are saved

## Expected Outcome
Messages from chat sessions should be stored in the `messages` table linked to conversations.

## Testing
```bash
# Start the server
python -m uvicorn agentic.api.main:app --reload

# Send a chat request
curl -X POST http://localhost:8010/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Show me running shoes", "user_id": 1}'

# Verify in database
npm run studio  # Check messages table
```

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
