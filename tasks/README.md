# E-commerce RAG System - Feature Implementation Tasks

This directory contains detailed task breakdowns for implementing 5 major features to strengthen the e-commerce conversational AI server.

## 📁 Directory Structure

```
tasks/
├── phase1-conversational-memory/     # 7 tasks
├── phase2a-multi-aspect-embeddings/  # 9 tasks
├── phase2b-intelligence-layer/       # 7 tasks
├── phase3a-explainable-ai/          # 6 tasks
├── phase3b-multi-agent-workflows/   # 12 tasks
└── README.md (this file)
```

## 📊 Task Summary

**Total Tasks: 49**
- Phase 1: 7 tasks
- Phase 2A: 9 tasks
- Phase 2B: 7 tasks
- Phase 3A: 6 tasks
- Phase 3B: 12 tasks

## 🎯 Implementation Roadmap

### Phase 1: Multi-Turn Conversational Memory (Weeks 1-2)
**Priority: HIGHEST** - Unlocks conversational AI capabilities

1. ✅ Uncomment message persistence
2. ✅ Update AgentState with conversation fields
3. ✅ Create PreferenceExtractor tool
4. ✅ Implement extraction logic
5. ✅ Add context re-ranking node
6. ✅ Update LangGraph workflow
7. ✅ Test multi-turn conversations

**Expected Outcome:** Users can say "show me cheaper ones" and system remembers context.

---

### Phase 2A: Multi-Aspect Embeddings (Weeks 3-4)
**Priority: HIGH** - Core search improvement (40-60% accuracy boost)

1. ✅ Design multi-aspect embedding schema
2. ✅ Create database migration
3. ✅ Apply migration
4. ✅ Update embedding generation logic
5. ✅ Re-ingest all products
6. ✅ Create QueryIntentClassifier
7. ✅ Implement aspect weight logic
8. ✅ Update semantic search with fusion
9. ✅ Integrate into orchestrator
10. ✅ A/B test vs baseline

**Expected Outcome:** "Waterproof running shoes" prioritizes usage-aspect matching.

---

### Phase 2B: Intelligence Layer (Weeks 3-5, parallel with 2A)
**Priority: HIGH** - Business intelligence & conversion optimization

1. ✅ Add intelligence models to schema
2. ✅ Create and apply migration
3. ✅ Create ProductIntelligenceTool
4. ✅ Implement enrichment logic
5. ✅ Add to orchestrator workflow
6. ✅ Update response generation
7. ✅ Create background worker (optional)

**Expected Outcome:** Responses show "20% below average price" and "trending" badges.

---

### Phase 3A: Explainable AI (Weeks 6-7)
**Priority: MEDIUM** - Trust & transparency

1. ✅ Add provenance tracking
2. ✅ Implement confidence scoring
3. ✅ Create supporting quotes extractor
4. ✅ Update response with explanations
5. ✅ Add confidence warnings
6. ✅ Create SearchAudit model (optional)

**Expected Outcome:** Results show confidence scores and explain WHY products match.

---

### Phase 3B: Multi-Agent Research Workflows (Weeks 7-8)
**Priority: MEDIUM** - Advanced differentiation features

1. ✅ Create ComparisonAgent
2. ✅ Implement compare_products method
3. ✅ Implement pros/cons generation
4. ✅ Create ResearchAgent
5. ✅ Implement research workflow
6. ✅ Implement plan generation
7. ✅ Create SpecExtractorTool
8. ✅ Define spec schemas
9. ✅ Update orchestrator analysis
10. ✅ Add specialized nodes
11. ✅ Update routing logic
12. ✅ Design comparison templates
13. ✅ Test comparison queries
14. ✅ Test research queries

**Expected Outcome:** "Compare iPhone 15 vs Samsung S24" generates structured comparison.

---

## 📝 How to Use These Tasks

Each task file contains:

- **Description**: What the task accomplishes
- **File Location**: Where to implement code
- **Implementation Checklist**: Step-by-step subtasks
- **Code Templates**: Starter code and examples
- **Testing Instructions**: How to verify it works
- **Status Tracking**: Checkboxes for progress

### Working on a Task

