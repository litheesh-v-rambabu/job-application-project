# Cloud AI Models — Complete Pricing Guide
> For the Job Application Automation Project
> Developer: Litheesh V R | Last updated: April 2026

---

## Your Real Cost for This Project

Before the full comparison, here is what this project actually costs to run using AI.

Each job application involves roughly:
- 1 ATS check: ~2,500 tokens (resume + job description as input, analysis as output)
- 1 resume match: ~3,000 tokens
- 1 cover letter: ~2,300 tokens
- Total per application: ~7,800 tokens

**Cost for 100 job applications:**

| Provider | Model | Cost for 100 Applications |
|---|---|---|
| Groq | Llama 3.3 70B | FREE (within free tier) |
| Google Gemini | Gemini 1.5 Flash | FREE (within free tier) |
| Together.ai | Llama 3.3 70B | ~$0.07 |
| Mistral | Mistral Small | ~$0.12 |
| OpenAI | GPT-4o mini | ~$0.12 |
| Cloudflare Workers | Llama 3.1 8B | FREE (within free tier) |
| Groq (paid) | Llama 3.3 70B | ~$0.11 |
| Fireworks.ai | Llama 3.1 70B | ~$0.14 |
| OpenAI | GPT-4o | ~$2.40 |
| Anthropic | Claude Haiku 3.5 | ~$0.94 |
| AWS Bedrock | Llama 3.1 70B | ~$1.55 |

**Bottom line:** Even for 1,000 job applications, the total AI cost is under $2 on most paid providers. The free tiers easily cover a normal job search.

---

## Section 1 — Free Tiers (No Credit Card)

### 1. Groq — BEST FREE OPTION
**URL:** console.groq.com | **Sign up:** Email only, no credit card

| Model | Free Daily Limit | Quality |
|---|---|---|
| Llama 3.3 70B | 1,000 requests/day | Excellent |
| Llama 3.1 8B | 14,400 requests/day | Good |
| Mixtral 8x7B | 14,400 requests/day | Very Good |
| Gemma2 9B | 14,400 requests/day | Good |

**Pros:** Fastest AI inference on the market (LPU chips), Llama 3.3 70B is excellent quality, very generous free tier, simple API identical to OpenAI format so easy to plug into n8n

**Cons:** Free tier has rate limits, US-based (data sent to US servers)

**Paid pricing (if you exceed free tier):**
| Model | Input per 1M tokens | Output per 1M tokens |
|---|---|---|
| Llama 3.3 70B | $0.59 | $0.79 |
| Llama 3.1 8B | $0.05 | $0.08 |
| Mixtral 8x7B | $0.24 | $0.24 |

---

### 2. Google Gemini API — BEST FOR WRITING
**URL:** aistudio.google.com | **Sign up:** Google account only

| Model | Free Daily Limit | Quality |
|---|---|---|
| Gemini 1.5 Flash | 1,500 requests/day | Excellent for writing |
| Gemini 1.5 Pro | 50 requests/day | Best quality available |
| Gemini 2.0 Flash | 1,500 requests/day | Excellent, newest |

**Pros:** Best natural language writing quality, Gemini 2.0 Flash is newest model, no credit card, very fast

**Cons:** Google can use your data to improve models (can opt out), rate limited on Pro

**Paid pricing:**
| Model | Input per 1M tokens | Output per 1M tokens |
|---|---|---|
| Gemini 1.5 Flash | $0.075 | $0.30 |
| Gemini 1.5 Pro | $1.25 | $5.00 |
| Gemini 2.0 Flash | $0.10 | $0.40 |

---

### 3. Cloudflare Workers AI — GOOD BACKUP
**URL:** dash.cloudflare.com | **Sign up:** Email only

| Free Limit | Models Available |
|---|---|
| 10,000 neurons/day | Llama 3.1 8B, Mistral 7B, Phi-2 |

**Pros:** Always free tier, global network, very fast, no credit card
**Cons:** Only smaller models (7B-8B) on free tier, less quality than 70B models

**Paid:** $0.011 per 1,000 neurons (extremely cheap)

---

### 4. Hugging Face Inference API — GOOD FOR EXPERIMENTS
**URL:** huggingface.co | **Sign up:** Email only

**Free tier:** Limited requests per hour on smaller models
**Student perk:** Apply to HF Research program for more credits

---

## Section 2 — Cheapest Paid Options

### 5. Together.ai — CHEAPEST PAID OPTION
**URL:** together.ai | **New account bonus: $25 free credit**

$25 free credit = approximately 28 million tokens = thousands of job applications

| Model | Price per 1M tokens |
|---|---|
| Llama 3.3 70B Instruct | $0.88 |
| Llama 3.1 8B Instruct | $0.18 |
| Llama 3.1 405B | $3.50 |
| Mistral 7B | $0.20 |
| Qwen2.5 72B | $1.20 |
| DeepSeek R1 | $3.00 |

**Pros:** $25 free credit to start, very cheap paid rates, huge model selection, OpenAI-compatible API
**Cons:** Requires credit card after free credit runs out, slight latency vs Groq

