import Resume from '../models/Resume.model.js';

const STOP_WORDS = new Set([
  'the','a','an','and','or','but','in','on','at','to','for','of','with','by','from',
  'is','are','was','were','be','been','being','have','has','had','do','does','did',
  'will','would','could','should','may','might','must','can','this','that','these',
  'those','it','its','they','them','their','we','our','you','your','he','she','his',
  'her','who','which','what','when','where','how','why','not','no','also','only',
  'over','then','here','there','all','any','both','work','team','strong','good',
  'excellent','ability','experience','knowledge','understanding','years','year',
  'plus','required','preferred','well','proven','looking','seeking','need','needs',
  'working','using','develop','development','design','build','building','implement',
  'create','maintain','manage','responsibilities','qualifications','requirements',
  'position','role','job','candidate','ideal','minimum','bonus','us','up','so',
  'more','most','other','some','such','than','too','very','just','each','few',
  'either','neither','me','him','get','set','new','own','same','per','via','etc',
  'use','used','make','made','able','across','after','before','between','into',
  'through','during','about','following','within','including','as','if','while',
  'when','then','our','their','your','my','any','every','many','much','above',
  'below','under','re','de','le','la','les','un','une','des','du','en','et',
]);

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9#+.\-\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 3 && !STOP_WORDS.has(w));
}

function flattenStrings(items) {
  return items.flatMap(item => {
    if (!item || typeof item !== 'object') return [];
    return Object.values(item).flatMap(v => {
      if (typeof v === 'string') return [v];
      if (Array.isArray(v)) return v.filter(x => typeof x === 'string');
      return [];
    });
  });
}

// ── Quality Analysis ─────────────────────────────────────────────────────────

const TECH_LIST = [
  'java','python','c++','c#','javascript','typescript','kotlin','swift','golang','rust','php','ruby','scala','dart',
  'react','react.js','angular','vue','vue.js','next.js','nextjs','svelte',
  'node','node.js','nodejs','express','express.js','django','flask','fastapi',
  'spring','spring boot','springboot','hibernate',
  'mongodb','mysql','postgresql','postgres','redis','sqlite','elasticsearch','cassandra','dynamodb','oracle',
  'docker','kubernetes','k8s','aws','azure','gcp','git','github','gitlab',
  'linux','unix','bash','jenkins','terraform','ansible',
  'html','css','sass','scss','tailwind','bootstrap','jquery','webpack','vite','babel',
  'rest','rest api','graphql','grpc','websocket','oauth','jwt','soap',
  'kafka','rabbitmq','nginx','apache',
  'tensorflow','pytorch','scikit-learn','pandas','numpy','opencv',
  'dsa','oop','sql','nosql','api','microservices','ci/cd','devops','agile','scrum',
  'redux','postman','swagger','firebase','supabase',
  'machine learning','deep learning','natural language processing','computer vision',
  'data structures','algorithms','system design','object oriented',
  'authentication','authorization',
];

const VERBS = new Set([
  'built','created','implemented','developed','designed','optimized','integrated','led','managed',
  'improved','reduced','automated','configured','migrated','deployed','architected','engineered',
  'refactored','maintained','monitored','analyzed','tested','collaborated','mentored','delivered',
  'launched','scaled','researched','documented','streamlined','enhanced','achieved','established',
  'initiated','resolved','identified','increased','decreased','contributed','executed','published',
  'presented','trained','transformed','replaced','fixed','wrote','handled',
]);

const IMPACT_RE = /\d+\s*%|\d+\+?\s*(users?|students?|clients?|members?|people|apis?|endpoints?|features?|services?|requests?)|\d+x\b|\$\d+|\d+\s*(million|thousand|k)\b/gi;

