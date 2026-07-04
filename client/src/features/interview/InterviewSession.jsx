import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Label from '../../components/ui/Label';
import questionBank from '../../data/interviewQuestions';
import { evaluateInterview } from '../../utils/interviewEvaluator';
import { createInterview, updateInterview, evaluateAnswers } from '../../services/interviewService';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const QUESTION_COUNT = 10;
const SECONDS_PER_QUESTION = 120;

const SELECT_CLASS = [
  'w-full h-10 px-3 rounded-md text-sm border border-neutral-300 bg-neutral-100 text-neutral-900',
  'text-neutral-800 cursor-pointer',
  'focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-brand-500 focus:border-brand-500',
  'transition-colors duration-150',
].join(' ');

const TEXTAREA_CLASS =
  'w-full px-3 py-2.5 rounded-md text-sm border border-neutral-300 bg-neutral-100 text-neutral-900 ' +
  'placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-offset-0 ' +
  'focus:ring-brand-500 focus:border-brand-500 transition-colors duration-150 resize-none';

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function generateQuestions(difficulty) {
  const pool = questionBank.filter((q) => q.difficulty === difficulty);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(QUESTION_COUNT, shuffled.length));
}

// ─── Build AI evaluation result (same shape as evaluateInterview) ─────────────
function buildAIEvaluation(questions, answers, aiEvaluations) {
  const evaluations = aiEvaluations.map((ev, i) => ({
    ...ev,
    matchedKeywords: [],
    suggestions:     [],
    questionId:      questions[i].id,
    category:        questions[i].category,
  }));

  const answered = questions.filter((q) => (answers[q.id] || '').trim()).length;
  const totalScore = evaluations.reduce((s, e) => s + e.score, 0);
  const overallScore = questions.length > 0 ? Math.round(totalScore / questions.length) : 0;
  const completion = questions.length > 0 ? Math.round((answered / questions.length) * 100) : 0;

  const catMap = {};
  evaluations.forEach((e) => {
    if (!catMap[e.category]) catMap[e.category] = [];
    catMap[e.category].push(e.score);
  });
  const categoryScores = Object.entries(catMap).map(([category, scores]) => ({
    category,
    avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
  }));
  const strongTopics = categoryScores.filter((c) => c.avg >= 60).map((c) => c.category);
  const weakTopics   = categoryScores.filter((c) => c.avg < 40).map((c) => c.category);

  const freqMap = {};
  evaluations.forEach((e) => {
    (e.missingKeywords || []).forEach((kw) => { freqMap[kw] = (freqMap[kw] || 0) + 1; });
  });
  const mostMissed = Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([kw]) => kw);

  return {
    evaluations,
    overallScore,
    completion,
    answered,
    unanswered: questions.length - answered,
    strongTopics,
    weakTopics,
    mostMissed,
    categoryScores,
    source: 'ai',
  };
}

// ─── Circular Progress ────────────────────────────────────────────────────────
function CircularProgress({ value }) {
  const size = 132;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const color = value >= 70 ? '#15803d' : value >= 40 ? '#a16207' : '#b91c1c';
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e4e7ed" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="absolute text-center pointer-events-none select-none">
        <p className="text-2xl font-bold leading-none" style={{ color }}>{value}</p>
        <p className="text-xs text-neutral-400 mt-0.5">/100</p>
      </div>
    </div>
  );
}