**Estimated cost for this project on Together.ai:**
- 500 applications (ATS + match + cover letter each): ~$3.00 total
- 1,000 applications: ~$6.00 total

---

### 6. Fireworks.ai — FAST AND CHEAP
**URL:** fireworks.ai | **New account: $1 free credit**

| Model | Price per 1M tokens |
|---|---|
| Llama 3.1 70B | $0.90 |
| Llama 3.1 8B | $0.20 |
| Mixtral 8x22B | $1.20 |
| Qwen2.5 72B | $0.90 |

**Pros:** Very fast, cheap, OpenAI-compatible API
**Cons:** Only $1 free credit to start

---

### 7. Mistral AI — BEST EUROPEAN OPTION
**URL:** mistral.ai | **No free tier but very cheap paid**

Good choice if you want data stored in Europe (GDPR compliant).

| Model | Input per 1M | Output per 1M | Best For |
|---|---|---|---|
| Mistral Small 3 | $0.10 | $0.30 | Fast tasks, cheap |
| Mistral 8B | $0.10 | $0.30 | Good balance |
| Mistral Small | $0.20 | $0.60 | Better quality |
| Mistral Medium | $0.40 | $2.00 | High quality |
| Mistral Large | $2.00 | $6.00 | Best quality |

**Pros:** EU-based (data stays in Europe), GDPR compliant, good quality, OpenAI-compatible API
**Cons:** No free tier

---

### 8. OpenRouter — COMPARE AND ROUTE AUTOMATICALLY
**URL:** openrouter.ai

OpenRouter is a single API that routes your requests to the cheapest or best available provider. You don't change your code — you just pick the model and it finds the cheapest source.

| Model | Cheapest Available Rate |
|---|---|
| Llama 3.3 70B | From $0.10/1M tokens |
| Llama 3.1 8B | From $0.02/1M tokens |
| Mistral 7B | From $0.03/1M tokens |
| DeepSeek V3 | From $0.14/1M tokens |
| GPT-4o mini | $0.15/1M tokens |
| Gemini Flash | From $0.04/1M tokens |

**Pros:** One API key for all providers, automatically uses cheapest available, great for comparing quality, $1 free credit
**Cons:** Adds a small markup over direct provider pricing

---

## Section 3 — Premium Options (Higher Cost, Higher Quality)

### 9. OpenAI
**URL:** platform.openai.com | **New account: $5 free credit**

| Model | Input per 1M | Output per 1M | Notes |
|---|---|---|---|
| GPT-4o mini | $0.15 | $0.60 | Best value from OpenAI |
| GPT-4o | $2.50 | $10.00 | Very high quality |
| o1 mini | $3.00 | $12.00 | Best for reasoning tasks |
| o3 mini | $1.10 | $4.40 | Fast reasoning |

**Pros:** Most widely used, excellent quality, huge ecosystem
**Cons:** More expensive than alternatives, requires credit card after free credit

---

### 10. Anthropic Claude API
**URL:** console.anthropic.com | **New account: $5 free credit**

| Model | Input per 1M | Output per 1M | Notes |
|---|---|---|---|
| Claude Haiku 3.5 | $0.80 | $4.00 | Fastest Claude, very capable |
| Claude Sonnet 4 | $3.00 | $15.00 | Best balance |
| Claude Opus 4 | $15.00 | $75.00 | Most capable, most expensive |

**Pros:** Excellent at writing and analysis, very good at following instructions precisely
**Cons:** Most expensive option, requires credit card

---

### 11. AWS Bedrock (Student Credits Available)
**URL:** aws.amazon.com/bedrock | **AWS Educate: $100 student credit**

With your buffalo.edu email + AWS Educate, you get $100 free credit.

| Model | Input per 1M | Output per 1M |
|---|---|---|
| Llama 3.1 8B | $0.22 | $0.22 |
| Llama 3.1 70B | $0.99 | $0.99 |
| Claude Haiku 3 | $0.25 | $1.25 |
| Claude Sonnet 3.5 | $3.00 | $15.00 |
| Titan Text Lite | $0.15 | $0.20 |

**Pros:** $100 free with AWS Educate, integrates with other AWS services, very reliable
**Cons:** More complex setup, higher per-token cost than alternatives

---

### 12. Azure OpenAI (Student Credits Available)
**URL:** azure.microsoft.com/ai | **Azure for Students: $100 credit**

With buffalo.edu email, get $100 Azure credit — no credit card needed.

| Model | Input per 1M | Output per 1M |
|---|---|---|
| GPT-4o mini | $0.15 | $0.60 |
| GPT-4o | $2.50 | $10.00 |
| GPT-3.5 Turbo | $0.50 | $1.50 |

**Pros:** $100 free with student email, enterprise-grade reliability, same GPT models as OpenAI
**Cons:** More complex setup, same price as OpenAI after credits

---

## Section 4 — Side-by-Side Comparison Table

