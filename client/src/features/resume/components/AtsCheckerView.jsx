import { useState, useEffect, useCallback } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { getAtsScore, matchJD } from '../../../services/resumeService';

const SECTION_LABELS = {
  contact:        'Contact Info',
  education:      'Education',
  skills:         'Skills',
  experience:     'Experience',
  projects:       'Projects',
  certifications: 'Certifications',
  achievements:   'Achievements',
};

// 4-tier: 90+ green, 70+ blue, 50+ amber, <50 red
function scoreStyle(pct) {
  if (pct >= 90) return { text: 'text-success-600', stroke: '#16a34a', bar: 'bg-success-500', accent: '#f0fdf4' };
  if (pct >= 70) return { text: 'text-brand-400',   stroke: '#6366f1', bar: 'bg-brand-500',   accent: '#1e1b4b' };
  if (pct >= 50) return { text: 'text-warning-600', stroke: '#ca8a04', bar: 'bg-warning-500', accent: '#fefce8' };
  return          { text: 'text-danger-600',         stroke: '#dc2626', bar: 'bg-danger-500',  accent: '#fef2f2' };
}

function scoreLabel(score) {
  if (score >= 90) return 'Excellent — ATS Ready';
  if (score >= 70) return 'Good — Minor improvements needed';
  if (score >= 50) return 'Fair — Needs more work';
  return 'Weak — Significant work required';
}

function categorizeSuggestions(ats = [], jd = []) {
  const seen = new Set();
  const deduped = [];
  for (const s of [...ats, ...jd]) {
    const key = s.toLowerCase().slice(0, 50);
    if (!seen.has(key)) { seen.add(key); deduped.push(s); }
  }
  const high = [], medium = [], optional = [];
  for (const s of deduped) {
    if (/full name|email|phone number|your location|education detail|very few|significant work/i.test(s)) {
      high.push(s);
    } else if (/skills|projects|experience|internship|linkedin|github|keyword|match|coverage|terminology/i.test(s)) {
      medium.push(s);
    } else {
      optional.push(s);
    }
  }
  return { high, medium, optional };
}

function CircularScore({ score }) {
  const r    = 54;
  const circ = 2 * Math.PI * r;
  const { text, stroke, accent } = scoreStyle(score);
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-full p-3" style={{ background: accent }}>
        <svg width="148" height="148" viewBox="0 0 148 148" aria-label={`ATS score ${score} out of 100`}>
          <circle cx="74" cy="74" r={r} fill="none" stroke="#e5e7eb" strokeWidth="12" />
          <circle
            cx="74" cy="74" r={r}
            fill="none"
            stroke={stroke}
            strokeWidth="12"
            strokeDasharray={circ}
            strokeDashoffset={circ - (score / 100) * circ}
            strokeLinecap="round"
            transform="rotate(-90 74 74)"
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }}
          />
          <text x="74" y="67" textAnchor="middle" fontSize="32" fontWeight="700" fill={stroke}>{score}</text>
          <text x="74" y="90" textAnchor="middle" fontSize="13" fill="#9ca3af">out of 100</text>
        </svg>
      </div>
      <span className={`text-sm font-semibold ${text}`}>{scoreLabel(score)}</span>
    </div>
  );
}

function SectionIcon({ pct }) {
  if (pct === 100) return (
    <svg className="w-3.5 h-3.5 text-success-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
  if (pct === 0) return (
    <svg className="w-3.5 h-3.5 text-danger-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
  return (
    <svg className="w-3.5 h-3.5 text-warning-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01" />
    </svg>
  );
}

function SectionBreakdown({ breakdown, sectionQuality }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {Object.entries(breakdown).map(([key, { score, max }]) => {
        const pct  = Math.round((score / max) * 100);
        const { text, bar } = scoreStyle(pct);
        const sq   = sectionQuality?.[key];
        const qPct = sq ? Math.round((sq.quality / sq.max) * 100) : null;
        return (
          <Card key={key} padding={false} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <SectionIcon pct={pct} />
                <span className="text-sm font-medium text-neutral-700">{SECTION_LABELS[key]}</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-xs font-bold ${text}`}>{score}/{max}</span>
                {sq && (
                  <span className={`text-xs font-medium ${scoreStyle(qPct).text} opacity-80`}>
                    · Q {sq.quality}
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${bar}`} style={{ width: `${pct}%` }} />
              </div>
              {qPct !== null && (
                <div className="h-1 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${scoreStyle(qPct).bar} opacity-50`}
                    style={{ width: `${qPct}%` }}
                  />
                </div>
              )}
            </div>
            {sq && (
              <p className="text-xs text-neutral-400 mt-1.5">
                Completeness {score}/{max} · Quality {sq.quality}/{sq.max}
              </p>
            )}
          </Card>
        );
      })}
    </div>
  );
}