function findTech(text) {
  const lower = text.toLowerCase();
  return TECH_LIST.filter(kw => {
    const esc = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(?:^|[\\s,;/(])(${esc})(?:[\\s,;/)]|$)`, 'i').test(lower);
  });
}

function findVerbs(text) {
  const words = text.toLowerCase().replace(/[^a-z\s]/g, ' ').split(/\s+/);
  return [...VERBS].filter(v => words.some(w => w === v || w === v + 'd' || w === v + 'ed'));
}

function findImpact(text) {
  return [...new Set((text.match(IMPACT_RE) || []).map(m => m.trim()))].slice(0, 10);
}

function isKnownSkill(skill) {
  const lower = skill.toLowerCase().trim();
  return TECH_LIST.some(kw => {
    const esc = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`^${esc}$`).test(lower) ||
           new RegExp(`(?:^|[\\s.+#])(${esc})(?:[\\s.+#]|$)`, 'i').test(lower);
  });
}

function summaryQuality(summary) {
  if (!summary || summary.trim().length < 15) return { score: 0, isWeak: true };
  const s = summary.trim();
  const isWeak = s.length < 25 || /^(i am|hello|hi|good|great|my resume|about me)/i.test(s);
  let score = 0;
  if (s.length >= 30)  score += 4;
  if (s.length >= 80)  score += 3;
  if (s.length >= 150) score += 2;
  if (findTech(s).length >= 1) score += 4;
  if (findTech(s).length >= 3) score += 3;
  if (/backend|frontend|full.?stack|software|engineer|developer|web|mobile|data|cloud|devops/i.test(s)) score += 4;
  return { score: Math.min(20, score), isWeak };
}

function skillsQuality(skills) {
  if (!skills.length) return { score: 0, recognized: 0, hasDuplicates: false };
  const lower = skills.map(s => s.toLowerCase().trim());
  const unique = new Set(lower);
  const hasDuplicates = unique.size < lower.length;
  const recognized = lower.filter(s => isKnownSkill(s)).length;
  let score = Math.min(15, recognized);
  if (!hasDuplicates && recognized >= 8) score = Math.min(20, score + 5);
  else if (!hasDuplicates && recognized >= 4) score = Math.min(20, score + 2);
  return { score, recognized, hasDuplicates };
}

function projectsQuality(projects) {
  if (!projects.length) return { score: 0 };
  let total = 0;
  for (const p of projects) {
    const text = [p.title, p.description, p.tech, p.technologies, p.link].filter(Boolean).join(' ');
    let pts = 0;
    if (p.title) pts += 1;
    if (p.description && p.description.length >= 30) pts += 2;
    if (findTech(text).length > 0)   pts += 2;
    if (findVerbs(text).length > 0)  pts += 2;
    if (findImpact(text).length > 0) pts += 2;
    total += Math.min(9, pts);
  }
  const score = Math.min(15, Math.round((total / (projects.length * 9)) * 15));
  return { score };
}

function experienceQuality(experience) {
  if (!experience.length) return { score: 0 };
  let total = 0;
  for (const e of experience) {
    const text = [e.role, e.title, e.company, e.description, e.duration, e.technologies].filter(Boolean).join(' ');
    let pts = 0;
    if (e.role || e.title)                             pts += 1;
    if (e.company || e.organisation)                   pts += 1;
    if (e.duration || e.period || e.startDate)         pts += 1;
    if (e.description && e.description.length >= 30)   pts += 3;
    if (findVerbs(text).length >= 2)                   pts += 3;
    if (findImpact(text).length > 0)                   pts += 2;
    if (findTech(text).length > 0)                     pts += 1;
    total += Math.min(12, pts);
  }
  const score = Math.min(20, Math.round((total / (experience.length * 12)) * 20));
  return { score };
}

function educationQuality(education) {
  if (!education.length) return { score: 0 };
  const e = education[0];
  let score = 0;
  if (e.degree || e.field || e.course)                       score += 4;
  if (e.college || e.institution || e.school)                score += 5;
  if (e.graduationYear || e.year || e.endDate)               score += 3;
  if (e.gpa || e.cgpa || e.percentage || e.grade || e.marks) score += 3;
  return { score: Math.min(15, score) };
}

function buildQualitySuggestions(sq, skillsQ_, projQ, expQ, impactMetrics, actionVerbCount, tech) {
  const high = [], medium = [], optional = [];

  if (sq.isWeak)                      high.push('Your summary is too short or generic. Write 2–3 sentences with your tech stack, career objective, and key strengths.');
  if (skillsQ_.recognized < 5)        high.push('Add at least 5 recognized technical skills (e.g., Java, React, Python, SQL, Docker) to pass ATS keyword filters.');
  if (skillsQ_.hasDuplicates)         high.push('Remove duplicate entries from your skills section.');
  if (!projQ)                         high.push('Add 2–3 projects with tech stack, descriptions, and measurable outcomes.');

  if (actionVerbCount < 3)            medium.push('Use strong action verbs in your descriptions (e.g., Built, Implemented, Optimized, Reduced, Deployed).');
  if (impactMetrics.length === 0)     medium.push('Add measurable impact — use numbers and percentages (e.g., "Reduced load time by 40%", "Served 1000+ users").');
  if (skillsQ_.recognized < 10)      medium.push('Expand your skills section with more domain-specific technical keywords.');
  if (expQ && expQ.score < 10)        medium.push('Strengthen experience entries — include role, company, duration, technologies, and quantifiable achievements.');
  if (projQ && projQ.score < 8)       medium.push('Improve project descriptions — add tech stack, action verbs, and measurable outcomes.');
  if (tech < 5)                       medium.push('Mention more specific technologies in your project and experience descriptions.');

  return { high, medium, optional };
}

function computeQuality(personal, skills, education, experience, projects, certifications, achievements) {
  const sq   = summaryQuality(personal.summary);
  const sklQ = skillsQuality(skills);
  const expQ = experienceQuality(experience);
  const prjQ = projectsQuality(projects);
  const eduQ = educationQuality(education);

  const certQScore = certifications.length > 0 ? 5 : 0;
  const achvQScore = achievements.length > 0
    ? (achievements.some(a => a.description && a.description.length > 10) ? 5 : 3)
    : 0;

  const qualityBreakdown = {
    contact:        { score: sq.score,       max: 20 },
    skills:         { score: sklQ.score,     max: 20 },
    education:      { score: eduQ.score,     max: 15 },
    experience:     { score: expQ.score,     max: 20 },
    projects:       { score: prjQ.score,     max: 15 },
    certifications: { score: certQScore,     max: 5  },
    achievements:   { score: achvQScore,     max: 5  },
  };

  const totalMax = Object.values(qualityBreakdown).reduce((s, b) => s + b.max, 0);
  const totalRaw = Object.values(qualityBreakdown).reduce((s, b) => s + b.score, 0);
  const qualityScore = Math.round((totalRaw / totalMax) * 100);

  const fullText = [
    personal.summary || '',
    ...skills,
    ...flattenStrings(experience),
    ...flattenStrings(projects),
    ...flattenStrings(certifications),
    ...flattenStrings(achievements),
  ].join(' ');

  const foundTech   = findTech(fullText);
  const foundVerbs  = findVerbs(fullText);
  const foundImpact = findImpact(fullText);

  const qualityFlags = {
    hasWeakSummary:       sq.isWeak,
    hasEnoughSkills:      sklQ.recognized >= 5,
    hasProjects:          projects.length > 0,
    hasNumbers:           foundImpact.length > 0,
    hasActionVerbs:       foundVerbs.length >= 3,
    hasTechnicalKeywords: foundTech.length >= 3,
  };

  const qualitySuggestions = buildQualitySuggestions(
    sq, sklQ,
    projects.length   > 0 ? prjQ : null,
    experience.length > 0 ? expQ : null,
    foundImpact, foundVerbs.length, foundTech.length,
  );

  if (!certifications.length)  qualitySuggestions.optional.push('Add relevant certifications (AWS, Google Cloud, Meta, Coursera) to boost credibility.');
  if (!achievements.length)    qualitySuggestions.optional.push('List competitive achievements (hackathons, scholarships, leaderboard ranks).');
  if (!personal.portfolio)     qualitySuggestions.optional.push('Add a portfolio or personal website link to your contact section.');

  return {
    qualityBreakdown,
    qualityScore,
    qualityFlags,
    technicalKeywordCount: foundTech.length,
    actionVerbCount:       foundVerbs.length,
    impactMetrics:         foundImpact,
    qualitySuggestions,
  };
}

// ─────────────────────────────────────────────────────────────────────────────

export async function getAtsScore(req, res, next) {
  try {
    let resume = await Resume.findOne({ user: req.userId });
    if (!resume) resume = await Resume.create({ user: req.userId });

    const { personal, skills, education, experience, projects, certifications, achievements } = resume;

    // Contact (max 20)
    let contactScore = 0;
    const contactSuggestions = [];
    if (personal.fullName) contactScore += 4; else contactSuggestions.push('Add your full name to the contact section.');
    if (personal.email)    contactScore += 4; else contactSuggestions.push('Add your email address.');
    if (personal.phone)    contactScore += 3; else contactSuggestions.push('Add your phone number.');
    if (personal.location) contactScore += 3; else contactSuggestions.push('Add your location (city, state).');
    if (personal.linkedin) contactScore += 3; else contactSuggestions.push('Add your LinkedIn profile URL.');
    if (personal.github)   contactScore += 3; else contactSuggestions.push('Add your GitHub profile URL.');

    // Education (max 15)
    let educationScore = 0;
    const educationSuggestions = [];
    if (education.length > 0) {
      educationScore += 8;
      const edu = education[0];
      if (edu.college || edu.institution || edu.school) educationScore += 3;
      else educationSuggestions.push('Add your college/university name to your education entry.');
      if (edu.degree || edu.field || edu.course) educationScore += 2;
      else educationSuggestions.push('Specify your degree or field of study.');
      if (edu.graduationYear || edu.year || edu.endDate) educationScore += 2;
      else educationSuggestions.push('Add your graduation year to education.');
    } else {
      educationSuggestions.push('Add your education details (college, degree, graduation year).');
    }

    // Skills (max 20)
    let skillsScore = 0;
    const skillsSuggestions = [];
    if (skills.length >= 1)  skillsScore += 5;
    if (skills.length >= 5)  skillsScore += 5;
    if (skills.length >= 10) skillsScore += 5;
    if (skills.length >= 15) skillsScore += 5;
    if (skills.length < 5)        skillsSuggestions.push('Add at least 5 skills relevant to your target role.');
    else if (skills.length < 10)  skillsSuggestions.push('Aim for 10+ skills to improve ATS keyword matching.');
    else if (skills.length < 15)  skillsSuggestions.push('Adding 15+ skills can further improve keyword coverage.');

    // Experience (max 20)
    let experienceScore = 0;
    const experienceSuggestions = [];
    if (experience.length >= 1) experienceScore += 12;
    if (experience.length >= 2) experienceScore += 5;
    if (experience.length >= 3) experienceScore += 3;
    if (experience.length === 0) experienceSuggestions.push('Add internships, part-time jobs, or freelance experience.');
    else if (experience.length < 2) experienceSuggestions.push('Adding more experience entries strengthens your profile.');

    // Projects (max 15)
    let projectsScore = 0;
    const projectsSuggestions = [];
    if (projects.length >= 1) projectsScore += 8;
    if (projects.length >= 2) projectsScore += 4;
    if (projects.length >= 3) projectsScore += 3;
    if (projects.length === 0) projectsSuggestions.push('Add at least 2–3 personal or academic projects.');
    else if (projects.length < 2) projectsSuggestions.push('Add at least one more project to showcase your work.');

    // Certifications (max 5)
    const certificationsScore = certifications.length > 0 ? 5 : 0;
    const certificationsSuggestions = certifications.length === 0
      ? ['Add relevant certifications (e.g., AWS, Google, Coursera) to boost credibility.']
      : [];

    // Achievements (max 5)
    const achievementsScore = achievements.length > 0 ? 5 : 0;
    const achievementsSuggestions = achievements.length === 0
      ? ['List academic or competitive achievements (hackathons, scholarships, ranks).']
      : [];

    const breakdown = {
      contact:        { score: contactScore,        max: 20 },
      education:      { score: educationScore,      max: 15 },
      skills:         { score: skillsScore,         max: 20 },
      experience:     { score: experienceScore,     max: 20 },
      projects:       { score: projectsScore,       max: 15 },
      certifications: { score: certificationsScore, max: 5  },
      achievements:   { score: achievementsScore,   max: 5  },
    };

    const score = Object.values(breakdown).reduce((sum, s) => sum + s.score, 0);

    const missingSections = Object.entries(breakdown)
      .filter(([, s]) => s.score === 0)
      .map(([key]) => key);

    const suggestions = [
      ...contactSuggestions,
      ...educationSuggestions,
      ...skillsSuggestions,
      ...experienceSuggestions,
      ...projectsSuggestions,
      ...certificationsSuggestions,
      ...achievementsSuggestions,
    ];

    const qa = computeQuality(personal, skills, education, experience, projects, certifications, achievements);

    // sectionQuality: completeness from breakdown + quality from qa
    const sectionQuality = {};
    for (const key of Object.keys(breakdown)) {
      sectionQuality[key] = {
        completeness: breakdown[key].score,
        quality:      qa.qualityBreakdown[key]?.score ?? 0,
        max:          breakdown[key].max,
      };
    }

    res.json({
      score,
      breakdown,
      missingSections,
      suggestions,
      qualityBreakdown:      qa.qualityBreakdown,
      qualityScore:          qa.qualityScore,
      qualityFlags:          qa.qualityFlags,
      sectionQuality,
      technicalKeywordCount: qa.technicalKeywordCount,
      actionVerbCount:       qa.actionVerbCount,
      impactMetrics:         qa.impactMetrics,
      qualitySuggestions:    qa.qualitySuggestions,
    });
  } catch (err) {
    next(err);
  }
}

const PERSONAL_FIELDS = [
  'fullName', 'email', 'phone', 'college', 'degree',
  'graduationYear', 'location', 'linkedin', 'github', 'portfolio', 'summary',
];

const ARRAY_FIELDS = [
  'skills', 'education', 'experience', 'projects', 'certifications', 'achievements',
];

export async function getResume(req, res, next) {
  try {
    let resume = await Resume.findOne({ user: req.userId });

    if (!resume) {
      resume = await Resume.create({ user: req.userId });
    }

    res.json({ resume });
  } catch (err) {
    next(err);
  }
}

export async function matchJobDescription(req, res, next) {
  try {
    const { jobDescription } = req.body;
    if (!jobDescription || typeof jobDescription !== 'string' || !jobDescription.trim()) {
      return res.status(400).json({ message: 'jobDescription is required.' });
    }

    let resume = await Resume.findOne({ user: req.userId });
    if (!resume) resume = await Resume.create({ user: req.userId });

    const { skills, experience, projects } = resume;

    // Full resume text corpus (lowercased) for broad matching
    const resumeCorpus = [
      ...skills,
      ...flattenStrings(experience),
      ...flattenStrings(projects),
    ].join(' ').toLowerCase();

    const jdLower = jobDescription.toLowerCase();

    // matchedSkills: resume skill entries that literally appear in the JD
    const matchedSkills = [...new Set(
      skills
        .map(s => s.trim())
        .filter(s => s.length > 0 && jdLower.includes(s.toLowerCase()))
    )];

    // Meaningful JD tokens (after stop-word filtering)
    const jdTokens = [...new Set(tokenize(jobDescription))];

    // missingSkills: JD tokens not found anywhere in resume corpus
    const missingSkills = jdTokens
      .filter(t => !resumeCorpus.includes(t))
      .slice(0, 20);

    // matchPercentage: fraction of meaningful JD tokens covered by resume
    const coveredCount = jdTokens.filter(t => resumeCorpus.includes(t)).length;
    const matchPercentage = Math.min(
      100,
      Math.round((coveredCount / Math.max(jdTokens.length, 1)) * 100)
    );

    // Rule-based recommendations
    const recommendations = [];
    if (matchPercentage < 30) {
      recommendations.push('Your resume covers very few of the job requirements. Tailor your skills and experience to match this role.');
    } else if (matchPercentage < 60) {
      recommendations.push('You partially match the job requirements. Adding more relevant keywords will strengthen your application.');
    } else {
      recommendations.push('Good keyword coverage! Quantify your achievements with numbers and metrics to stand out further.');
    }
    if (missingSkills.length > 0) {
      recommendations.push(`Consider adding these keywords to your resume if applicable: ${missingSkills.slice(0, 5).join(', ')}.`);
    }
    if (matchedSkills.length < 3) {
      recommendations.push('Your listed skills have low overlap with this JD. Update your skills section with role-specific technologies.');
    }
    if (experience.length === 0) {
      recommendations.push('Add relevant work experience to demonstrate hands-on exposure to the required technologies.');
    }
    if (projects.length === 0) {
      recommendations.push('Add projects that use technologies mentioned in the job description to fill experience gaps.');
    }
    recommendations.push('Mirror exact terminology from the job description in your resume to pass automated ATS filters.');

    res.json({ matchPercentage, matchedSkills, missingSkills, recommendations });
  } catch (err) {
    next(err);
  }
}

export async function updateResume(req, res, next) {
  try {
    const updates = {};

    if (req.body.personal && typeof req.body.personal === 'object') {
      for (const field of PERSONAL_FIELDS) {
        if (req.body.personal[field] !== undefined) {
          updates[`personal.${field}`] = req.body.personal[field];
        }
      }
    }

    for (const field of ARRAY_FIELDS) {
      if (Array.isArray(req.body[field])) {
        updates[field] = req.body[field];
      }
    }

    const resume = await Resume.findOneAndUpdate(
      { user: req.userId },
      { $set: updates },
      { new: true, runValidators: true, upsert: true }
    );

    res.json({ resume });
  } catch (err) {
    next(err);
  }
}
