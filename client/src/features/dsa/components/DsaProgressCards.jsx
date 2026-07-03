// ─── SVG ring progress indicator ─────────────────────────────────────────────
function Ring({ solved, total, stroke, size = 88 }) {
  const r    = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const pct  = total === 0 ? 0 : Math.min(solved / total, 1);
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg
        width={size} height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={stroke}
          strokeWidth="8"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)',
            filter: `drop-shadow(0 0 5px ${stroke}80)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold leading-none" style={{ color: stroke }}>{solved}</span>
        <span className="text-[10px] text-neutral-500 mt-0.5">/ {total}</span>
      </div>
    </div>
  );
}

// ─── Quick stat card ──────────────────────────────────────────────────────────
function StatCard({ label, value, sub, iconBg, iconStroke, icon }) {
  return (
    <div className="card p-4 flex flex-col justify-between gap-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider leading-none">{label}</p>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: iconBg }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={iconStroke} strokeWidth={1.8}>
            {icon}
          </svg>
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-neutral-900 leading-none tracking-tight">{value}</p>
        <p className="text-xs text-neutral-500 mt-1.5">{sub}</p>
      </div>
    </div>
  );
}

// ─── Difficulty breakdown card ────────────────────────────────────────────────
function DifficultyCard({ label, solved, total, stroke, barColor }) {
  const pct = total === 0 ? 0 : Math.round((solved / total) * 100);
  return (
    <div className="card p-4 flex flex-col items-center gap-3.5">
      <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider self-start">{label}</p>
      <Ring solved={solved} total={total} stroke={stroke} size={88} />
      <div className="w-full space-y-1.5">
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: barColor, boxShadow: `0 0 6px ${stroke}60` }}
          />
        </div>
        <p className="text-xs font-semibold text-center" style={{ color: stroke }}>{pct}% solved</p>
      </div>
    </div>
  );
}

// ─── Achievement badge ────────────────────────────────────────────────────────
function AchievementBadge({ icon, label, desc, unlock }) {
  return (
    <div
      title={desc}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 select-none ${
        unlock ? 'hover:-translate-y-0.5 hover:shadow-card-hover cursor-default' : 'opacity-40 grayscale cursor-not-allowed'
      }`}
      style={unlock ? {
        background: 'rgba(99,102,241,0.08)',
        border: '1px solid rgba(99,102,241,0.22)',
      } : {
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <span className="text-base leading-none">{icon}</span>
      <span className={`text-xs font-semibold leading-none ${unlock ? 'text-brand-400' : 'text-neutral-600'}`}>
        {label}
      </span>
      {!unlock && (
        <svg className="w-3 h-3 text-neutral-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      )}
    </div>
  );
}

// ─── Topic distribution bar ───────────────────────────────────────────────────
function TopicBar({ topic, count, max }) {
  const pct = max === 0 ? 0 : Math.round((count / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-neutral-600 w-32 flex-shrink-0 truncate">{topic}</span>
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
            boxShadow: '0 0 6px rgba(99,102,241,0.4)',
          }}
        />
      </div>
      <span className="text-xs text-neutral-500 w-6 text-right tabular-nums flex-shrink-0">{count}</span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function DsaProgressCards({ problems }) {
  const total    = problems.length;
  const solved   = problems.filter((p) => p.status === 'Solved').length;
  const attempted = problems.filter((p) => p.status === 'Attempted').length;

  const easy   = problems.filter((p) => p.difficulty === 'Easy');
  const medium = problems.filter((p) => p.difficulty === 'Medium');
  const hard   = problems.filter((p) => p.difficulty === 'Hard');

  const easySolved   = easy.filter((p) => p.status === 'Solved').length;
  const mediumSolved = medium.filter((p) => p.status === 'Solved').length;
  const hardSolved   = hard.filter((p) => p.status === 'Solved').length;

  const topicSet = new Set(problems.map((p) => p.topic));
  const topicCount = topicSet.size;

  const topicCounts = problems.reduce((acc, p) => {
    acc[p.topic] = (acc[p.topic] || 0) + 1;
    return acc;
  }, {});
  const topTopics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxTopicCount = topTopics[0]?.[1] ?? 1;

  const ACHIEVEMENTS = [
    { id: 'first',    icon: '🚀', label: 'First Step',    desc: 'Log your first problem',         unlock: total >= 1 },
    { id: 'ten',      icon: '⚡', label: 'Double Digits', desc: 'Log 10 problems',                unlock: total >= 10 },
    { id: 'solver',   icon: '✅', label: 'Solver',         desc: 'Solve your first problem',       unlock: solved >= 1 },
    { id: 'easy',     icon: '💚', label: 'Easy Ace',      desc: 'Solve 5 easy problems',          unlock: easySolved >= 5 },
    { id: 'medium',   icon: '🔥', label: 'Medium Fire',   desc: 'Solve 5 medium problems',        unlock: mediumSolved >= 5 },
    { id: 'hard',     icon: '💎', label: 'Hard Core',     desc: 'Solve your first hard problem',  unlock: hardSolved >= 1 },
  ];

  return (
    <div className="space-y-3.5">

      {/* ── Row 1: Quick stats ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard
          label="Total Logged"
          value={total}
          sub={`${topicCount} topic${topicCount !== 1 ? 's' : ''} covered`}
          iconBg="rgba(99,102,241,0.12)"
          iconStroke="#a5b4fc"
          icon={<path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />}
        />
        <StatCard
          label="Solved"
          value={solved}
          sub={`${total === 0 ? 0 : Math.round((solved / total) * 100)}% completion rate`}
          iconBg="rgba(34,197,94,0.12)"
          iconStroke="#22c55e"
          icon={<path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
        />
        <StatCard
          label="Attempted"
          value={attempted}
          sub="still in progress"
          iconBg="rgba(234,179,8,0.12)"
          iconStroke="#f59e0b"
          icon={<path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />}
        />
        <StatCard
          label="Topics"
          value={topicCount}
          sub={`${total - solved - attempted} todo remaining`}
          iconBg="rgba(139,92,246,0.12)"
          iconStroke="#a78bfa"
          icon={<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />}
        />
      </div>

      {/* ── Row 2: Difficulty rings ────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        <DifficultyCard label="Easy"   solved={easySolved}   total={easy.length}   stroke="#22c55e" barColor="linear-gradient(90deg, #22c55e, #16a34a)" />
        <DifficultyCard label="Medium" solved={mediumSolved} total={medium.length} stroke="#f59e0b" barColor="linear-gradient(90deg, #f59e0b, #d97706)" />
        <DifficultyCard label="Hard"   solved={hardSolved}   total={hard.length}   stroke="#ef4444" barColor="linear-gradient(90deg, #ef4444, #dc2626)" />
      </div>

      {/* ── Row 3: Achievements ────────────────────────────────────────────── */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-label text-neutral-500">Achievements</p>
          <span className="text-[11px] text-neutral-500">
            {ACHIEVEMENTS.filter(a => a.unlock).length}/{ACHIEVEMENTS.length} unlocked
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {ACHIEVEMENTS.map((badge) => (
            <AchievementBadge key={badge.id} {...badge} />
          ))}
        </div>
      </div>

      {/* ── Row 4: Topic distribution ──────────────────────────────────────── */}
      {topTopics.length > 0 && (
        <div className="card p-4">
          <p className="text-label text-neutral-500 mb-3.5">Top Topics</p>
          <div className="space-y-2.5">
            {topTopics.map(([topic, count]) => (
              <TopicBar key={topic} topic={topic} count={count} max={maxTopicCount} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
