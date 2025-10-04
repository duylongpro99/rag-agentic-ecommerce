# Task 07: Test Multi-Turn Conversations

## Description
Comprehensive testing of the multi-turn conversational memory system to ensure context retention works correctly.

## Implementation Checklist

### Basic Functionality Tests
- [ ] Test single-turn conversation (baseline)
- [ ] Test two-turn conversation with context reference
- [ ] Test conversation with preference mentioned in turn 1, used in turn 3
- [ ] Test conversation with brand preference extraction
- [ ] Test conversation with price range preference
- [ ] Test conversation with feature requirements

### Test Scenarios

#### Scenario 1: Brand Preference
- [ ] Turn 1: "Show me running shoes"
- [ ] Turn 2: "I prefer Nike"
- [ ] Turn 3: "Show me cheaper options"
- [ ] Expected: Turn 3 results prioritize Nike brand

#### Scenario 2: Price Refinement
- [ ] Turn 1: "Show me laptops"
- [ ] Turn 2: "Under $1000 please"
- [ ] Turn 3: "Show me more options"
- [ ] Expected: Turn 3 results stay under $1000

#### Scenario 3: Feature Addition
- [ ] Turn 1: "Looking for headphones"
- [ ] Turn 2: "They need to be waterproof"
- [ ] Turn 3: "What about wireless ones?"
- [ ] Expected: Results have both waterproof AND wireless

#### Scenario 4: Product Rejection
- [ ] Turn 1: "Show me phones"
- [ ] Turn 2: "Not interested in the iPhone 15"
- [ ] Turn 3: "Show me other options"
- [ ] Expected: iPhone 15 not in turn 3 results

### Database Verification
- [ ] Verify messages are saved with correct conversation_id
- [ ] Verify user_id is properly tracked
- [ ] Check message ordering in database
- [ ] Verify conversation timestamps

### API Testing
```bash
# Test script
curl -X POST http://localhost:8010/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Show me running shoes", "user_id": 1, "conversation_id": null}'

# Save conversation_id from response

curl -X POST http://localhost:8010/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "I prefer Nike", "user_id": 1, "conversation_id": "saved_id"}'

curl -X POST http://localhost:8010/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Show me cheaper ones", "user_id": 1, "conversation_id": "saved_id"}'
```

### Performance Tests
- [ ] Test with 10+ turn conversations
- [ ] Measure preference extraction latency
- [ ] Measure re-ranking overhead
- [ ] Check memory usage with large history

### Edge Cases
- [ ] Empty conversation history
- [ ] Contradictory preferences in same conversation
- [ ] Very long messages
- [ ] Special characters in preferences
- [ ] Multiple users in same conversation (error handling)

## Expected Outcome
All multi-turn conversation scenarios work correctly with proper context retention.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
