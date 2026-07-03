import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// ─── Server-side rule-based fallback ─────────────────────────────────────────
const STOP = new Set([
  'that','this','with','from','have','they','been','were','will','would',
  'could','should','their','there','which','what','when','where','about',
  'into','also','some','more','than','then','just','your','both','each','only',
]);

function normalize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP.has(w));
}

function ruleBasedFallback(question, idealAnswer, candidateAnswer) {
  if (!candidateAnswer?.trim()) {
    return {
      score:             0,
      strengths:         [],
      weaknesses:        ['No answer provided'],
      missingKeywords:   [],
      betterAnswer:      idealAnswer || '',
      followUpQuestion:  'Can you explain what you know about this topic?',
    };
  }

  const idealSet       = new Set(normalize(idealAnswer));
  const candidateWords = normalize(candidateAnswer);
  const candidateSet   = new Set(candidateWords);
  const missing        = [...idealSet].filter((w) => !candidateSet.has(w));
  const matchRatio     = idealSet.size > 0 ? (idealSet.size - missing.length) / idealSet.size : 0;
  const wordCount      = candidateAnswer.split(/\s+/).length;
  const idealLen       = (idealAnswer || '').split(/\s+/).length;
  const lengthRatio    = Math.min(wordCount / Math.max(idealLen * 0.4, 15), 1);
  const sentences      = (candidateAnswer.match(/[.!?]+/g) || []).length;
  const score = Math.round(matchRatio * 65 + lengthRatio * 20 + (sentences >= 2 ? 10 : 0) + (wordCount > 50 ? 5 : 0));

  return {
    score:            Math.max(0, Math.min(100, score)),
    strengths:        matchRatio >= 0.4 ? ['Covers relevant concepts'] : [],
    weaknesses:       matchRatio < 0.3  ? ['Missing key concepts from the ideal answer'] : [],
    missingKeywords:  missing.slice(0, 6),
    betterAnswer:     idealAnswer || '',
    followUpQuestion: `Can you elaborate further on: ${question.split(' ').slice(0, 7).join(' ')}?`,
  };
}

// ─── Prompt ───────────────────────────────────────────────────────────────────
function buildPrompt(questions) {
  const entries = questions
    .map(
      (q, i) => `--- Question ${i + 1} ---
Question: ${q.question}
Ideal Answer: ${q.idealAnswer}
Candidate Answer: ${q.candidateAnswer || 'No answer provided'}`,
    )
    .join('\n\n');

  return `You are an expert technical interviewer. Evaluate each candidate answer below.

${entries}

Return ONLY valid JSON — no markdown, no explanation, no code fences:
{
  "evaluations": [
    {
      "score": <integer 0-100>,
      "strengths": ["what the candidate got right"],
      "weaknesses": ["what was missed or incorrect"],
      "missingKeywords": ["important technical term"],
      "betterAnswer": "concise model answer in 2-4 sentences",
      "followUpQuestion": "one probing follow-up question"
    }
  ]
}

Scoring: 0 = no answer, 10-35 = poor, 40-60 = partial, 65-80 = good, 85-100 = excellent.
Return exactly ${questions.length} objects in the same order as the questions above.`;
}

// ─── Response parsing ─────────────────────────────────────────────────────────
function parseGeminiResponse(text) {
  let cleaned = text.trim();
  // Strip markdown code fences if present
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
  // Extract first JSON object
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (match) cleaned = match[0];
  return JSON.parse(cleaned);
}

function sanitize(ev) {
  return {
    score:            Math.max(0, Math.min(100, Math.round(Number(ev.score) || 0))),
    strengths:        Array.isArray(ev.strengths)       ? ev.strengths.filter((s) => typeof s === 'string')       : [],
    weaknesses:       Array.isArray(ev.weaknesses)      ? ev.weaknesses.filter((s) => typeof s === 'string')      : [],
    missingKeywords:  Array.isArray(ev.missingKeywords) ? ev.missingKeywords.filter((s) => typeof s === 'string') : [],
    betterAnswer:     typeof ev.betterAnswer     === 'string' ? ev.betterAnswer     : '',
    followUpQuestion: typeof ev.followUpQuestion === 'string' ? ev.followUpQuestion : '',
  };
}

// ─── Main export ──────────────────────────────────────────────────────────────
export async function evaluateInterviewAnswers(questions) {
  if (!genAI) {
    console.warn('[gemini] GEMINI_API_KEY not set — using rule-based fallback');
    return questions.map((q) => ruleBasedFallback(q.question, q.idealAnswer, q.candidateAnswer));
  }

  try {
    const model  = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(buildPrompt(questions));
    const text   = result.response.text();
    const parsed = parseGeminiResponse(text);

    if (!Array.isArray(parsed.evaluations) || parsed.evaluations.length !== questions.length) {
      throw new Error(`Expected ${questions.length} evaluations, got ${parsed.evaluations?.length ?? 0}`);
    }

    return parsed.evaluations.map(sanitize);
  } catch (err) {
    console.error('[gemini] Evaluation failed, falling back:', err.message);
    return questions.map((q) => ruleBasedFallback(q.question, q.idealAnswer, q.candidateAnswer));
  }
}