// ─── Setup Screen ─────────────────────────────────────────────────────────────
function SetupScreen({ initialRole, initialDifficulty, onStart }) {
  const [role, setRole] = useState(initialRole || '');
  const [difficulty, setDifficulty] = useState(initialDifficulty || 'Medium');

  return (
    <div className="max-w-md mx-auto space-y-6 pt-4">
      <div>
        <h2 className="text-xl font-bold text-neutral-900">Setup Interview</h2>
        <p className="mt-0.5 text-sm text-neutral-500">
          Configure your session. You will get {QUESTION_COUNT} questions based on the difficulty you select.
        </p>
      </div>
      <Card>
        <div className="space-y-5">
          <div>
            <Label htmlFor="setup-role">Role <span className="text-neutral-400 font-normal">(optional)</span></Label>
            <Input
              id="setup-role"
              placeholder="Software Engineer, Backend Developer…"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="setup-diff">Difficulty</Label>
            <select
              id="setup-diff"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className={SELECT_CLASS}
            >
              {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="pt-1">
            <Button fullWidth onClick={() => onStart(role, difficulty)}>
              Start Interview
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── Active Session ───────────────────────────────────────────────────────────
function ActiveSession({ role, difficulty, questions, onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION);
  const timerRef = useRef(null);

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    setTimeLeft(SECONDS_PER_QUESTION);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [currentIndex, resetTimer]);

  const currentQuestion = questions[currentIndex];
  const isAnswered = (id) => Boolean(answers[id]?.trim());
  const answeredCount = Object.values(answers).filter((v) => v.trim()).length;

  const handleAnswer = (text) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: text }));
  };

  const goTo = (idx) => {
    if (idx >= 0 && idx < questions.length) setCurrentIndex(idx);
  };

  const timerWarning = timeLeft <= 30;

  const categoryColor = {
    'Java':             'bg-brand-50 text-brand-700',
    'DSA':              'bg-warning-100 text-warning-700',
    'DBMS':             'bg-success-100 text-success-700',
    'Operating System': 'bg-danger-100 text-danger-700',
    'Computer Networks':'bg-neutral-100 text-neutral-600',
    'HR':               'bg-brand-100 text-brand-800',
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Top bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="font-semibold text-neutral-900">{role || 'Mock Interview'}</p>
          <p className="text-xs text-neutral-500 mt-0.5">{difficulty} · {questions.length} questions</p>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-mono font-semibold ${timerWarning ? 'bg-danger-100 border-danger-200 text-danger-700' : 'bg-neutral-50 border-neutral-200 text-neutral-700'}`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
          </svg>
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
          <span>Progress</span>
          <span>{answeredCount} / {questions.length} answered</span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${(answeredCount / questions.length) * 100}%`, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', boxShadow: '0 0 6px rgba(99,102,241,0.45)' }}
          />
        </div>
      </div>

      {/* Question navigator */}
      <div className="flex gap-2 flex-wrap">
        {questions.map((q, i) => {
          const active = i === currentIndex;
          const answered = isAnswered(q.id);
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => goTo(i)}
              className={[
                'w-9 h-9 rounded-lg text-sm font-medium transition-colors border',
                active
                  ? 'bg-brand-600 text-white border-brand-600'
                  : answered
                  ? 'bg-success-100 text-success-700 border-success-100'
                  : 'bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200',
              ].join(' ')}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* Question card */}
      <Card>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className="text-xs font-medium text-neutral-400">
                Question {currentIndex + 1} of {questions.length}
              </p>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColor[currentQuestion.category] ?? 'bg-neutral-100 text-neutral-600'}`}>
                {currentQuestion.category}
              </span>
            </div>
            <p className="text-base font-medium text-neutral-900 leading-relaxed">
              {currentQuestion.question}
            </p>
          </div>
          <div>
            <Label htmlFor="answer-area">Your Answer</Label>
            <textarea
              id="answer-area"
              rows={6}
              placeholder="Type your answer here…"
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              className={TEXTAREA_CLASS}
            />
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={() => goTo(currentIndex - 1)}
          disabled={currentIndex === 0}
        >
          ← Previous
        </Button>
        <Button variant="danger" onClick={() => onFinish(answers)}>
          Finish Interview
        </Button>
        <Button
          onClick={() => goTo(currentIndex + 1)}
          disabled={currentIndex === questions.length - 1}
        >
          Next →
        </Button>
      </div>
    </div>
  );
}

// ─── Results Helpers ──────────────────────────────────────────────────────────
function ScoreBadge({ score }) {
  const cls = score >= 70
    ? 'bg-success-100 text-success-700'
    : score >= 40
    ? 'bg-warning-100 text-warning-700'
    : 'bg-danger-100 text-danger-700';
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-bold flex-shrink-0 ${cls}`}>
      {score}<span className="text-xs font-normal opacity-70 ml-0.5">/100</span>
    </span>
  );
}

