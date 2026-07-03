import Groq from 'groq-sdk';

const MODEL = 'llama-3.3-70b-versatile';

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function domainHint(domain) {
  switch (domain) {
    case 'CS/IT':
      return 'Focus on coding skills, DSA, system design, and software engineering roles.';
    case 'MBA/Management':
      return 'Focus on case interviews, consulting frameworks, product thinking, business analytics, and management roles. Do NOT give DSA/coding advice unless the student explicitly asks.';
    case 'Mechanical':
      return 'Focus on core mechanical skills: SolidWorks, AutoCAD, CATIA, ANSYS, manufacturing processes, design engineering, and core/PSU companies. Do NOT assume IT or software roles.';
    case 'Civil':
      return 'Focus on site engineering, structural design, AutoCAD, Revit, government jobs, PSU, and construction management. Do NOT assume IT roles.';
    case 'ECE/EEE':
      return 'Focus on embedded systems, VLSI, firmware, signal processing, or transition paths to IT/software if the student has that goal. Do NOT assume SWE roles unless the profile shows it.';
    case 'Data Science/AI':
      return 'Focus on Python, ML frameworks, statistics, data engineering, and analytics roles.';
    case 'Chemical':
      return 'Focus on process engineering, plant design, chemical companies, and core chemical roles.';
    default:
      return 'Tailor advice to the student\'s stated degree, branch, and skills. Do not assume a domain not present in their profile.';
  }
}

// ─── Career Coach system prompt ───────────────────────────────────────────────

function buildSystemPrompt(ctx) {
  const {
    name, degree, branch, college, graduationYear,
    educationLevel, educationDomain, dreamRole, currentStatus, bio,
    skills, resume, dsaStats, interviewStats, jobStats,
  } = ctx;

  const identity = [
    name           && `Name: ${name}`,
    degree         && `Degree: ${degree}${branch ? ` in ${branch}` : ''}`,
    college        && `College: ${college}`,
    graduationYear && `Graduating: ${graduationYear}`,
    dreamRole      && `Target Role: ${dreamRole}`,
    currentStatus  && `Status: ${currentStatus}`,
    bio            && `About: ${bio.slice(0, 200)}`,
  ].filter(Boolean).join('\n');

  const skillsLine = skills.length
    ? `Skills (${skills.length}): ${skills.slice(0, 18).join(', ')}`
    : '';

  const resumeSection = [
    skillsLine,
    resume?.experience?.length && `Work Experience: ${resume.experience.length} entries`,
    resume?.projects?.length   && `Projects: ${resume.projects.length}`,
  ].filter(Boolean).join('\n');

  const dsaLine = educationDomain === 'CS/IT' || educationDomain === 'Data Science/AI'
    ? (dsaStats.total > 0
        ? `DSA: ${dsaStats.solved}/${dsaStats.total} solved (Easy ${dsaStats.easySolved}/${dsaStats.easy}, Medium ${dsaStats.mediumSolved}/${dsaStats.medium}, Hard ${dsaStats.hardSolved}/${dsaStats.hard})`
        : 'DSA: Not started yet')
    : null;

  const interviewLine = interviewStats.completed
    ? `Mock Interviews: ${interviewStats.completed} completed, avg score ${interviewStats.avgScore}/100`
    : 'Mock Interviews: None yet';

  const jobLine = jobStats.total
    ? `Job Applications: ${jobStats.total} total — ${Object.entries(jobStats.byStatus || {}).map(([k, v]) => `${k}: ${v}`).join(', ')}`
    : 'Job Applications: None tracked';

  const missingFields = [];
  if (!name)          missingFields.push('name');
  if (!degree)        missingFields.push('degree / education background');
  if (!dreamRole)     missingFields.push('target role or career goal');
  if (!skills.length) missingFields.push('current skills');

  const missingNote = missingFields.length
    ? `\n== Missing Profile Data ==\nNot available yet: ${missingFields.join(', ')}. If this information is needed to answer the question, ask the student for it — do not guess.`
    : '';

  return `You are an AI Placement Mentor on SkillSync AI for a ${educationLevel || 'college'} student.

== Student Profile ==
${identity || 'Profile not filled yet'}
${resumeSection || 'Resume: Not filled'}
${dsaLine ? dsaLine + '\n' : ''}${interviewLine}
${jobLine}${missingNote}

== Domain Context ==
Student's education domain: ${educationDomain || 'Unknown'}
${domainHint(educationDomain)}

== Instructions ==
- Use the student's actual name (${name || 'the student'}) when addressing them — never use a placeholder.
- All advice must be tailored to a ${educationDomain || 'General'} student targeting ${dreamRole || 'their stated career goal'}.
- Infer everything from the student's actual profile — do NOT assume technologies, languages, or roles not present in their data.
- If critical profile information is missing and needed, ask a short, focused follow-up question instead of guessing.
- Give concise, practical, actionable advice (under 300 words unless a roadmap or detailed plan is requested).
- Reference specific weak areas visible in the student's data.
- Use markdown: bullet points, **bold** for emphasis, code blocks for code.
- Never hallucinate skills, courses, or technologies not in the student's profile.`;
}

