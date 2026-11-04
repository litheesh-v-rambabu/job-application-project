// ─────────────────────────────────────────────────────────────
//  WORKFLOW 10 — Outreach Email Generator  |  Webhook path: generate-outreach-email
// ─────────────────────────────────────────────────────────────

const body = $input.first().json.body;

const RESUME = `
LITHEESH VELAKATURI RAMBABU
New York, NY | +1 (716) 368-9971 | vrlitheesh2002@gmail.com | linkedin.com/in/litheesh-rambabu | github.com/litheesh-v-rambabu

PROFESSIONAL EXPERIENCE

Software AI Engineer — Isahghan Minds, Bangalore, India | Dec 2023 – Aug 2025
• Built recommendation and semantic search systems using sentence embeddings, vector search, and re-ranking (Python, Pandas, NumPy), improving content discovery accuracy by 55%.
• Deployed LLM-powered chatbots on AWS, automating end-to-end conversational workflows and cutting manual intervention by 60%+.
• Developed SQL and Pandas data pipelines into PostgreSQL and vector stores, supporting model retraining and evaluation.
• Replaced manual inspection with computer vision (CV) pipelines running real-time inference at 70%+ detection accuracy.
• Adapted domain-specific LLMs using Hugging Face PEFT/LoRA and delivered REST APIs with GPU inference (CUDA) via CI/CD.

Software Engineer Intern — ESI Software (India) Private Limited | Aug 2023 – Nov 2023
• Engineered graph database components for a Simulation Data Management system for TensorFlow/PyTorch ML pipelines, improving data accessibility by 40%.
• Implemented Java graph query layer integrating scikit-learn and CV model outputs, reducing data-access overhead by 30%.
• Validated REST APIs and ML model results with Postman across 10+ AWS-deployed endpoints containerized with Docker.

TECHNICAL SKILLS
Python, C++, JavaScript, TypeScript, SQL | FastAPI, Flask, React, RESTful APIs, GraphQL, Redis, Microservices | PostgreSQL, MySQL, MongoDB, ChromaDB, Pinecone, Elasticsearch | AWS, Azure, Docker, Kubernetes, CI/CD, Airflow | PyTorch, TensorFlow, LangChain/LangGraph, Hugging Face, RAG, LLMs, Embeddings, NLP, MLflow, OpenCV

PROJECTS
• Multi-Agent RAG Platform: LangGraph microservices on FastAPI/Docker, 30K+ req/month, precision@k 68%→87%, 99.2% uptime.
• Deep RL Snow Plow Routing: Gymnasium on Buffalo road network, PPO/DQN/A2C for 10M timesteps, DQN cleared 80% critical roads vs. 0% greedy baseline.
• Multilingual Browser Extension: Real-time translation across 50+ languages to 1,000+ users, <300ms P95 latency.

EDUCATION
University at Buffalo, SUNY | M.S. Engineering Science (AI) | Aug 2025 – Expected Dec 2026
Visvesvaraya Technological University (KSIT) | B.E (AI & ML) | Dec 2020 – Jun 2024
`;

const contactName    = body.contact_name    || '';
const recipientTitle = body.recipient_title || 'Hiring Manager';
const company        = body.company         || 'your company';
const jobTitle       = body.job_title       || 'Software AI Engineer';
const jobDesc        = body.job_desc        || '';
const emailType      = body.email_type      || 'cold';
const senderName     = body.sender_name     || 'Litheesh Velakaturi Rambabu';
const senderTitle    = body.sender_title    || 'Software AI Engineer (MS AI, UB)';
const senderEmail    = body.sender_email    || 'vrlitheesh2002@gmail.com';
const senderPhone    = body.sender_phone    || '+1 (716) 368-9971';
const senderWebsite  = body.sender_website  || 'linkedin.com/in/litheesh-rambabu';

const greeting = contactName ? `Hi ${contactName},` : `Hi ${recipientTitle},`;

let systemPrompt, userPrompt;

if (emailType === 'referral') {
  systemPrompt = `You are an expert at writing referral request emails for job seekers in the tech/AI industry. Write warm, professional, concise emails (3–4 short paragraphs) that feel personal — not template-like. Never fabricate experience.`;
  userPrompt = `Write a referral request email from ${senderName} to ${contactName || 'a contact'} (${recipientTitle} at ${company}).

CANDIDATE RESUME:
${RESUME}

TARGET ROLE: ${jobTitle} at ${company}
JOB DESCRIPTION: ${jobDesc}

Greeting: ${greeting}
Signature: ${senderName} | ${senderTitle} | ${senderEmail} | ${senderPhone} | ${senderWebsite}

Mention the shared connection, highlight 1–2 relevant strengths, and politely ask for a referral or internal introduction. Under 200 words.`;
} else {
  systemPrompt = `You are an expert at writing cold outreach emails for job seekers in the tech/AI industry. Write concise, confident, compelling emails (3–4 short paragraphs). Never fabricate experience.`;
  userPrompt = `Write a cold outreach email from ${senderName} to ${contactName || 'the hiring manager'} (${recipientTitle} at ${company}) for the ${jobTitle} role.

CANDIDATE RESUME:
${RESUME}

JOB DESCRIPTION: ${jobDesc}

Greeting: ${greeting}
Signature: ${senderName} | ${senderTitle} | ${senderEmail} | ${senderPhone} | ${senderWebsite}

Open with a strong hook, highlight 2 specific achievements relevant to this role, express genuine interest, end with a clear call to action. Under 200 words.`;
}

return [{
  json: {
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: userPrompt   }
    ],
    max_tokens: 1200,
    temperature: 0.7
  }
}];