function Chip({ label, variant = 'neutral' }) {
  const cls = {
    green:   'bg-success-100 text-success-700',
    red:     'bg-danger-100 text-danger-700',
    neutral: 'bg-neutral-100 text-neutral-600',
    brand:   'bg-brand-50 text-brand-700',
  }[variant] || 'bg-neutral-100 text-neutral-600';
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}

// ─── Results Screen ────────────────────────────────────────────────────────────
function ResultsScreen({ role, difficulty, questions, answers, evaluation, onReturn }) {
  const {
    overallScore, completion, answered, unanswered,
    strongTopics, weakTopics, mostMissed,
    evaluations, categoryScores, source,
  } = evaluation;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="text-center py-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-success-100 mb-4">
          <svg className="w-8 h-8 text-success-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-neutral-900">Interview Complete!</h2>
        <p className="text-sm text-neutral-500 mt-1">
          {role ? `${role} · ` : ''}{difficulty}
        </p>
        {source === 'ai' && (
          <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-700 border border-brand-100">
            ✦ Evaluated by Gemini AI
          </span>
        )}
      </div>

      {/* Score + Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex flex-col items-center justify-center gap-2 py-6">
          <CircularProgress value={overallScore} />
          <p className="text-xs font-medium text-neutral-500">Overall Score</p>
        </Card>

        <div className="sm:col-span-2 flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-3">
            <Card className="text-center py-5">
              <p className="text-3xl font-bold text-success-700">{answered}</p>
              <p className="text-xs text-neutral-500 mt-1">Answered</p>
            </Card>
            <Card className="text-center py-5">
              <p className="text-3xl font-bold text-neutral-400">{unanswered}</p>
              <p className="text-xs text-neutral-500 mt-1">Skipped</p>
            </Card>
            <Card className="text-center py-5">
              <p className="text-3xl font-bold text-brand-400">{completion}%</p>
              <p className="text-xs text-neutral-500 mt-1">Completion</p>
            </Card>
          </div>

          {/* Category bars */}
          {categoryScores.length > 0 && (
            <Card>
              <p className="text-xs font-semibold text-neutral-500 mb-3">Score by Category</p>
              <div className="space-y-2.5">
                {categoryScores.map(({ category, avg }) => (
                  <div key={category}>
                    <div className="flex justify-between text-xs text-neutral-500 mb-1">
                      <span>{category}</span>
                      <span className="font-medium text-neutral-700">{avg}/100</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${avg}%`,
                          background: avg >= 70
                            ? 'linear-gradient(90deg,#22c55e,#16a34a)'
                            : avg >= 40
                            ? 'linear-gradient(90deg,#f59e0b,#d97706)'
                            : 'linear-gradient(90deg,#ef4444,#dc2626)',
                          boxShadow: avg >= 70
                            ? '0 0 6px rgba(34,197,94,0.4)'
                            : avg >= 40
                            ? '0 0 6px rgba(245,158,11,0.4)'
                            : '0 0 6px rgba(239,68,68,0.4)',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Performance Summary */}
      <Card>
        <h3 className="text-sm font-semibold text-neutral-700 mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <p className="text-xs font-medium text-neutral-500 mb-2">Strong Topics</p>
            <div className="flex flex-wrap gap-1.5">
              {strongTopics.length > 0
                ? strongTopics.map((t) => <Chip key={t} label={t} variant="green" />)
                : <span className="text-xs text-neutral-400 italic">None identified</span>}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500 mb-2">Weak Topics</p>
            <div className="flex flex-wrap gap-1.5">
              {weakTopics.length > 0
                ? weakTopics.map((t) => <Chip key={t} label={t} variant="red" />)
                : <span className="text-xs text-neutral-400 italic">None identified</span>}
            </div>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs font-medium text-neutral-500 mb-2">Most Missed Keywords</p>
            <div className="flex flex-wrap gap-1.5">
              {mostMissed.length > 0
                ? mostMissed.map((kw) => <Chip key={kw} label={kw} variant="neutral" />)
                : <span className="text-xs text-neutral-400 italic">—</span>}
            </div>
          </div>
        </div>
      </Card>

      {/* Question-wise Report */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-neutral-700">Question-wise Report</h3>
        {questions.map((q, i) => {
          const ev = evaluations[i];
          const userAnswer = (answers[q.id] || '').trim();
          return (
            <Card key={q.id} padding={false} className="p-5 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs text-neutral-400 font-medium pt-1">
                  Q{i + 1} · {q.category} · {q.difficulty}
                </p>
                <ScoreBadge score={ev.score} />
              </div>

              {/* Question */}
              <p className="text-sm font-medium text-neutral-900 leading-relaxed">{q.question}</p>

              {/* Candidate answer */}
              <div>
                <p className="text-xs font-semibold text-neutral-500 mb-1.5">Your Answer</p>
                {userAnswer
                  ? <div className="bg-neutral-50 rounded-lg p-3 text-sm text-neutral-700 whitespace-pre-wrap">{userAnswer}</div>
                  : <p className="text-sm text-neutral-400 italic">No answer provided.</p>}
              </div>

              {/* Ideal answer */}
              <div>
                <p className="text-xs font-semibold text-neutral-500 mb-1.5">Ideal Answer</p>
                <div className="bg-brand-50 border border-brand-100 rounded-lg p-3 text-sm text-neutral-700 whitespace-pre-wrap">
                  {q.idealAnswer}
                </div>
              </div>

              {/* AI Better Answer */}
              {ev.betterAnswer && (
                <div>
                  <p className="text-xs font-semibold text-neutral-500 mb-1.5">AI Better Answer</p>
                  <div className="bg-success-100 rounded-lg p-3 text-sm text-neutral-700 whitespace-pre-wrap">
                    {ev.betterAnswer}
                  </div>
                </div>
              )}

              {/* Keywords */}
              <div className="space-y-3 pt-1">
                {ev.matchedKeywords?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 mb-1.5">Matched Keywords</p>
                    <div className="flex flex-wrap gap-1">
                      {ev.matchedKeywords.map((kw) => <Chip key={kw} label={kw} variant="green" />)}
                    </div>
                  </div>
                )}
                {ev.missingKeywords?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 mb-1.5">Missing Keywords</p>
                    <div className="flex flex-wrap gap-1">
                      {ev.missingKeywords.map((kw) => <Chip key={kw} label={kw} variant="red" />)}
                    </div>
                  </div>
                )}
              </div>

              {/* Strengths */}
              {ev.strengths?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-neutral-500 mb-1.5">Strengths</p>
                  <ul className="space-y-1">
                    {ev.strengths.map((s, j) => (
                      <li key={j} className="flex items-start gap-1.5 text-xs text-success-700">
                        <span className="mt-0.5 flex-shrink-0">✓</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Weaknesses */}
              {ev.weaknesses?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-neutral-500 mb-1.5">Weaknesses</p>
                  <ul className="space-y-1">
                    {ev.weaknesses.map((w, j) => (
                      <li key={j} className="flex items-start gap-1.5 text-xs text-danger-700">
                        <span className="mt-0.5 flex-shrink-0">✗</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggestions (rule-based fallback only) */}
              {ev.suggestions?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-neutral-500 mb-1.5">Suggestions</p>
                  <ul className="space-y-1">
                    {ev.suggestions.map((s, j) => (
                      <li key={j} className="flex items-start gap-1.5 text-xs text-neutral-600">
                        <span className="mt-0.5 text-warning-700 flex-shrink-0">→</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Follow-up Question (AI) */}
              {ev.followUpQuestion && (
                <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-xs font-semibold text-neutral-500 mb-1.5">Follow-up Question</p>
                  <p className="text-sm text-brand-700 font-medium leading-relaxed">{ev.followUpQuestion}</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <Button variant="outline" fullWidth onClick={onReturn}>
        ← Return to Interviews
      </Button>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function InterviewSession() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [phase, setPhase] = useState('setup');
  const [sessionRole, setSessionRole] = useState('');
  const [sessionDifficulty, setSessionDifficulty] = useState('Medium');
  const [questions, setQuestions] = useState([]);
  const [finalAnswers, setFinalAnswers] = useState({});
  const [evaluation, setEvaluation] = useState(null);
  const startedAtRef = useRef(null);

  const handleStart = (role, difficulty) => {
    const generated = generateQuestions(difficulty);
    setSessionRole(role);
    setSessionDifficulty(difficulty);
    setQuestions(generated);
    startedAtRef.current = new Date().toISOString();
    setPhase('active');
  };

  const handleFinish = async (answers) => {
    setFinalAnswers(answers);
    setPhase('evaluating');

    let result;
    try {
      const questionsForEval = questions.map((q) => ({
        question:        q.question,
        idealAnswer:     q.idealAnswer,
        candidateAnswer: answers[q.id] || '',
      }));
      const aiEvals = await evaluateAnswers(questionsForEval);
      result = buildAIEvaluation(questions, answers, aiEvals);
    } catch {
      result = evaluateInterview(questions, answers);
    }

    setEvaluation(result);
    setPhase('results');

    // Save to backend (fire and forget)
    const questionsPayload = questions.map((q, i) => ({
      question:    q.question,
      answer:      answers[q.id] || '',
      idealAnswer: q.idealAnswer,
      score:       result.evaluations[i].score,
    }));

    const autoFeedback =
      result.overallScore >= 70
        ? `Strong performance. Review: ${result.weakTopics.join(', ') || 'keep it up'}.`
        : result.overallScore >= 40
        ? `Decent attempt. Improve: ${result.weakTopics.join(', ') || 'weak areas'}.`
        : `Needs improvement. Focus on: ${result.weakTopics.join(', ') || 'all topics'}.`;

    const payload = {
      role:        sessionRole,
      difficulty:  sessionDifficulty,
      questions:   questionsPayload,
      score:       result.overallScore,
      status:      'Completed',
      feedback:    autoFeedback,
      startedAt:   startedAtRef.current || new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    try {
      if (state?.interviewId) {
        await updateInterview(state.interviewId, payload);
      } else {
        await createInterview(payload);
      }
    } catch {
      // non-critical — results are shown regardless
    }
  };

  const handleReturn = () => navigate('/interview');

  return (
    <DashboardLayout title="Interview Session">
      <div className="pb-8">
        {phase === 'setup' && (
          <SetupScreen
            initialRole={state?.role || ''}
            initialDifficulty={state?.difficulty || 'Medium'}
            onStart={handleStart}
          />
        )}
        {phase === 'active' && (
          <ActiveSession
            role={sessionRole}
            difficulty={sessionDifficulty}
            questions={questions}
            onFinish={handleFinish}
          />
        )}
        {phase === 'evaluating' && (
          <div className="max-w-3xl mx-auto flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-neutral-200 border-t-brand-600 animate-spin" />
            <p className="text-base font-medium text-neutral-700">Evaluating your answers…</p>
            <p className="text-sm text-neutral-400">Gemini AI is reviewing your responses</p>
          </div>
        )}
        {phase === 'results' && evaluation && (
          <ResultsScreen
            role={sessionRole}
            difficulty={sessionDifficulty}
            questions={questions}
            answers={finalAnswers}
            evaluation={evaluation}
            onReturn={handleReturn}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