// ─── Chat messages builder ────────────────────────────────────────────────────

function buildMessages(ctx, conversationHistory, newMessage) {
  const messages = [{ role: 'system', content: buildSystemPrompt(ctx) }];

  for (const msg of conversationHistory.slice(-10)) {
    messages.push({ role: msg.role === 'user' ? 'user' : 'assistant', content: msg.content });
  }

  messages.push({ role: 'user', content: newMessage });
  return messages;
}

// ─── Roadmap prompt ───────────────────────────────────────────────────────────

function domainRoadmapSections(domain, targetRole, targetCompany) {
  const companyLabel = targetCompany ? ` at ${targetCompany}` : '';

  switch (domain) {
    case 'CS/IT':
    case 'Data Science/AI':
      return `## 💻 Technical Skills & DSA Strategy
[Topics to focus on for ${targetRole}${companyLabel}. Reference the student's current DSA level. Include specific problem patterns, topic priorities, and target problem counts.]`;

    case 'MBA/Management':
      return `## 📊 Case Study & Analytical Skills
[Case interview frameworks (McKinsey, BCG, MECE), business analysis, quantitative reasoning, Excel/PowerPoint, and domain knowledge for ${targetRole}${companyLabel}.]`;

    case 'Mechanical':
      return `## 🔧 Core Technical Skills & Tools
[Domain-relevant tools: SolidWorks, AutoCAD, CATIA, ANSYS, or manufacturing processes needed for ${targetRole}${companyLabel}. Include any certifications or software to learn.]`;

    case 'Civil':
      return `## 🏗️ Core Technical Skills & Tools
[Structural design, AutoCAD, Revit, estimation, or site engineering skills needed for ${targetRole}${companyLabel}. Include relevant certifications.]`;

    case 'ECE/EEE':
      return `## ⚡ Technical Skills & Tools
[Embedded systems, VLSI, firmware, PCB design, or relevant software skills needed for ${targetRole}${companyLabel}. If transitioning to IT, outline the skills bridge.]`;

    default:
      return `## 🛠️ Key Skills to Build
[Domain-specific tools, certifications, and skills required for ${targetRole}${companyLabel}. Be specific.]`;
  }
}