const PRIORITY = {
  high:     { label: 'High Priority',         chipCls: 'bg-danger-100 text-danger-700',   dotCls: 'bg-danger-400' },
  medium:   { label: 'Medium Priority',       chipCls: 'bg-warning-100 text-warning-700', dotCls: 'bg-warning-400' },
  optional: { label: 'Optional Improvements', chipCls: 'bg-neutral-100 text-neutral-600', dotCls: 'bg-neutral-400' },
};

function mergeDedup(a, b) {
  const seen = new Set(a.map(s => s.slice(0, 45).toLowerCase()));
  const out = [...a];
  for (const s of b) {
    const k = s.slice(0, 45).toLowerCase();
    if (!seen.has(k)) { seen.add(k); out.push(s); }
  }
  return out;
}

function SmartSuggestions({ atsSuggestions, qualitySuggestions, jdRecommendations }) {
  const preHigh     = qualitySuggestions?.high     ?? [];
  const preMedium   = qualitySuggestions?.medium   ?? [];
  const preOptional = qualitySuggestions?.optional ?? [];

  const { high: fH, medium: fM, optional: fO } = categorizeSuggestions(atsSuggestions, jdRecommendations);

  const high     = mergeDedup(preHigh,     fH);
  const medium   = mergeDedup(preMedium,   fM);
  const optional = mergeDedup(preOptional, fO);
  const total = high.length + medium.length + optional.length;

  if (total === 0) {
    return (
      <Card className="flex flex-col items-center gap-2 py-8 text-center">
        <svg className="w-9 h-9 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm font-semibold text-success-700">No suggestions — your resume looks great!</p>
        <p className="text-xs text-neutral-500">All key sections are filled and well-structured.</p>
      </Card>
    );
  }

  return (
    <Card padding={false} className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-neutral-900">Smart Suggestions</h4>
        <span className="text-xs text-neutral-400">{total} item{total !== 1 ? 's' : ''}</span>
      </div>
      <div className="space-y-4">
        {(['high', 'medium', 'optional']).map(level => {
          const items = level === 'high' ? high : level === 'medium' ? medium : optional;
          if (items.length === 0) return null;
          const { label, chipCls, dotCls } = PRIORITY[level];
          return (
            <div key={level}>
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2 ${chipCls}`}>
                {label}
                <span className="opacity-60">· {items.length}</span>
              </div>
              <ul className="space-y-2 pl-1">
                {items.map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className={`mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full ${dotCls}`} />
                    <span className="text-xs text-neutral-600 leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function QualityInsights({ qualityScore, technicalKeywordCount, actionVerbCount, impactMetrics }) {
  const { text, bar } = scoreStyle(qualityScore);
  return (
    <Card padding={false} className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-neutral-900">Resume Quality Score</h4>
        <span className={`text-lg font-bold ${text}`}>
          {qualityScore}<span className="text-xs text-neutral-400 font-normal">/100</span>
        </span>
      </div>
      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden mb-4">
        <div className={`h-full rounded-full transition-all duration-700 ${bar}`} style={{ width: `${qualityScore}%` }} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center px-2 py-2.5 rounded-lg bg-brand-50">
          <span className="text-base font-bold text-brand-700">{technicalKeywordCount}</span>
          <span className="text-xs text-brand-400 mt-0.5 text-center leading-tight">Tech Keywords</span>
        </div>
        <div className="flex flex-col items-center px-2 py-2.5 rounded-lg bg-success-50">
          <span className="text-base font-bold text-success-700">{actionVerbCount}</span>
          <span className="text-xs text-success-600 mt-0.5 text-center leading-tight">Action Verbs</span>
        </div>
        <div className="flex flex-col items-center px-2 py-2.5 rounded-lg bg-warning-50">
          <span className="text-base font-bold text-warning-700">{impactMetrics.length}</span>
          <span className="text-xs text-warning-600 mt-0.5 text-center leading-tight">Impact Metrics</span>
        </div>
      </div>
      {impactMetrics.length > 0 && (
        <div className="mt-3 pt-3 border-t border-neutral-200">
          <p className="text-xs text-neutral-500 mb-1.5">Detected impact phrases:</p>
          <div className="flex flex-wrap gap-1.5">
            {impactMetrics.slice(0, 6).map((m, i) => (
              <span key={i} className="px-2 py-0.5 rounded text-xs font-medium bg-warning-50 text-warning-700">{m}</span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

const FLAG_CONFIG = {
  hasWeakSummary:       { label: 'Weak Summary',       bad: true  },
  hasEnoughSkills:      { label: 'Enough Skills',      bad: false },
  hasProjects:          { label: 'Has Projects',       bad: false },
  hasNumbers:           { label: 'Impact Numbers',     bad: false },
  hasActionVerbs:       { label: 'Action Verbs',       bad: false },
  hasTechnicalKeywords: { label: 'Tech Keywords',      bad: false },
};

function QualityFlags({ flags }) {
  return (
    <Card padding={false} className="p-4">
      <h4 className="text-sm font-semibold text-neutral-700 mb-2.5">Quality Signals</h4>
      <div className="flex flex-wrap gap-2">
        {Object.entries(FLAG_CONFIG).map(([key, cfg]) => {
          const value = flags?.[key] ?? false;
          const pass  = cfg.bad ? !value : value;
          return (
            <span
              key={key}
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                pass ? 'bg-success-50 text-success-700' : 'bg-danger-50 text-danger-700'
              }`}
            >
              {pass ? '✓' : '✗'} {cfg.label}
            </span>
          );
        })}
      </div>
    </Card>
  );
}

function Skeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <Card className="flex flex-col items-center gap-4 py-10">
        <div className="w-40 h-40 rounded-full bg-neutral-200" />
        <div className="h-4 w-48 rounded bg-neutral-200" />
      </Card>
      <div className="space-y-3">
        <div className="h-4 w-36 rounded bg-neutral-200" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <Card key={i} padding={false} className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-3.5 w-28 rounded bg-neutral-200" />
                <div className="h-3.5 w-10 rounded bg-neutral-200" />
              </div>
              <div className="h-1.5 rounded-full bg-neutral-100" />
            </Card>
          ))}
        </div>
      </div>
      <Card padding={false} className="p-4 space-y-3">
        <div className="h-4 w-32 rounded bg-neutral-200" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-200 flex-shrink-0" />
            <div className="h-3 rounded bg-neutral-100 flex-1" />
          </div>
        ))}
      </Card>
    </div>
  );
}

export default function AtsCheckerView() {
  const [data,         setData]         = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [jdText,       setJdText]       = useState('');
  const [matchData,    setMatchData]    = useState(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchError,   setMatchError]   = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await getAtsScore());
    } catch {
      setError('Unable to connect to the server. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const analyze = useCallback(async () => {
    if (!jdText.trim()) return;
    setMatchLoading(true);
    setMatchError(null);
    try {
      setMatchData(await matchJD(jdText));
    } catch {
      setMatchError('Analysis failed. Please check your connection and try again.');
    } finally {
      setMatchLoading(false);
    }
  }, [jdText]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Skeleton />;

  if (error) {
    return (
      <Card className="flex flex-col items-center gap-4 py-14 text-center">
        <div className="w-13 h-13 rounded-full bg-danger-50 flex items-center justify-center p-3">
          <svg className="w-7 h-7 text-danger-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-800 mb-1">Unable to load ATS Score</p>
          <p className="text-xs text-neutral-500 max-w-xs">{error}</p>
        </div>
        <Button variant="outline" size="sm" onClick={load}>Try Again</Button>
      </Card>
    );
  }

  const allMissing = data.missingSections.length === Object.keys(data.breakdown).length;

  if (allMissing) {
    return (
      <Card className="flex flex-col items-center gap-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-700 mb-1">Your resume is empty</p>
          <p className="text-sm text-neutral-500 max-w-xs">
            Switch to the <span className="font-medium text-brand-400">Builder</span> tab, fill in your details, and save to see your ATS score.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-neutral-900">ATS Score Analysis</h3>
          <p className="mt-0.5 text-sm text-neutral-500">Based on your saved resume data</p>
        </div>
        <Button variant="outline" size="sm" onClick={load}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </Button>
      </div>

      {/* Circular score */}
      <Card className="flex flex-col items-center py-6">
        <CircularScore score={data.score} />
      </Card>

      {/* Quality Insights */}
      <QualityInsights
        qualityScore={data.qualityScore ?? 0}
        technicalKeywordCount={data.technicalKeywordCount ?? 0}
        actionVerbCount={data.actionVerbCount ?? 0}
        impactMetrics={data.impactMetrics ?? []}
      />

      {/* Quality Flags */}
      {data.qualityFlags && <QualityFlags flags={data.qualityFlags} />}

      {/* Section breakdown */}
      <div>
        <h4 className="text-sm font-semibold text-neutral-700 mb-1">Section Breakdown</h4>
        <p className="text-xs text-neutral-400 mb-3">Top bar = Completeness · Bottom bar = Quality</p>
        <SectionBreakdown breakdown={data.breakdown} sectionQuality={data.sectionQuality} />
      </div>

      {/* Missing sections */}
      {data.missingSections.length > 0 && (
        <Card padding={false} className="p-4">
          <h4 className="text-sm font-semibold text-neutral-700 mb-2.5">Missing Sections</h4>
          <div className="flex flex-wrap gap-2">
            {data.missingSections.map(s => (
              <span key={s} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger-50 text-danger-700">
                {SECTION_LABELS[s] ?? s}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Smart Suggestions — merges backend quality suggestions + ATS + JD */}
      <SmartSuggestions
        atsSuggestions={data.suggestions}
        qualitySuggestions={data.qualitySuggestions}
        jdRecommendations={matchData?.recommendations ?? []}
      />

      {/* ── Job Description Match ── */}
      <div>
        <div className="border-t border-neutral-200 mb-6" />
        <div className="mb-4">
          <h3 className="text-base font-semibold text-neutral-900">Job Description Match</h3>
          <p className="mt-0.5 text-sm text-neutral-500">
            Paste a job description to see how well your resume aligns with the role.
          </p>
        </div>

        <div className="space-y-3">
          <textarea
            value={jdText}
            onChange={e => { setJdText(e.target.value); setMatchData(null); setMatchError(null); }}
            placeholder="Paste the full job description here..."
            rows={6}
            className="w-full rounded-lg border border-neutral-200 bg-neutral-100 px-3 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-y transition"
          />
          <Button onClick={analyze} disabled={!jdText.trim() || matchLoading} size="sm">
            {matchLoading ? 'Analyzing...' : 'Analyze Match'}
          </Button>
        </div>

        {matchError && (
          <Card padding={false} className="flex items-start gap-3 mt-4 p-4">
            <svg className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-neutral-800">Analysis failed</p>
              <p className="text-xs text-neutral-500 mt-0.5">{matchError}</p>
            </div>
          </Card>
        )}

        {matchData && (
          <div className="space-y-4 mt-5">
            {/* Match % */}
            <Card padding={false} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-neutral-700">Match Percentage</span>
                <span className={`text-lg font-bold ${scoreStyle(matchData.matchPercentage).text}`}>
                  {matchData.matchPercentage}%
                </span>
              </div>
              <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${scoreStyle(matchData.matchPercentage).bar}`}
                  style={{ width: `${matchData.matchPercentage}%` }}
                />
              </div>
            </Card>

            {/* Matched skills */}
            <Card padding={false} className="p-4">
              <h4 className="text-sm font-semibold text-neutral-700 mb-2.5">
                Matched Skills
                {matchData.matchedSkills.length > 0 && (
                  <span className="ml-2 text-xs font-normal text-success-600">({matchData.matchedSkills.length})</span>
                )}
              </h4>
              {matchData.matchedSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {matchData.matchedSkills.map(s => (
                    <span key={s} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-50 text-success-700">
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-500">None of your listed skills appear in this job description. Add role-specific skills in the Builder tab.</p>
              )}
            </Card>

            {/* Missing keywords */}
            {matchData.missingSkills.length > 0 && (
              <Card padding={false} className="p-4">
                <h4 className="text-sm font-semibold text-neutral-700 mb-2.5">
                  Keywords in JD Not on Resume
                  <span className="ml-2 text-xs font-normal text-danger-600">({matchData.missingSkills.length})</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {matchData.missingSkills.map(s => (
                    <span key={s} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger-50 text-danger-700">
                      {s}
                    </span>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
