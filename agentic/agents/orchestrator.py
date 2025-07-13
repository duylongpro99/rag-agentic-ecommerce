from typing import Dict, Any, List
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from typing_extensions import Annotated, TypedDict
import json
from agentic.tools.semantic_search import SemanticSearchTool
from agentic.tools.structured_filter import StructuredFilterTool

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    user_query: str
    search_results: str
    final_response: str

class OrchestratorAgent:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            temperature=0.1
        )
        self.semantic_search = SemanticSearchTool()
        self.structured_filter = StructuredFilterTool()
        self.graph = self._build_graph()
    
    def _build_graph(self):
        """Build the LangGraph workflow"""
        workflow = StateGraph(AgentState)
        
        # Add nodes
        workflow.add_node("analyze_query", self._analyze_query)
        workflow.add_node("semantic_search", self._semantic_search)
        workflow.add_node("structured_filter", self._structured_filter)
        workflow.add_node("generate_response", self._generate_response)
        
        # Add edges
        workflow.set_entry_point("analyze_query")
        workflow.add_conditional_edges(
            "analyze_query",
            self._route_query,
            {
                "semantic": "semantic_search",
                "structured": "structured_filter",
                "both": "semantic_search"
            }
        )
        workflow.add_edge("semantic_search", "generate_response")
        workflow.add_edge("structured_filter", "generate_response")
        workflow.add_edge("generate_response", END)
        
        return workflow.compile()
    
    def _analyze_query(self, state: AgentState) -> AgentState:
        """Analyze the user query to determine search strategy"""
        query = state["user_query"]
        
        analysis_prompt = f"""
        Analyze this user query and determine the best search approach:
        Query: "{query}"
        
        Choose one:
        - "semantic" for natural language descriptions (e.g., "comfortable shoes for running")
        - "structured" for specific filters (e.g., "Nike shoes under $100")
        - "both" for mixed queries
        
        Respond with just the strategy name.
        """
        
        response = self.llm.invoke(analysis_prompt)
        strategy = response.content.strip().lower()
        
        state["search_strategy"] = strategy
        return state
    
    def _route_query(self, state: AgentState) -> str:
        """Route to appropriate search method"""
        return state.get("search_strategy", "semantic")
    
    def _semantic_search(self, state: AgentState) -> AgentState:
        """Perform semantic search"""
        query = state["user_query"]
        results = self.semantic_search(query)
        state["search_results"] = results
        return state
    
    def _structured_filter(self, state: AgentState) -> AgentState:
        """Perform structured filtering"""
        query = state["user_query"]
        
        # Extract filters from query using LLM
        filter_prompt = f"""
        Extract structured filters from this query: "{query}"
        
        Return a JSON object with these possible keys (only include if mentioned):
        - brand: string
        - category: string
        - min_price: number
        - max_price: number
        - name_contains: string
        
        Example: {{"brand": "Nike", "max_price": 100}}
        """
        
        response = self.llm.invoke(filter_prompt)
        try:
            filters = json.loads(response.content)
            results = self.structured_filter(filters)
        except:
            # Fallback to semantic search if parsing fails
            results = self.semantic_search(query)
        
        state["search_results"] = results
        return state
    
    def _generate_response(self, state: AgentState) -> AgentState:
        """Generate final response to user"""
        query = state["user_query"]
        search_results = state["search_results"]
        
        response_prompt = f"""
        You are a helpful e-commerce assistant. Based on the user's query and search results, 
        provide a friendly and informative response.
        
        User Query: "{query}"
        Search Results: {search_results}
        
        Provide a conversational response that:
        1. Acknowledges the user's request
        2. Presents the found products clearly
        3. Offers additional help if needed
        
        Keep it concise but helpful.
        """
        
        response = self.llm.invoke(response_prompt)
        state["final_response"] = response.content
        return state
    
    def chat(self, user_query: str) -> str:
        """Main chat interface"""
        initial_state = {
            "messages": [],
            "user_query": user_query,
            "search_results": "",
            "final_response": ""
        }
        
        final_state = self.graph.invoke(initial_state)
        return final_state["final_response"]