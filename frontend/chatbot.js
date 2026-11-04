// ============================================================
//  JobBot AI — Advanced Career Assistant
//  Powered by Google Gemini 2.0 Flash + Function Calling
//  Features: Job tracking, AI writing, ATS, contacts, web search
// ============================================================
(function () {
  'use strict';

  // ─── CONFIG (reads from config.js → localStorage) ───────────
  const EC = window.ENV_CONFIG || {};
  const CFG = {
    get gemini_key()   { return localStorage.getItem('js_gemini_key')   || EC.gemini_key   || ''; },
    get groq_key()     { return localStorage.getItem('js_groq_key')     || EC.groq_key     || ''; },
    get supabase_url() { return localStorage.getItem('js_supabase_url') || EC.supabase_url || ''; },
    get supabase_key() { return localStorage.getItem('js_supabase_key') || EC.supabase_key || ''; },
    get hunter_key()   { return localStorage.getItem('js_hunter_key')   || EC.hunter_key   || ''; },
    get name()         { return localStorage.getItem('js_user_name')    || 'Litheesh'; },
    get resume()       { return localStorage.getItem('js_resume_text')  || ''; },
  };

  // ─── SUPABASE HELPERS ────────────────────────────────────────
  const SB = {
    h: () => ({
      'Content-Type': 'application/json',
      'apikey': CFG.supabase_key,
      'Authorization': `Bearer ${CFG.supabase_key}`
    }),
    async get(table, params = '') {
      if (!CFG.supabase_url || !CFG.supabase_key) return [];
      try {
        const r = await fetch(`${CFG.supabase_url}/rest/v1/${table}?${params}`, { headers: SB.h() });
        return r.ok ? r.json() : [];
      } catch { return []; }
    },
    async post(table, data) {
      const r = await fetch(`${CFG.supabase_url}/rest/v1/${table}`, {
        method: 'POST',
        headers: { ...SB.h(), 'Prefer': 'return=representation' },
        body: JSON.stringify(data)
      });
      return r.json();
    },
    async patch(table, id, data) {
      const r = await fetch(`${CFG.supabase_url}/rest/v1/${table}?id=eq.${id}`, {
        method: 'PATCH',
        headers: { ...SB.h(), 'Prefer': 'return=representation' },
        body: JSON.stringify(data)
      });
      return r.json();
    },
    async del(table, id) {
      return fetch(`${CFG.supabase_url}/rest/v1/${table}?id=eq.${id}`, {
        method: 'DELETE', headers: SB.h()
      });
    }
  };

  // ─── GROQ HELPER ─────────────────────────────────────────────
  async function askGroq(systemPrompt, userPrompt) {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${CFG.groq_key}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      })
    });
    const d = await r.json();
    return d.choices?.[0]?.message?.content || '';
  }

  // ─── TOOL DEFINITIONS (Gemini function calling) ──────────────
  const TOOLS = [{
    functionDeclarations: [
      {
        name: 'add_job',
        description: 'Add a new job application to the tracker in Supabase',
        parameters: {
          type: 'OBJECT',
          properties: {
            company:  { type: 'STRING', description: 'Company name' },
            title:    { type: 'STRING', description: 'Job title / role' },
            location: { type: 'STRING', description: 'Job location or Remote' },
            url:      { type: 'STRING', description: 'Job posting URL' },
            status:   { type: 'STRING', description: 'Status: Saved | Applied | Interview | Offer | Rejected' },
            notes:    { type: 'STRING', description: 'Notes about this role' },
          },
          required: ['company', 'title']
        }
      },
      {
        name: 'get_jobs',
        description: 'Retrieve job applications from the tracker. Can filter by status.',
        parameters: {
          type: 'OBJECT',
          properties: {
            status: { type: 'STRING', description: 'Filter by status (optional): Saved | Applied | Interview | Offer | Rejected' },
            limit:  { type: 'NUMBER', description: 'Max number of results (default 20)' }
          }
        }
      },
      {
        name: 'update_job',
        description: 'Update a job application — change status, add notes, etc.',
        parameters: {
          type: 'OBJECT',
          properties: {
            id:     { type: 'STRING', description: 'Job ID from database' },
            status: { type: 'STRING', description: 'New status (optional)' },
            notes:  { type: 'STRING', description: 'Updated notes (optional)' },
          },
          required: ['id']
        }
      },
      {
        name: 'delete_job',
        description: 'Delete a job application from the tracker',
        parameters: {
          type: 'OBJECT',
          properties: {
            id: { type: 'STRING', description: 'Job ID to delete' }
          },
          required: ['id']
        }
      },
      {
        name: 'get_job_stats',
        description: 'Get statistics: total applications, counts by status, recent activity',
        parameters: { type: 'OBJECT', properties: {} }
      },
      {
        name: 'generate_cover_letter',
        description: 'Generate a professional cover letter using AI (Groq). Uses saved resume automatically.',
        parameters: {
          type: 'OBJECT',
          properties: {
            company:         { type: 'STRING', description: 'Company name' },
            job_title:       { type: 'STRING', description: 'Job title' },
            job_description: { type: 'STRING', description: 'Job description text' },
            tone:            { type: 'STRING', description: 'Tone: professional | enthusiastic | concise' },
          },
          required: ['company', 'job_title', 'job_description']
        }
      },
      {
        name: 'check_ats_score',
        description: 'Analyze how well a resume matches a job description. Returns ATS score, missing keywords, and improvements.',
        parameters: {
          type: 'OBJECT',
          properties: {
            job_description: { type: 'STRING', description: 'The job description to match against' },
            resume:          { type: 'STRING', description: 'Resume text. If not provided, uses saved resume.' },
          },
          required: ['job_description']
        }
      },
      {
        name: 'write_linkedin_note',
        description: 'Write a personalized LinkedIn connection request note (under 300 chars)',
        parameters: {
          type: 'OBJECT',
          properties: {
            name:    { type: 'STRING', description: 'Person\'s full name' },
            title:   { type: 'STRING', description: 'Their job title' },
            company: { type: 'STRING', description: 'Their company' },
            reason:  { type: 'STRING', description: 'Why you want to connect (e.g. saw job posting, common interest)' },
          },
          required: ['name', 'company']
        }
      },
      {
        name: 'draft_outreach_email',
        description: 'Draft a professional cold outreach email to a recruiter or hiring manager',
        parameters: {
          type: 'OBJECT',
          properties: {
            name:      { type: 'STRING', description: 'Recipient\'s name' },
            title:     { type: 'STRING', description: 'Recipient\'s job title' },
            company:   { type: 'STRING', description: 'Company name' },
            job_title: { type: 'STRING', description: 'Job position you\'re interested in' },
            context:   { type: 'STRING', description: 'Any extra context (referral, event, etc.)' },
          },
          required: ['name', 'company', 'job_title']
        }
      },
      {
        name: 'find_contacts',
        description: 'Find hiring contacts and emails at a company using Hunter.io',
        parameters: {
          type: 'OBJECT',
          properties: {
            domain:     { type: 'STRING', description: 'Company website domain (e.g. google.com, stripe.com)' },
            first_name: { type: 'STRING', description: 'First name to search for (optional)' },
            last_name:  { type: 'STRING', description: 'Last name to search for (optional)' },
          },
          required: ['domain']
        }
      },
      {
        name: 'search_remote_jobs',
        description: 'Search live remote job listings from Remotive API',
        parameters: {
          type: 'OBJECT',
          properties: {
            keyword:  { type: 'STRING', description: 'Search keyword (e.g. machine learning, react, devops)' },
            category: { type: 'STRING', description: 'Category filter (optional): software-dev, data, devops, design, marketing, etc.' },
            limit:    { type: 'NUMBER', description: 'Max results to show (default 5)' },
          }
        }
      },
      {
        name: 'navigate_to_page',
        description: 'Navigate the user to a specific page in the JobSuite app',
        parameters: {
          type: 'OBJECT',
          properties: {
            page: { type: 'STRING', description: 'Page: dashboard | job-board | ats-checker | cover-letter | linkedin-note | outreach-email | contacts | remote-jobs | settings' }
          },
          required: ['page']
        }
      },
      {
        name: 'improve_resume_bullet',
        description: 'Rewrite and improve a resume bullet point or section to be stronger and more ATS-friendly',
        parameters: {
          type: 'OBJECT',
          properties: {
            text:        { type: 'STRING', description: 'The resume text/bullet to improve' },
            job_context: { type: 'STRING', description: 'Target job or role for context (optional)' },
          },
          required: ['text']
        }
      },
      {
        name: 'prepare_interview_questions',
        description: 'Generate likely interview questions and suggested answers for a specific role',
        parameters: {
          type: 'OBJECT',
          properties: {
            job_title:       { type: 'STRING', description: 'Job title' },
            company:         { type: 'STRING', description: 'Company name' },
            job_description: { type: 'STRING', description: 'Job description for tailored questions (optional)' },
            question_type:   { type: 'STRING', description: 'Type: behavioral | technical | general | all' },
          },
          required: ['job_title']
        }
      },
      {
        name: 'salary_research',
        description: 'Research salary ranges and compensation data for a role and location',
        parameters: {
          type: 'OBJECT',
          properties: {
            job_title: { type: 'STRING', description: 'Job title' },
            location:  { type: 'STRING', description: 'Location (city, state, or remote)' },
            level:     { type: 'STRING', description: 'Experience level: entry | mid | senior | lead' },
          },
          required: ['job_title']
        }
      }
    ]
  }];

  // ─── TOOL EXECUTOR ───────────────────────────────────────────
  async function executeTool(name, args) {
    try {
      switch (name) {

        case 'add_job': {
          const job = {
            company:    args.company,
            title:      args.title,
            location:   args.location || '',
            url:        args.url || '',
            status:     args.status || 'Saved',
            notes:      args.notes || '',
            created_at: new Date().toISOString()
          };
          const result = await SB.post('jobs', job);
          return { success: true, message: `✅ Added "${args.title}" at ${args.company} to your tracker.`, id: result?.[0]?.id };
        }

        case 'get_jobs': {
          let params = 'select=*&order=created_at.desc';
          if (args.status) params += `&status=eq.${encodeURIComponent(args.status)}`;
          if (args.limit)  params += `&limit=${args.limit}`;
          const jobs = await SB.get('jobs', params);
          return { count: jobs.length, jobs: jobs.map(j => ({ id: j.id, company: j.company, title: j.title, status: j.status, location: j.location, notes: j.notes, applied_at: j.created_at })) };
        }

        case 'update_job': {
          const updates = {};
          if (args.status) updates.status = args.status;
          if (args.notes)  updates.notes  = args.notes;
          await SB.patch('jobs', args.id, updates);
          return { success: true, message: `✅ Job updated successfully.` };
        }

        case 'delete_job': {
          await SB.del('jobs', args.id);
          return { success: true, message: `✅ Job deleted from tracker.` };
        }

        case 'get_job_stats': {
          const jobs = await SB.get('jobs', 'select=status,created_at');
          const by_status = {};
          jobs.forEach(j => { by_status[j.status] = (by_status[j.status] || 0) + 1; });
          const last7 = jobs.filter(j => new Date(j.created_at) > new Date(Date.now() - 7 * 86400000)).length;
          return { total: jobs.length, by_status, added_last_7_days: last7 };
        }

        case 'generate_cover_letter': {
          const resume = CFG.resume || 'Not provided';
          const tone = args.tone || 'professional';
          const letter = await askGroq(
            `You are an expert cover letter writer. Write compelling, ${tone} cover letters that sound completely human. Output ONLY the final cover letter — no preamble, no notes.`,
            `Write a cover letter for:\nCOMPANY: ${args.company}\nROLE: ${args.job_title}\n\nJOB DESCRIPTION:\n${args.job_description}\n\nCANDIDATE RESUME:\n${resume}\n\nWrite 3-4 paragraphs. Match keywords from the job description.`
          );
          return { success: true, cover_letter: letter };
        }

        case 'check_ats_score': {
          const resume = args.resume || CFG.resume;
          if (!resume) return { error: 'No resume found. Please add your resume text in Settings → Resume Text field.' };
          const analysis = await askGroq(
            'You are an ATS (Applicant Tracking System) expert. Be specific and actionable.',
            `Analyze this resume vs job description.\n\nJOB DESCRIPTION:\n${args.job_description}\n\nRESUME:\n${resume}\n\nProvide:\n1. ATS Score: X/100\n2. Top 5 MISSING keywords (not in resume)\n3. Top 5 MATCHING keywords found\n4. 3 specific improvements to make\n5. One sentence verdict`
          );
          return { success: true, analysis };
        }

        case 'write_linkedin_note': {
          const note = await askGroq(
            'Write genuine LinkedIn connection notes under 280 characters. Sound human and specific, not templated.',
            `Write a LinkedIn note to ${args.name}${args.title ? `, ${args.title}` : ''} at ${args.company}. ${args.reason ? 'Context: ' + args.reason : ''} From: ${CFG.name}. Under 280 characters.`
          );
          return { success: true, note: note.trim() };
        }

        case 'draft_outreach_email': {
          const resume = CFG.resume || '';
          const email = await askGroq(
            'Write professional cold outreach emails for job seekers. Include: Subject line, then the email body. Be genuine, concise, and add value.',
            `Write a cold outreach email to ${args.name}, ${args.title || 'Hiring Manager'} at ${args.company}, about the ${args.job_title} role.${args.context ? ' Context: ' + args.context : ''}\nSender: ${CFG.name}.\n${resume ? 'Background: ' + resume.substring(0, 300) : ''}`
          );
          return { success: true, email };
        }

        case 'find_contacts': {
          if (!CFG.hunter_key) return { error: 'Hunter.io API key not configured. Add it in Settings.' };
          let url = `https://api.hunter.io/v2/domain-search?domain=${encodeURIComponent(args.domain)}&api_key=${CFG.hunter_key}&limit=5&type=personal`;
          if (args.first_name) url += `&first_name=${encodeURIComponent(args.first_name)}`;
          if (args.last_name)  url += `&last_name=${encodeURIComponent(args.last_name)}`;
          const r = await fetch(url);
          const d = await r.json();
          const contacts = (d.data?.emails || []).slice(0, 5).map(e => ({
            email: e.value,
            name: `${e.first_name || ''} ${e.last_name || ''}`.trim(),
            title: e.position || 'Unknown',
            confidence: e.confidence + '%'
          }));
          return { domain: args.domain, count: contacts.length, contacts };
        }

        case 'search_remote_jobs': {
          let url = 'https://remotive.com/api/remote-jobs?limit=30';
          if (args.keyword)  url += `&search=${encodeURIComponent(args.keyword)}`;
          if (args.category) url += `&category=${encodeURIComponent(args.category)}`;
          const r = await fetch(url);
          const d = await r.json();
          const limit = args.limit || 5;
          const jobs = (d.jobs || []).slice(0, limit).map(j => ({
            title:    j.title,
            company:  j.company_name,
            location: j.candidate_required_location,
            salary:   j.salary || 'Not specified',
            url:      j.url,
            tags:     j.tags?.slice(0, 3).join(', ')
          }));
          return { total_found: d.jobs?.length || 0, showing: jobs.length, jobs };
        }

        case 'navigate_to_page': {
          const map = {
            'dashboard':     'dashboard.html',
            'job-board':     'job-board.html',
            'job board':     'job-board.html',
            'jobs':          'job-board.html',
            'ats-checker':   'ats-checker.html',
            'ats':           'ats-checker.html',
            'cover-letter':  'cover-letter.html',
            'cover letter':  'cover-letter.html',
            'linkedin-note': 'linkedin-note.html',
            'linkedin':      'linkedin-note.html',
            'outreach-email':'outreach-email.html',
            'outreach':      'outreach-email.html',
            'contacts':      'contacts.html',
            'remote-jobs':   'remote-jobs.html',
            'remote':        'remote-jobs.html',
            'settings':      'settings.html',
          };
          const dest = map[args.page.toLowerCase()] || args.page;
          setTimeout(() => window.location.href = dest, 1200);
          return { success: true, navigating_to: dest, message: `Navigating to ${args.page}...` };
        }

        case 'improve_resume_bullet': {
          const improved = await askGroq(
            'You are a professional resume writer. Rewrite resume bullets to be powerful, quantified, and ATS-friendly. Use strong action verbs. Output only the improved text.',
            `Improve this resume text${args.job_context ? ' for a ' + args.job_context + ' role' : ''}:\n\n"${args.text}"\n\nMake it stronger, more specific, and impactful. Use metrics if possible.`
          );
          return { success: true, original: args.text, improved };
        }

        case 'prepare_interview_questions': {
          const type = args.question_type || 'all';
          const questions = await askGroq(
            'You are an interview coach. Provide specific, realistic interview questions with strong example answers. Be concise and practical.',
            `Generate interview questions for a ${args.job_title}${args.company ? ' at ' + args.company : ''} role.${args.job_description ? '\n\nJob Description:\n' + args.job_description.substring(0, 500) : ''}\n\nType: ${type}\nProvide 5 questions with brief example answers each.`
          );
          return { success: true, questions };
        }

        case 'salary_research': {
          const info = await askGroq(
            'You are a compensation expert. Provide accurate, specific salary data based on current market rates. Always mention data sources and that figures are estimates.',
            `What is the typical salary range for a ${args.level || 'mid'}-level ${args.job_title}${args.location ? ' in ' + args.location : ''}?\n\nProvide: base salary range, total comp if applicable, factors affecting pay, and negotiation tips.`
          );
          return { success: true, research: info };
        }

        default:
          return { error: `Unknown tool: ${name}` };
      }
    } catch (err) {
      return { error: err.message };
    }
  }

  // ─── GEMINI API ──────────────────────────────────────────────
  const geminiHistory = [];

  async function callGemini(userMessage) {
    const key = CFG.gemini_key;
    if (!key) return '⚠️ Gemini API key not configured. Please add it in Settings → API Connections.';

    const systemInstruction = `You are JobBot, an advanced AI career assistant built into JobSuite — a job application tracking platform.

You have powerful tools at your disposal. ALWAYS use them when relevant — don't just describe what you could do, actually do it.

The user is: ${CFG.name}
Current page: ${window.location.pathname.split('/').pop() || 'dashboard.html'}
Has resume saved: ${CFG.resume ? 'Yes (' + CFG.resume.length + ' chars)' : 'No — suggest they add it in Settings'}

Capabilities you have:
• Job tracking: add_job, get_jobs, update_job, delete_job, get_job_stats
• AI writing: generate_cover_letter, write_linkedin_note, draft_outreach_email
• Analysis: check_ats_score, improve_resume_bullet
• Research: find_contacts, search_remote_jobs, salary_research
• Career prep: prepare_interview_questions
• Navigation: navigate_to_page

Guidelines:
- Be proactive — take action, don't ask for permission for simple tasks
- After completing an action, always suggest a logical next step
- Format results clearly using markdown (bold, bullet points)
- For cover letters / emails / notes, display the full generated content
- Keep responses focused and actionable
- If asked about companies, jobs, or market info, use your knowledge and tools together`;

    geminiHistory.push({ role: 'user', parts: [{ text: userMessage }] });

    const payload = {
      system_instruction: { parts: [{ text: systemInstruction }] },
      contents: geminiHistory,
      tools: TOOLS,
      tool_config: { function_calling_config: { mode: 'AUTO' } },
      generation_config: { temperature: 0.7, max_output_tokens: 2048 }
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    const candidate = data.candidates?.[0];
    if (!candidate) throw new Error('No response from Gemini');

    const parts = candidate.content?.parts || [];
    const fnCalls = parts.filter(p => p.functionCall);

    if (fnCalls.length > 0) {
      // Save model turn
      geminiHistory.push({ role: 'model', parts: candidate.content.parts });

      // Execute tools
      const toolResults = [];
      for (const part of fnCalls) {
        const { name, args } = part.functionCall;
        const result = await executeTool(name, args);
        toolResults.push({ functionResponse: { name, response: result } });
      }

      geminiHistory.push({ role: 'user', parts: toolResults });

      // Get final response
      const finalRes = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, contents: geminiHistory })
      });

      const finalData = await finalRes.json();
      if (finalData.error) throw new Error(finalData.error.message);

      const finalText = finalData.candidates?.[0]?.content?.parts
        ?.filter(p => p.text)?.map(p => p.text)?.join('') || '✅ Done!';

      geminiHistory.push({ role: 'model', parts: [{ text: finalText }] });
      return finalText;
    }

    // Plain text response
    const text = parts.filter(p => p.text).map(p => p.text).join('');
    geminiHistory.push({ role: 'model', parts: [{ text }] });
    return text;
  }

  // ─── UI STYLES ───────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #jb-btn {
      position:fixed; bottom:24px; right:24px; z-index:9999;
      width:56px; height:56px; border-radius:50%;
      background:#3525cd; color:#fff; border:none; cursor:pointer;
      box-shadow:0 4px 20px rgba(53,37,205,.45);
      display:flex; align-items:center; justify-content:center;
      transition:transform .2s,box-shadow .2s;
    }
    #jb-btn:hover{transform:scale(1.1);box-shadow:0 6px 28px rgba(53,37,205,.55);}
    #jb-btn .material-symbols-outlined{font-size:26px;}
    #jb-badge{
      position:absolute;top:-4px;right:-4px;
      min-width:18px;height:18px;background:#ef4444;border-radius:9px;
      font-size:10px;color:#fff;display:none;align-items:center;
      justify-content:center;font-weight:700;padding:0 4px;font-family:Inter,sans-serif;
    }
    #jb-panel{
      position:fixed;bottom:92px;right:24px;z-index:9998;
      width:420px;height:600px;background:#fff;border-radius:20px;
      box-shadow:0 24px 64px rgba(0,0,0,.15),0 0 0 1px rgba(0,0,0,.06);
      display:flex;flex-direction:column;overflow:hidden;
      transform:scale(.85) translateY(16px);opacity:0;pointer-events:none;
      transition:transform .25s cubic-bezier(.34,1.56,.64,1),opacity .2s;
      font-family:'Inter',sans-serif;
    }
    #jb-panel.jb-open{transform:scale(1) translateY(0);opacity:1;pointer-events:all;}
    #jb-head{
      padding:14px 16px;background:#3525cd;color:#fff;
      display:flex;align-items:center;gap:10px;flex-shrink:0;
    }
    #jb-avatar{
      width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.18);
      display:flex;align-items:center;justify-content:center;flex-shrink:0;
    }
    #jb-avatar .material-symbols-outlined{font-size:20px;}
    #jb-meta{flex:1;min-width:0;}
    #jb-meta h4{font-size:14px;font-weight:600;margin:0;line-height:1.2;}
    #jb-meta p{font-size:11px;opacity:.75;margin:0;line-height:1.3;}
    .jb-hbtn{
      background:rgba(255,255,255,.15);border:none;color:#fff;
      width:30px;height:30px;border-radius:8px;cursor:pointer;
      display:flex;align-items:center;justify-content:center;flex-shrink:0;
      transition:background .15s;
    }
    .jb-hbtn:hover{background:rgba(255,255,255,.28);}
    .jb-hbtn .material-symbols-outlined{font-size:17px;}
    #jb-msgs{
      flex:1;overflow-y:auto;padding:16px;
      display:flex;flex-direction:column;gap:14px;
      scroll-behavior:smooth;
    }
    #jb-msgs::-webkit-scrollbar{width:3px;}
    #jb-msgs::-webkit-scrollbar-thumb{background:#e0e3e5;border-radius:3px;}
    .jb-row{display:flex;gap:8px;align-items:flex-end;max-width:92%;}
    .jb-row.jb-user{align-self:flex-end;flex-direction:row-reverse;}
    .jb-ico{
      width:28px;height:28px;border-radius:50%;flex-shrink:0;
      display:flex;align-items:center;justify-content:center;
      font-family:'Material Symbols Outlined';font-size:14px;
    }
    .jb-row.jb-bot .jb-ico{background:#e2dfff;color:#3525cd;}
    .jb-row.jb-user .jb-ico{background:#4f46e5;color:#fff;}
    .jb-bub{
      padding:10px 14px;border-radius:16px;font-size:13px;
      line-height:1.55;word-break:break-word;
    }
    .jb-row.jb-bot .jb-bub{
      background:#f2f4f6;color:#191c1e;
      border-radius:4px 16px 16px 16px;
    }
    .jb-row.jb-user .jb-bub{
      background:#3525cd;color:#fff;
      border-radius:16px 4px 16px 16px;
    }
    .jb-bub strong{font-weight:600;}
    .jb-bub code{
      background:rgba(0,0,0,.07);padding:1px 5px;
      border-radius:4px;font-size:12px;font-family:monospace;
    }
    .jb-bub pre{
      background:#1e1e2e;color:#cdd6f4;padding:10px 12px;
      border-radius:8px;font-size:12px;overflow-x:auto;
      white-space:pre-wrap;margin:6px 0;
    }
    .jb-typing-bub{padding:12px 16px;}
    .jb-dots{display:flex;gap:4px;}
    .jb-dots span{
      width:7px;height:7px;background:#c7c4d8;border-radius:50%;
      animation:jbBounce 1.3s infinite ease-in-out;
    }
    .jb-dots span:nth-child(2){animation-delay:.2s;}
    .jb-dots span:nth-child(3){animation-delay:.4s;}
    @keyframes jbBounce{0%,60%,100%{transform:translateY(0);}30%{transform:translateY(-9px);}}
    #jb-chips{
      padding:6px 14px 8px;display:flex;gap:6px;flex-wrap:wrap;flex-shrink:0;
      border-top:1px solid #f0f0f0;
    }
    .jb-chip{
      padding:4px 11px;border-radius:20px;
      border:1px solid #c7c4d8;font-size:11px;color:#3525cd;
      cursor:pointer;background:#f7f9fb;transition:all .15s;white-space:nowrap;
    }
    .jb-chip:hover{background:#e2dfff;border-color:#3525cd;}
    #jb-foot{
      padding:10px 14px 14px;border-top:1px solid #eceef0;
      display:flex;gap:8px;align-items:flex-end;flex-shrink:0;
    }
    #jb-inp{
      flex:1;border:1px solid #e0e3e5;border-radius:14px;
      padding:9px 13px;font-size:13px;font-family:'Inter',sans-serif;
      resize:none;max-height:110px;line-height:1.45;outline:none;
      transition:border-color .2s;color:#191c1e;background:#fff;
    }
    #jb-inp:focus{border-color:#3525cd;}
    #jb-inp::placeholder{color:#aab;}
    #jb-send{
      width:38px;height:38px;background:#3525cd;color:#fff;
      border:none;border-radius:11px;cursor:pointer;flex-shrink:0;
      display:flex;align-items:center;justify-content:center;
      transition:background .2s,transform .1s;
    }
    #jb-send .material-symbols-outlined{font-size:18px;}
    #jb-send:hover{background:#4f46e5;}
    #jb-send:active{transform:scale(.93);}
    #jb-send:disabled{background:#c7c4d8;cursor:not-allowed;}
    .jb-copy-btn{
      background:none;border:none;cursor:pointer;
      color:#3525cd;font-size:11px;padding:2px 6px;
      border-radius:4px;transition:background .15s;
    }
    .jb-copy-btn:hover{background:#e2dfff;}
  `;
  document.head.appendChild(style);

  // ─── DOM ─────────────────────────────────────────────────────
  const btn = document.createElement('button');
  btn.id = 'jb-btn';
  btn.title = 'Open JobBot AI';
  btn.innerHTML = `
    <span class="material-symbols-outlined">smart_toy</span>
    <span id="jb-badge"></span>
  `;

  const panel = document.createElement('div');
  panel.id = 'jb-panel';
  panel.innerHTML = `
    <div id="jb-head">
      <div id="jb-avatar"><span class="material-symbols-outlined">smart_toy</span></div>
      <div id="jb-meta">
        <h4>JobBot AI</h4>
        <p>Powered by Gemini 2.0 · Always ready</p>
      </div>
      <button class="jb-hbtn" id="jb-clr" title="Clear chat">
        <span class="material-symbols-outlined">delete_sweep</span>
      </button>
      <button class="jb-hbtn" id="jb-min" title="Close">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
    <div id="jb-msgs"></div>
    <div id="jb-chips">
      <span class="jb-chip">📋 My applications</span>
      <span class="jb-chip">✍️ Cover letter</span>
      <span class="jb-chip">📊 ATS check</span>
      <span class="jb-chip">🔍 Remote jobs</span>
      <span class="jb-chip">💰 Salary info</span>
      <span class="jb-chip">🎤 Interview prep</span>
    </div>
    <div id="jb-foot">
      <textarea id="jb-inp" placeholder="Ask me anything… or tell me what to do" rows="1"></textarea>
      <button id="jb-send"><span class="material-symbols-outlined">send</span></button>
    </div>
  `;

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  // ─── CHAT HISTORY (localStorage) ─────────────────────────────
  const LS_KEY = 'jb_history_v2';
  let chatLog = JSON.parse(localStorage.getItem(LS_KEY) || '[]');

  function saveLog() {
    localStorage.setItem(LS_KEY, JSON.stringify(chatLog.slice(-60)));
  }

  // ─── RENDER HELPERS ──────────────────────────────────────────
  function mdToHtml(text) {
    return text
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/```([\s\S]*?)```/g, '<pre>$1</pre>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^#{1,3}\s(.+)$/gm, '<strong>$1</strong>')
      .replace(/^[\-•]\s(.+)$/gm, '&bull; $1')
      .replace(/\n/g, '<br>');
  }

  function addMsg(role, text) {
    const msgs = document.getElementById('jb-msgs');
    const row = document.createElement('div');
    row.className = `jb-row jb-${role}`;

    const ico = role === 'bot' ? 'smart_toy' : 'person';
    const content = role === 'bot'
      ? `<div class="jb-ico">${ico}</div><div class="jb-bub">${mdToHtml(text)}</div>`
      : `<div class="jb-ico">${ico}</div><div class="jb-bub">${mdToHtml(text)}</div>`;

    row.innerHTML = content;

    // Add copy button for bot messages
    if (role === 'bot' && text.length > 80) {
      const copyBtn = document.createElement('button');
      copyBtn.className = 'jb-copy-btn';
      copyBtn.textContent = '📋 copy';
      copyBtn.style.cssText = 'position:absolute;top:4px;right:4px;';
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(text);
        copyBtn.textContent = '✅ copied';
        setTimeout(() => copyBtn.textContent = '📋 copy', 2000);
      };
      row.style.position = 'relative';
      row.appendChild(copyBtn);
    }

    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
    return row;
  }

  function showTyping() {
    const msgs = document.getElementById('jb-msgs');
    const row = document.createElement('div');
    row.className = 'jb-row jb-bot';
    row.id = 'jb-typing';
    row.innerHTML = `<div class="jb-ico">smart_toy</div><div class="jb-bub jb-typing-bub"><div class="jb-dots"><span></span><span></span><span></span></div></div>`;
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function hideTyping() {
    document.getElementById('jb-typing')?.remove();
  }

  function initChat() {
    const msgs = document.getElementById('jb-msgs');
    msgs.innerHTML = '';
    if (chatLog.length === 0) {
      const firstName = CFG.name.split(' ')[0] || 'there';
      addMsg('bot', `Hi ${firstName}! 👋 I'm **JobBot**, your AI career assistant.\n\nI can help you:\n- **Track jobs** — add, update, delete applications\n- **Write content** — cover letters, outreach emails, LinkedIn notes\n- **Analyze** — ATS scores, resume improvements\n- **Research** — company contacts, remote jobs, salary data\n- **Prep** — interview questions, career advice\n\nWhat do you want to work on?`);
    } else {
      chatLog.forEach(m => addMsg(m.role, m.text));
    }
  }

  // ─── SEND MESSAGE ────────────────────────────────────────────
  async function send(text) {
    text = text.trim();
    if (!text) return;

    const inp = document.getElementById('jb-inp');
    const sendBtn = document.getElementById('jb-send');

    inp.value = '';
    inp.style.height = 'auto';
    sendBtn.disabled = true;

    addMsg('user', text);
    chatLog.push({ role: 'user', text });

    showTyping();

    try {
      const reply = await callGemini(text);
      hideTyping();
      addMsg('bot', reply);
      chatLog.push({ role: 'bot', text: reply });
      saveLog();
    } catch (err) {
      hideTyping();
      addMsg('bot', `❌ Error: ${err.message}\n\nIf this is an API key issue, check Settings.`);
    }

    sendBtn.disabled = false;
    inp.focus();
  }

  // ─── EVENT LISTENERS ─────────────────────────────────────────
  btn.addEventListener('click', () => {
    panel.classList.toggle('jb-open');
    document.getElementById('jb-badge').style.display = 'none';
    if (panel.classList.contains('jb-open')) {
      initChat();
      setTimeout(() => document.getElementById('jb-inp')?.focus(), 300);
    }
  });

  document.getElementById('jb-min').addEventListener('click', () => panel.classList.remove('jb-open'));

  document.getElementById('jb-clr').addEventListener('click', () => {
    chatLog = [];
    geminiHistory.length = 0;
    localStorage.removeItem(LS_KEY);
    initChat();
  });

  document.getElementById('jb-send').addEventListener('click', () => {
    send(document.getElementById('jb-inp').value);
  });

  document.getElementById('jb-inp').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(e.target.value); }
  });

  document.getElementById('jb-inp').addEventListener('input', e => {
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 110) + 'px';
  });

  document.getElementById('jb-chips').addEventListener('click', e => {
    const chip = e.target.closest('.jb-chip');
    if (!chip) return;
    const map = {
      '📋 My applications': 'Show me all my job applications with their current status',
      '✍️ Cover letter':    'I need help writing a cover letter',
      '📊 ATS check':       'Check my resume ATS score against a job description',
      '🔍 Remote jobs':     'Find me remote jobs in AI/ML or software engineering',
      '💰 Salary info':     'What is the salary range for a senior ML engineer in the US?',
      '🎤 Interview prep':  'Help me prepare for a software engineering interview',
    };
    const msg = map[chip.textContent.trim()] || chip.textContent.replace(/^[^\w]+/, '').trim();
    panel.classList.add('jb-open');
    send(msg);
  });

})();
