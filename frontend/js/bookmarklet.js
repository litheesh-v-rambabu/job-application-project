/**
 * Job Application Suite — Universal Bookmarklet (Source)
 * Supports: LinkedIn, Handshake, Level.fyi, Wellfound, SimplyHired, Ladders, Hiring Cafe
 * Webhook: http://localhost:5678/webhook/add-job
 * LinkedIn Note: http://localhost:5678/webhook/linkedin-note
 */

(function () {
  const N8N_BASE = 'http://localhost:5678/webhook';
  const ADD_JOB  = N8N_BASE + '/add-job';
  const LI_NOTE  = N8N_BASE + '/linkedin-note';

  /* ─────────────────────────────────────────
     Utility helpers
  ───────────────────────────────────────── */
  function txt(sel, root) {
    root = root || document;
    const el = root.querySelector(sel);
    return el ? el.innerText.trim() : '';
  }

  function attr(sel, attribute, root) {
    root = root || document;
    const el = root.querySelector(sel);
    return el ? (el.getAttribute(attribute) || '').trim() : '';
  }

  function stripHTML(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.innerText.trim();
  }

  /* ─────────────────────────────────────────
     Site detectors
  ───────────────────────────────────────── */
  const host = location.hostname;

  function isLinkedIn()   { return host.includes('linkedin.com'); }
  function isHandshake()  { return host.includes('joinhandshake.com') || host.includes('app.joinhandshake.com'); }
  function isLevelFyi()   { return host.includes('levels.fyi'); }
  function isWellfound()  { return host.includes('wellfound.com') || host.includes('angel.co'); }
  function isSimplyHired(){ return host.includes('simplyhired.com'); }
  function isLadders()    { return host.includes('theladders.com'); }
  function isHiringCafe() { return host.includes('hiring.cafe'); }

  /* ─────────────────────────────────────────
     Per-site extractors
  ───────────────────────────────────────── */
  function extractLinkedIn() {
    return {
      title:       txt('h1.job-details-jobs-unified-top-card__job-title, h1.t-24, .job-details-jobs-unified-top-card__job-title h1, h1[class*="job-title"]')
                || txt('h1'),
      company:     txt('.job-details-jobs-unified-top-card__company-name a, .job-details-jobs-unified-top-card__company-name, [data-tracking-control-name="public_jobs_topcard-org-name"]')
                || txt('.topcard__org-name-link, .topcard__flavor'),
      location:    txt('.job-details-jobs-unified-top-card__bullet, .tvm__text--low-emphasis, .topcard__flavor--bullet'),
      description: txt('.jobs-description-content__text, .jobs-box__html-content, .description__text'),
      url:         location.href,
      source:      'linkedin'
    };
  }

  function extractHandshake() {
    return {
      title:       txt('h1[data-hook="job-name"], h1.style__title___2YHRH, h1')
                || txt('h1'),
      company:     txt('[data-hook="employer-name"], .style__employer-name___1RNLX, a[data-hook="employer-profile-link"]'),
      location:    txt('[data-hook="job-location"], .style__job-details-list___2PVZW li:first-child'),
      description: txt('[data-hook="job-description"], .style__job-description___1q4RQ'),
      url:         location.href,
      source:      'handshake'
    };
  }

  function extractLevelFyi() {
    return {
      title:       txt('h1.MuiTypography-h1, h1[class*="jobTitle"], h1')
                || txt('h1'),
      company:     txt('[class*="companyName"], [class*="company-name"], h2[class*="company"]'),
      location:    txt('[class*="location"], [class*="jobLocation"]'),
      description: txt('[class*="jobDescription"], [class*="job-description"], [class*="description"]'),
      url:         location.href,
      source:      'level.fyi'
    };
  }

  function extractWellfound() {
    return {
      title:       txt('h1[class*="title"], h1[class*="job-title"], h1')
                || txt('h1'),
      company:     txt('[class*="company-name"], [class*="startup-name"], h2 a'),
      location:    txt('[class*="location"], [class*="job-location"]'),
      description: txt('[class*="job-description"], [class*="description-content"], .prose'),
      url:         location.href,
      source:      'wellfound'
    };
  }

  function extractSimplyHired() {
    return {
      title:       txt('h1.viewjob-jobTitle, h2[data-testid="viewJobTitle"], h1')
                || txt('h1'),
      company:     txt('[data-testid="viewJobCompanyName"], .viewjob-labelWithIcon span'),
      location:    txt('[data-testid="viewJobLocation"], .viewjob-labelWithIcon:nth-child(2) span'),
      description: txt('[data-testid="viewJobBodySectionContent"], .viewjob-description'),
      url:         location.href,
      source:      'simplyhired'
    };
  }

  function extractLadders() {
    return {
      title:       txt('h1[class*="title"], h1[class*="job-title"], h1.sc-fkISmr, h1')
                || txt('h1'),
      company:     txt('[class*="company-name"], [class*="companyName"], .sc-eCImPb a'),
      location:    txt('[class*="location"], [class*="job-location"]'),
      description: txt('[class*="description"], [class*="job-description"], .sc-bdnxRM'),
      url:         location.href,
      source:      'theladders'
    };
  }

  function extractHiringCafe() {
    return {
      title:       txt('h1[class*="job"], h1[class*="title"], h1')
                || txt('h1'),
      company:     txt('[class*="company"], [class*="employer"]'),
      location:    txt('[class*="location"]'),
      description: txt('[class*="description"], [class*="job-body"], main p'),
      url:         location.href,
      source:      'hiring.cafe'
    };
  }

  function extractGeneric() {
    return {
      title:       txt('h1') || document.title,
      company:     '',
      location:    '',
      description: txt('main') || txt('article') || txt('#job-description') || txt('.description'),
      url:         location.href,
      source:      host
    };
  }

  /* ─────────────────────────────────────────
     Extract job data for current page
  ───────────────────────────────────────── */
  let job;
  if      (isLinkedIn())    job = extractLinkedIn();
  else if (isHandshake())   job = extractHandshake();
  else if (isLevelFyi())    job = extractLevelFyi();
  else if (isWellfound())   job = extractWellfound();
  else if (isSimplyHired()) job = extractSimplyHired();
  else if (isLadders())     job = extractLadders();
  else if (isHiringCafe())  job = extractHiringCafe();
  else                      job = extractGeneric();

  // Trim description to 5000 chars to avoid oversized payloads
  if (job.description && job.description.length > 5000) {
    job.description = job.description.substring(0, 5000) + '...';
  }

  /* ─────────────────────────────────────────
     Build floating UI panel
  ───────────────────────────────────────── */
  // Remove any existing panel
  const existing = document.getElementById('jat-panel');
  if (existing) { existing.remove(); return; }

  const panel = document.createElement('div');
  panel.id = 'jat-panel';
  panel.style.cssText = [
    'position:fixed', 'top:20px', 'right:20px', 'z-index:2147483647',
    'background:#1a1a2e', 'color:#e0e0e0', 'border-radius:12px',
    'box-shadow:0 8px 32px rgba(0,0,0,0.5)', 'font-family:-apple-system,BlinkMacSystemFont,sans-serif',
    'font-size:14px', 'width:360px', 'overflow:hidden', 'border:1px solid #2d2d5e'
  ].join(';');

  panel.innerHTML = `
    <div style="background:#16213e;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #2d2d5e">
      <span style="font-weight:700;font-size:15px;color:#7c83fd">⚡ Job Tracker</span>
      <button id="jat-close" style="background:none;border:none;color:#888;font-size:18px;cursor:pointer;padding:0 4px">✕</button>
    </div>
    <div style="padding:16px">
      <div style="margin-bottom:10px">
        <label style="display:block;font-size:11px;color:#888;margin-bottom:3px;text-transform:uppercase;letter-spacing:.5px">Job Title</label>
        <input id="jat-title" value="${escapeVal(job.title)}" style="${inputStyle()}">
      </div>
      <div style="margin-bottom:10px">
        <label style="display:block;font-size:11px;color:#888;margin-bottom:3px;text-transform:uppercase;letter-spacing:.5px">Company</label>
        <input id="jat-company" value="${escapeVal(job.company)}" style="${inputStyle()}">
      </div>
      <div style="margin-bottom:10px">
        <label style="display:block;font-size:11px;color:#888;margin-bottom:3px;text-transform:uppercase;letter-spacing:.5px">Location</label>
        <input id="jat-location" value="${escapeVal(job.location)}" style="${inputStyle()}">
      </div>
      <div style="margin-bottom:10px">
        <label style="display:block;font-size:11px;color:#888;margin-bottom:3px;text-transform:uppercase;letter-spacing:.5px">Status</label>
        <select id="jat-status" style="${inputStyle()}">
          <option value="saved">Saved</option>
          <option value="applied">Applied</option>
          <option value="interviewing">Interviewing</option>
        </select>
      </div>
      <div style="margin-bottom:14px">
        <label style="display:block;font-size:11px;color:#888;margin-bottom:3px;text-transform:uppercase;letter-spacing:.5px">Notes</label>
        <input id="jat-notes" placeholder="Optional notes..." style="${inputStyle()}">
      </div>
      <div style="display:flex;gap:8px">
        <button id="jat-save" style="${btnStyle('#7c83fd')}">💾 Save Job</button>
        <button id="jat-linkedin" style="${btnStyle('#0a66c2')}">✉️ LI Note</button>
      </div>
      <div id="jat-msg" style="margin-top:10px;text-align:center;font-size:12px;min-height:18px"></div>
    </div>
  `;

  function escapeVal(s) {
    return (s || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function inputStyle() {
    return 'width:100%;box-sizing:border-box;background:#0f0f23;border:1px solid #2d2d5e;border-radius:6px;color:#e0e0e0;padding:7px 10px;font-size:13px;outline:none';
  }

  function btnStyle(bg) {
    return `flex:1;background:${bg};color:#fff;border:none;border-radius:7px;padding:9px 0;font-size:13px;font-weight:600;cursor:pointer`;
  }

  document.body.appendChild(panel);

  /* Close button */
  document.getElementById('jat-close').onclick = function() {
    panel.remove();
  };

  /* ─────────────────────────────────────────
     Save Job button
  ───────────────────────────────────────── */
  document.getElementById('jat-save').onclick = async function () {
    const btn = this;
    const msg = document.getElementById('jat-msg');
    btn.disabled = true;
    btn.textContent = 'Saving...';
    msg.style.color = '#aaa';
    msg.textContent = '';

    const payload = {
      title:       document.getElementById('jat-title').value.trim(),
      company:     document.getElementById('jat-company').value.trim(),
      location:    document.getElementById('jat-location').value.trim(),
      status:      document.getElementById('jat-status').value,
      notes:       document.getElementById('jat-notes').value.trim(),
      url:         job.url,
      source:      job.source,
      description: job.description || ''
    };

    if (!payload.title) {
      msg.style.color = '#ff6b6b';
      msg.textContent = '⚠ Please enter a job title.';
      btn.disabled = false;
      btn.innerHTML = '💾 Save Job';
      return;
    }

    try {
      const res = await fetch(ADD_JOB, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        msg.style.color = '#51cf66';
        msg.textContent = '✅ Job saved successfully!';
        btn.innerHTML = '✅ Saved';
      } else {
        throw new Error('HTTP ' + res.status);
      }
    } catch (e) {
      msg.style.color = '#ff6b6b';
      msg.textContent = '❌ Error: Is n8n running? ' + e.message;
      btn.disabled = false;
      btn.innerHTML = '💾 Save Job';
    }
  };

  /* ─────────────────────────────────────────
     LinkedIn Note button
  ───────────────────────────────────────── */
  document.getElementById('jat-linkedin').onclick = async function () {
    const btn = this;
    const msg = document.getElementById('jat-msg');
    btn.disabled = true;
    btn.textContent = 'Generating...';
    msg.style.color = '#aaa';
    msg.textContent = '';

    const company  = document.getElementById('jat-company').value.trim();
    const jobTitle = document.getElementById('jat-title').value.trim();

    if (!jobTitle || !company) {
      msg.style.color = '#ff6b6b';
      msg.textContent = '⚠ Fill in Title and Company first.';
      btn.disabled = false;
      btn.innerHTML = '✉️ LI Note';
      return;
    }

    // Try to grab recruiter name from the page
    let recruiterName = 'Hiring Manager';
    let recruiterTitle = 'Recruiter';

    if (isLinkedIn()) {
      // On LinkedIn job page, sometimes "Meet the hiring team" section is visible
      const hiringName  = txt('.hirer-card__hirer-information .hirer-card__title');
      const hiringTitle = txt('.hirer-card__hirer-information .hirer-card__subtitle');
      if (hiringName)  recruiterName  = hiringName;
      if (hiringTitle) recruiterTitle = hiringTitle;
    }

    try {
      const res = await fetch(LI_NOTE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:      recruiterName,
          title:     recruiterTitle,
          company:   company,
          job_title: jobTitle
        })
      });

      if (res.ok) {
        const data = await res.json();
        // Extract the note text from Groq response
        let note = '';
        try {
          note = data[0].choices[0].message.content.trim();
        } catch(e) {
          note = JSON.stringify(data);
        }

        // Show in a textarea for easy copy
        const noteBox = document.createElement('div');
        noteBox.style.cssText = 'margin-top:10px';
        noteBox.innerHTML = `
          <label style="display:block;font-size:11px;color:#888;margin-bottom:3px;text-transform:uppercase;letter-spacing:.5px">LinkedIn Note (copy & paste)</label>
          <textarea id="jat-note-output" style="width:100%;box-sizing:border-box;background:#0f0f23;border:1px solid #51cf66;border-radius:6px;color:#e0e0e0;padding:8px 10px;font-size:12px;resize:vertical;min-height:80px">${note}</textarea>
          <div style="display:flex;gap:8px;margin-top:6px">
            <button id="jat-copy-note" style="${btnStyle('#51cf66')}">📋 Copy Note</button>
            <span style="font-size:11px;color:#aaa;align-self:center" id="jat-charcount">${note.length}/300 chars</span>
          </div>
        `;
        panel.querySelector('.jat-note-area') && panel.querySelector('.jat-note-area').remove();
        noteBox.className = 'jat-note-area';
        panel.querySelector('#jat-msg').after(noteBox);

        document.getElementById('jat-copy-note').onclick = function() {
          const ta = document.getElementById('jat-note-output');
          ta.select();
          document.execCommand('copy');
          this.textContent = '✅ Copied!';
          setTimeout(() => { this.textContent = '📋 Copy Note'; }, 2000);
        };

        document.getElementById('jat-note-output').oninput = function() {
          document.getElementById('jat-charcount').textContent = this.value.length + '/300 chars';
        };

        msg.style.color = '#51cf66';
        msg.textContent = '✅ LinkedIn note generated!';
      } else {
        throw new Error('HTTP ' + res.status);
      }
    } catch (e) {
      msg.style.color = '#ff6b6b';
      msg.textContent = '❌ Error: Is n8n running? ' + e.message;
    }

    btn.disabled = false;
    btn.innerHTML = '✉️ LI Note';
  };

})();