| Provider | Free Tier | Best Free Model | Paid (cheap) | Paid (quality) | Student Deal | EU Data |
|---|---|---|---|---|---|---|
| **Groq** | 1,000 req/day | Llama 3.3 70B | $0.05/1M | $0.79/1M | None | No |
| **Gemini** | 1,500 req/day | Gemini 2.0 Flash | $0.10/1M | $5.00/1M | None | No |
| **Cloudflare** | 10,000/day | Llama 3.1 8B | $0.011/1K | Same | None | EU option |
| **Together.ai** | $25 credit | Llama 3.3 70B | $0.18/1M | $3.50/1M | None | No |
| **OpenRouter** | $1 credit | Llama 3.1 8B | $0.02/1M | $10/1M | None | Varies |
| **Mistral** | None | None | $0.10/1M | $6.00/1M | None | Yes |
| **Fireworks** | $1 credit | Llama 3.1 8B | $0.20/1M | $1.20/1M | None | No |
| **OpenAI** | $5 credit | GPT-4o mini | $0.15/1M | $10.00/1M | Via Azure | No |
| **Anthropic** | $5 credit | Claude Haiku | $0.80/1M | $75.00/1M | None | No |
| **AWS Bedrock** | $100 student | Llama 3.1 70B | $0.22/1M | $15.00/1M | $100 credit | No |
| **Azure OpenAI** | $100 student | GPT-4o mini | $0.15/1M | $10.00/1M | $100 credit | EU option |

---

## Section 5 — Pros and Cons Summary

### Groq
**Pros:** Fastest in the world, best free tier quality (70B free), dead simple API, OpenAI-compatible
**Cons:** US servers only, can hit rate limits if you run many searches in a short burst

### Google Gemini
**Pros:** Best natural writing style, newest models, easy sign-up, good free limits
**Cons:** Google data policies, Pro model very limited on free tier

### Together.ai
**Pros:** $25 free credit is generous, cheapest paid rates, huge model variety
**Cons:** Slower than Groq, need credit card after free credit

### Mistral
**Pros:** EU-based (best for privacy), GDPR compliant, Mistral Small is excellent and cheap
**Cons:** No free tier at all

### OpenAI
**Pros:** Most capable models (GPT-4o), best ecosystem, most tutorials available
**Cons:** Most expensive, requires credit card

### Anthropic (Claude)
**Pros:** Best at following precise instructions, excellent writing quality
**Cons:** Most expensive of all, Claude Haiku is good but costly vs Llama 3.3 70B

### AWS Bedrock
**Pros:** $100 free with buffalo.edu email, very reliable, connects to other AWS tools
**Cons:** Complex setup, not the cheapest per token

---

## Section 6 — Recommended Setup for This Project

### Phase 1 — Development (Free, No Spending)

Use Groq + Gemini free tiers. These cover well over 100 job applications per day with zero cost.

```
ATS Check + Resume Matching  →  Groq (Llama 3.3 70B) — free
Cover Letter Writing          →  Gemini 2.0 Flash — free
Offline backup                →  Ollama Qwen2.5 14B on M4 — free
```

### Phase 2 — If You Hit Free Limits

Sign up for Together.ai with your buffalo.edu email. The $25 free credit covers approximately 28 million tokens — enough for thousands of applications.

```
All AI tasks  →  Together.ai (Llama 3.3 70B at $0.88/1M tokens)
Estimated spend for full job search (200 apps):  ~$1.40
```

### Phase 3 — Best Quality Option (Student Budget)

Use AWS Educate ($100 credit) or Azure for Students ($100 credit) both with your buffalo.edu email. $100 of AWS credits running Llama 3.1 70B on Bedrock covers approximately 50,000 applications — far more than you will ever need.

---

## Section 7 — How to Switch AI Providers in n8n

The entire project is designed so you can switch AI providers by changing just 2 lines in your .env file. No workflow changes needed.

To switch from Groq to Together.ai for example:
```
# In your .env file, change these two lines:
AI_PROVIDER=together
AI_API_KEY=your_together_api_key
```

To switch to OpenAI:
```
AI_PROVIDER=openai
AI_API_KEY=sk-your_openai_key
```

The n8n workflows use these .env variables so everything updates automatically.

---

## Section 8 — Register These Free Accounts Now

Using your buffalo.edu email, register for all of these today — even if you don't need them yet. Credits and free tiers are easier to claim before you need them.

| Priority | Service | What You Get | URL | Time to Sign Up |
|---|---|---|---|---|
| 1 | Groq | 14,400 free req/day | console.groq.com | 2 minutes |
| 2 | Google Gemini | 1,500 free req/day | aistudio.google.com | 2 minutes |
| 3 | Together.ai | $25 free credit | together.ai | 3 minutes |
| 4 | GitHub Student Pack | Many credits incl. Azure $200 | education.github.com/pack | 5 minutes |
| 5 | AWS Educate | $100 credit | aws.amazon.com/education/awseducate | 5 minutes |
| 6 | Azure for Students | $100 credit, no credit card | azure.microsoft.com/free/students | 5 minutes |
| 7 | Oracle Cloud | Forever-free VM | oracle.com/cloud/free | 10 minutes |
| 8 | OpenRouter | $1 free credit | openrouter.ai | 2 minutes |

**Total free credits available to you as a student: over $500 in cloud AI credits**

---

*All prices as of April 2026. Always check the provider's official pricing page before use as rates change frequently.*
