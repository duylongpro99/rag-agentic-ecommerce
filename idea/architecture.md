graph TD
    subgraph "User-Facing Application"
        UI[💬 Chat Interface]
    end

    subgraph "Core Agentic System"
        Orchestrator[🤖 Orchestrator Agent <br>(LLM-powered)]
    end

    subgraph "Tool Belt"
        T1[🛠️ Semantic Search Tool <br>(Vector Retriever)]
        T2[🛠️ Structured Filter Tool <br>(SQL/API Query)]
        T3[🧠 Conversation History]
    end

    subgraph "Data & Knowledge Layer"
        VDB[🌐 Vector Database <br>(Product Embeddings)]
        PDB[🗄️ Primary Product DB <br>(PostgreSQL/MongoDB)]
        ETL[🔄 ETL & Embedding Pipeline]
    end

    %% Connections
    User(👤 Customer) -- "I need shoes for running on wet trails" --> UI
    UI -- User Query --> Orchestrator

    Orchestrator -- "What kind of query is this?" --> Orchestrator
    Orchestrator -- "Decides to use Semantic Search" --> T1
    Orchestrator -- "User asks for 'Nike brand only'" --> T2
    Orchestrator -- "Remembers previous results" --> T3

    T1 -- "Finds similar products" --> VDB
    T2 -- "Filters by brand='Nike'" --> PDB

    VDB -- "Returns relevant product chunks" --> T1
    PDB -- "Returns filtered product list" --> T2

    T1 -- Product Context --> Orchestrator
    T2 -- Product Context --> Orchestrator
    T3 -- Chat History --> Orchestrator

    Orchestrator -- "Generates final answer" --> UI
    UI -- "Here are some waterproof trail running shoes..." --> User

    %% ETL Flow
    PDB -- "Product Data" --> ETL
    ETL -- "Generates Embeddings" --> VDB