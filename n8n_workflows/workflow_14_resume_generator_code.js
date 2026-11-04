// ─────────────────────────────────────────────────────────────
//  WORKFLOW 14 — Resume Generator  |  Webhook path: generate-resume
// ─────────────────────────────────────────────────────────────

const body = $input.first().json.body;

const RESUME = `
LITHEESH VELAKATURI RAMBABU
New York, NY | +1 (716) 368-9971 | vrlitheesh2002@gmail.com | linkedin.com/in/litheesh-rambabu | github.com/litheesh-v-rambabu

PROFESSIONAL EXPERIENCE

Software AI Engineer — Isahghan Minds, Bangalore, India | Dec 2023 – Aug 2025
• Built recommendation and semantic search systems using sentence embeddings, vector search, and re-ranking (Python, Pandas, NumPy), improving content discovery accuracy by 55% over the previous keyword-based approach.
• Deployed large language model (LLM)-powered chatbots on AWS alongside generative AI product features, automating end-to-end conversational workflows and cutting manual intervention for end users by 60%+.
• Developed SQL and Pandas data pipelines to clean, transform, and load training and retrieval data into PostgreSQL and vector stores, supporting model retraining and evaluation.
• Replaced manual inspection with computer vision (CV) pipelines running real-time inference at 70%+ detection accuracy, accelerating turnaround across production processes.
• Adapted domain-specific LLMs using Hugging Face for PEFT with LoRA variants, and delivered REST APIs serving production ML models with GPU inference (CUDA), shipped via pull requests and CI/CD.

Software Engineer Intern — ESI Software (India) Private Limited, Bangalore, India | Aug 2023 – Nov 2023
• Engineered data management components for a Simulation Data Management (SDM) system on a graph database, enabling structured storage and retrieval of large-scale simulation datasets for TensorFlow and PyTorch ML pipelines, improving data accessibility by 40%.
• Implemented a Java-based graph query layer with read/write operations, integrating outputs from scikit-learn and computer vision models, reducing manual data-access overhead by 30%.
• Validated REST API responses and ML model query results with Postman across 10+ endpoints deployed on AWS, containerized with Docker.

TECHNICAL SKILLS
• Languages: Python, C++, JavaScript, TypeScript, SQL, HTML, CSS
• Web & APIs: FastAPI, Flask, React, RESTful APIs, GraphQL, Pydantic, Redis, Microservices
• Databases: PostgreSQL, MySQL, SQLite, MongoDB, ChromaDB, Pinecone, Elasticsearch
• Cloud & DevOps: AWS (EKS, EC2, S3, Lambda, IAM), Azure, Docker, Kubernetes, Linux, Airflow, CI/CD Pipelines
• Developer Tools: Git, pytest, Redis Queue, Claude Code, Cursor, GitHub Copilot, ChatGPT/Codex
• AI/ML & Data: Pandas, NumPy, scikit-learn, PyTorch, TensorFlow, LangChain/LangGraph, Hugging Face, RAG, Recommendation Systems, Embeddings, NLP, LLMs, Transformers, MLflow, OpenCV

PROJECTS

Multi-Agent Retrieval-Augmented Generation (RAG) Platform for Support Operations
• Architected a horizontally scalable microservice platform (Python, FastAPI, Docker) with event-driven LangGraph agent orchestration unifying RAG, structured data extraction, and automated triage, serving 30K+ requests/month at 40% higher throughput.
• Built a retrieval pipeline using vector search (Chroma/FAISS embeddings, re-ranking) and a QLoRA classifier via Hugging Face, lifting precision@k from 68% to 87%, cutting hallucination rate by 48% and inference cost by 93% vs. LLM calls.
• Shipped a Model Context Protocol (MCP) server and REST API with CI/CD (pytest, GitHub Actions, LLM-as-judge), circuit breakers, and exponential-backoff retries, holding 99.2% uptime at P95 latency under 1,800ms.

Deep Reinforcement Learning (RL) Platform for Urban Snow Plow Routing
• Created a Gymnasium environment on Buffalo's real road network (OSMnx: 5,191 nodes, 8,040 edges) with a NOAA-calibrated zero-inflated Gamma snowfall model across 5 intensity regimes, cutting state space 200x via Louvain community detection.
• Redesigned a sparse urgency-decay reward into a dense clearance-mode reward (17x clearance gain), trained PPO, A2C, DQN, and MaskablePPO (Stable-Baselines3) for 10M timesteps on dual NVIDIA L40S GPUs (CUDA).
• Evaluated agents over 50 deterministic episodes; DQN cleared 80% of critical arterial roads in high snowfall vs. 0% for the greedy heuristic baseline.

Real-Time Multilingual Translation Browser Extension
• Developed a full-stack browser extension (JavaScript, React, Chrome Extensions API) paired with a Python REST backend, delivering real-time translation across 50+ languages to 1,000+ active users without page disruption.
• Integrated Google BERT for language detection (~80% accuracy) with ChatGPT-based NLP for translation.
• Built a low-latency Python backend with async processing and caching, serving NLP inference at under 300ms P95 latency.

EDUCATION
University at Buffalo, SUNY | M.S. Engineering Science (Artificial Intelligence) | Aug 2025 – Expected Dec 2026
Visvesvaraya Technological University (KSIT) | B.E (AI & ML) | Dec 2020 – Jun 2024
`;

const jobTitle      = body.job_title       || 'Software AI Engineer';
const company       = body.company         || '';
const jobDesc       = body.job_description || '';
const format        = body.format          || 'standard';
const senderName    = body.sender_name     || 'Litheesh Velakaturi Rambabu';
const senderTitle   = body.sender_title    || 'Software AI Engineer';
const senderEmail   = body.sender_email    || 'vrlitheesh2002@gmail.com';
const senderPhone   = body.sender_phone    || '+1 (716) 368-9971';
const senderWebsite = body.sender_website  || 'linkedin.com/in/litheesh-rambabu';

const companyLine = company ? ` at ${company}` : '';

const systemPrompt = `You are an expert resume writer specializing in AI/ML engineering roles. Tailor the provided resume to maximize ATS match for the target job description — reorder bullet points, strengthen wording, and emphasize relevant skills — without fabricating any experience or skills not present in the original resume.

Output the complete tailored resume as clean plain text with sections in this order:
1. Header (name, contact info)
2. Professional Experience
3. Technical Skills (lead with skills most relevant to the job)
4. Projects (reorder to put most relevant first)
5. Education

${format === 'compact' ? 'Compact format: max 2 bullets per job role, max 2 bullets per project. Keep total under 600 words.' : 'Standard format: 3–5 bullets per job role, 3 bullets per project.'}`;

const userPrompt = `Tailor this resume for: ${jobTitle}${companyLine}

TARGET JOB DESCRIPTION:
${jobDesc}

ORIGINAL RESUME:
${RESUME}

Header: ${senderName} | ${senderTitle} | ${senderEmail} | ${senderPhone} | ${senderWebsite}

Output only the complete tailored resume — no explanations or commentary.`;

return [{
  json: {
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: userPrompt   }
    ],
    max_tokens: 2000,
    temperature: 0.4
  }
}];