function buildRoadmapPrompt(ctx, { targetCompany, targetRole, timeline, skillLevel }) {
  const {
    name, degree, branch, college, graduationYear,
    educationLevel, educationDomain, dreamRole, bio,
    skills, resume, dsaStats, interviewStats, jobStats,
  } = ctx;

  const p = resume?.personal || {};

  const profileSummary = [
    name            && `Student: ${name}`,
    degree          && `Degree: ${degree}${branch ? ` in ${branch}` : ''}`,
    college         && `College: ${college}`,
    graduationYear  && `Graduating: ${graduationYear}`,
    skills.length   && `Current Skills (${skills.length}): ${skills.slice(0, 20).join(', ')}`,
    resume?.experience?.length && `Work Experience: ${resume.experience.length} entries`,
    resume?.projects?.length   && `Projects: ${resume.projects.length} completed`,
    (bio || p.summary) && `About: ${(bio || p.summary).slice(0, 150)}`,
  ].filter(Boolean).join('\n');

  const dsaLine = (educationDomain === 'CS/IT' || educationDomain === 'Data Science/AI')
    ? (dsaStats.total > 0
        ? `DSA: ${dsaStats.solved}/${dsaStats.total} solved (Easy ${dsaStats.easySolved}/${dsaStats.easy}, Medium ${dsaStats.mediumSolved}/${dsaStats.medium}, Hard ${dsaStats.hardSolved}/${dsaStats.hard})`
        : 'DSA: Not started yet')
    : null;

  const interviewLine = interviewStats.completed
    ? `Mock Interviews: ${interviewStats.completed} done, avg score ${interviewStats.avgScore}/100`
    : 'Mock Interviews: None yet';

  const jobLine = jobStats.total
    ? `Applications: ${jobStats.total} total — ${Object.entries(jobStats.byStatus || {}).map(([k, v]) => `${k}: ${v}`).join(', ')}`
    : 'Applications: None tracked';

  const targetContext = targetCompany
    ? `Target Company: ${targetCompany}\nTarget Role: ${targetRole}`
    : `Target Role: ${targetRole}\n(No specific company — tailor roadmap to role and domain)`;

  const interviewStrategy = targetCompany
    ? `## 🎤 Interview Preparation
[${targetCompany}-specific interview strategy: rounds, formats, topics, and preparation approach for ${targetRole}.]`
    : `## 🎤 Interview Preparation
[Interview strategy for ${targetRole} in the ${educationDomain || 'relevant'} domain: typical rounds, topics, and preparation approach.]`;

  const domainSection = domainRoadmapSections(educationDomain, targetRole, targetCompany);

  return `You are an expert placement mentor. Generate a hyper-personalized placement roadmap.

== Student Profile ==
Education Domain: ${educationDomain || 'General'} (${educationLevel || 'Graduate'})
${profileSummary || 'Profile not filled'}
${dsaLine ? dsaLine + '\n' : ''}${interviewLine}
${jobLine}

== Placement Target ==
${targetContext}
Timeline: ${timeline}
Current Skill Level: ${skillLevel}

== Required Output Format ==
Generate a detailed, domain-specific roadmap. The student is in the ${educationDomain || 'General'} domain — ALL advice must match this domain. Do NOT generate generic CS/SWE content unless the domain is CS/IT or Data Science/AI.

## 📊 Placement Readiness Score: [N]/100
[One sentence about current standing and the main gap to close for a ${educationDomain || 'General'} student targeting ${targetRole}]

## 🎯 Goal Summary
[2-3 sentences: what to achieve, why it's realistic or challenging given the data, key focus areas]

## 🗓️ Weekly Milestones
[Divide ${timeline} into weeks. For EACH week write a ### Week N: [Theme] heading followed by exactly 3-5 tasks as - [ ] items. Tasks must be specific and domain-relevant.]

${domainSection}

## 📄 Resume & Profile Improvements
[3-5 specific, actionable improvements based on the student's current resume and domain. Be concrete — reference what's missing or weak.]

## 🚀 Projects / Experience to Build
[2-3 domain-relevant project or practical experience ideas with specific tools, that align with ${targetRole}${targetCompany ? ` at ${targetCompany}` : ''}]

${interviewStrategy}

## 📋 Weekly Checklist
[FLAT list of the most important tasks from the entire roadmap. Use - [ ] for each item. Include 10-15 key tasks.]

== Rules ==
- Every checklist item MUST start with exactly "- [ ] " (dash space bracket space bracket space)
- The readiness score line MUST contain "Readiness Score: N/100" where N is the number
- ALL content must match the student's domain (${educationDomain || 'General'}) — no CSE/Java/LeetCode content for MBA, Mechanical, Civil students
- Base advice on the student's actual skills and data — do not invent skills they don't have
- If targetCompany is not specified, make the roadmap role-focused and applicable to multiple companies in the domain`;
}

// ─── Error classification ─────────────────────────────────────────────────────

function classifyError(err) {
  const status = err?.status ?? err?.statusCode;
  if (status === 401) return 'Invalid API key — please contact the administrator.';
  if (status === 429) return 'Rate limit reached. Please wait a moment and try again.';
  if (status === 503 || status === 502) return 'AI service is temporarily unavailable. Please try again shortly.';
  if (err?.code === 'ECONNREFUSED' || err?.code === 'ENOTFOUND') return 'Network error — could not reach AI service.';
  if (err?.code === 'UND_ERR_CONNECT_TIMEOUT' || err?.message?.toLowerCase().includes('timeout')) {
    return 'Request timed out. Please try again.';
  }
  return 'AI service temporarily unavailable. Please try again.';
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export async function chatWithCareerCoach(userContext, conversationHistory, newMessage) {
  if (!groq) throw new Error('GROQ_API_KEY is not configured. Please contact the administrator.');

  try {
    const completion = await groq.chat.completions.create({
      model:       MODEL,
      messages:    buildMessages(userContext, conversationHistory, newMessage),
      max_tokens:  1024,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content?.trim();
    if (!reply) throw new Error('Empty response from AI model.');
    return reply;
  } catch (err) {
    console.error('[groq] Career coach failed:', err.message);
    throw new Error(classifyError(err));
  }
}

export async function generateRoadmap(userContext, formData) {
  if (!groq) throw new Error('GROQ_API_KEY is not configured. Please contact the administrator.');

  try {
    const completion = await groq.chat.completions.create({
      model:       MODEL,
      messages:    [{ role: 'user', content: buildRoadmapPrompt(userContext, formData) }],
      max_tokens:  3000,
      temperature: 0.65,
    });

    const content = completion.choices[0]?.message?.content?.trim();
    if (!content) throw new Error('Empty response from AI model.');
    return content;
  } catch (err) {
    console.error('[groq] Roadmap generation failed:', err.message);
    throw new Error(classifyError(err));
  }
}