1. Navigate to the phase folder (e.g., `phase1-conversational-memory/`)
2. Open the task file (e.g., `01-uncomment-message-persistence.md`)
3. Follow the implementation checklist
4. Use the code templates as starting points
5. Run the testing instructions
6. Check off completed items
7. Mark task as complete when all checkboxes are done

### Tracking Progress

Each task has a status section at the bottom:

```markdown
## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
```

Mark items complete as you progress through implementation, testing, and deployment.

---

## 🚀 Quick Start Guide

### For Phase 1 (Start Here)

```bash
# 1. Read the overview
cat tasks/phase1-conversational-memory/01-uncomment-message-persistence.md

# 2. Make the code changes as described

# 3. Test
python -m uvicorn agentic.api.main:app --reload
# (Then test via API)

# 4. Move to next task
cat tasks/phase1-conversational-memory/02-update-agent-state.md
```

### For Database Changes (Phase 2A, 2B)

```bash
# Always backup first!
pg_dump -U postgres ecommerce > backup.sql

# Then follow migration tasks
cd database
npm run migrate:create
# ... follow task instructions
```

### For Testing (All Phases)

Each phase has dedicated testing tasks:
- Phase 1: `07-test-multi-turn.md`
- Phase 2A: `09-ab-test.md`
- Phase 3B: `11-test-comparison-queries.md`, `12-test-research-queries.md`

---

## 📈 Success Metrics

### Phase 1 Success
- [ ] Conversation history persisted in database
- [ ] User preferences extracted from past turns
- [ ] Search results re-ranked based on context
- [ ] Multi-turn test scenarios pass

### Phase 2A Success
- [ ] Multi-aspect embeddings generated for all products
- [ ] Query classification working (usage/features/description)
- [ ] Weighted fusion search implemented
- [ ] A/B test shows >20% relevance improvement

### Phase 2B Success
- [ ] Intelligence tables populated
- [ ] Stock, price, trend data enriching results
- [ ] Responses show intelligence badges
- [ ] Background worker running (if implemented)

### Phase 3A Success
- [ ] Provenance metadata on all results
- [ ] Confidence scores calculated
- [ ] Supporting quotes extracted
- [ ] Low-confidence warnings displayed

### Phase 3B Success
- [ ] Comparison queries work for 2-4 products
- [ ] Research queries execute multi-step plans
- [ ] Pros/cons generated for comparisons
- [ ] Spec extraction working for major categories

---

## 🔧 Troubleshooting

### Common Issues

**Database migrations fail:**
- Check PostgreSQL is running
- Verify connection string in .env
- Ensure pgvector extension is installed

**LLM responses malformed:**
- Check GOOGLE_API_KEY is valid
- Verify LLM model is accessible
- Add retry logic with error handling

**Tests failing:**
- Check all dependencies installed
- Verify database has test data
- Review task prerequisites completed

**Performance issues:**
- Add caching for LLM calls
- Optimize database queries
- Use batch operations

---

## 📚 Additional Resources

### Documentation
- Main project docs: `CLAUDE.md`
- Architecture details: See architecture-innovator analysis
- Database schema: `database/schema.prisma`

### Key Files to Reference
- Orchestrator: `agentic/agents/orchestrator.py`
- Semantic Search: `agentic/tools/semantic_search.py`
- API Endpoints: `agentic/api/main.py`
- Database Models: `agentic/database/models.py`

### Testing
- Test all changes locally before production
- Use Prisma Studio to inspect database: `npm run studio`
- Monitor logs during development: `tail -f logs/app.log`

---

## 🎯 Development Tips

1. **Start with Phase 1** - It unlocks the most value fastest
2. **Complete tasks in order** - They build on each other
3. **Test thoroughly** - Each task has specific test scenarios
4. **Commit often** - Use git to checkpoint progress
5. **Document changes** - Update CLAUDE.md as you go
6. **Ask for help** - Reference the detailed task files when stuck

---

## 📞 Support

If you encounter issues:
1. Check the specific task file for troubleshooting tips
2. Review code templates and examples
3. Verify prerequisites from earlier tasks are complete
4. Test with minimal examples before full integration

---

**Good luck with the implementation! 🚀**

Each completed phase significantly strengthens your e-commerce AI system.
