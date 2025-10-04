# Task 02: Update AgentState TypedDict

## Description
Extend the AgentState TypedDict to include conversation history and extracted user preferences for context-aware processing.

## File Location
`agentic/agents/orchestrator.py`

## Implementation Checklist

- [ ] Locate the `AgentState` TypedDict definition
- [ ] Add `conversation_history: List[Dict[str, str]]` field
- [ ] Add `extracted_preferences: Dict[str, Any]` field
- [ ] Import necessary types (List, Dict, Any from typing)
- [ ] Update any existing state initialization to include new fields
- [ ] Ensure backward compatibility with existing nodes
- [ ] Add default values for new fields (empty list/dict)
- [ ] Update docstrings to document new fields

## Code Template
```python
from typing import TypedDict, Annotated, List, Dict, Any

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    user_query: str
    conversation_history: List[Dict[str, str]]  # NEW: Last N conversation turns
    extracted_preferences: Dict[str, Any]       # NEW: User preferences
    search_results: str
    final_response: str
    thinks: List[str]
```

## Expected Outcome
AgentState now supports conversational context across multiple turns.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
