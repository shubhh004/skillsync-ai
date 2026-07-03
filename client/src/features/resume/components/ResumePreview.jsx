import { groupSkills } from '../../../utils/skillsUtils';

// ─── Document-scoped palette — completely isolated from app theme ─────────────
// These are hardcoded hex values, never Tailwind classes. The resume must render
// correctly regardless of whether the app is in dark or light mode.
const TEMPLATES = {
  1: {
    name:    { color: '#111827', fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 },
    contact: { color: '#4B5563', fontSize: '10px' },
    link:    { color: '#2563EB', fontSize: '10px' },
    heading: {
      color: '#1F2937', fontSize: '9px', fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.1em',
      borderBottom: '1px solid #D1D5DB',
      paddingBottom: '2px', marginBottom: '7px',
    },
    bold:   { color: '#111827', fontWeight: 600 },
    accent: { color: '#374151' },
    meta:   { color: '#6B7280', flexShrink: 0 },
    body:   { color: '#374151', lineHeight: 1.6 },
  },
  2: {
    name:    { color: '#312E81', fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 },
    contact: { color: '#6366F1', fontSize: '10px' },
    link:    { color: '#4338CA', fontSize: '10px' },
    heading: {
      color: '#312E81', fontSize: '9px', fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.1em',
      borderBottom: '1px solid #C7D2FE',
      paddingBottom: '2px', marginBottom: '7px',
    },
    bold:   { color: '#1E1B4B', fontWeight: 600 },
    accent: { color: '#4338CA' },
    meta:   { color: '#6366F1', flexShrink: 0 },
    body:   { color: '#374151', lineHeight: 1.6 },
  },
};

const RESET  = { margin: 0, padding: 0 };
const ROW    = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' };
const COL    = { display: 'flex', flexDirection: 'column' };
const SECTION_TOP = '14px';

function Section({ title, children, s }) {
  return (
    <div style={{ marginTop: SECTION_TOP }}>
      <div style={{ ...s.heading }}>{title}</div>
      {children}
    </div>
  );
}

export default function ResumePreview({ data, template }) {
  const s = TEMPLATES[template] ?? TEMPLATES[1];
  const { personal, education, skills, experience, projects, certifications, achievements } = data;

  return (
    <div
      className="resume-preview"
      style={{
        // Explicit document base — overrides all inherited theme colors
        background:  '#FFFFFF',
        color:       '#111827',
        fontFamily:  "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize:    '11px',
        lineHeight:  1.6,
        padding:     '32px',
        minHeight:   '100%',
        WebkitTextFillColor: 'initial',
      }}
    >

      {/* ── Header ─────────────────────────────────────────── */}
      <div>
        <h1 style={{ ...s.name, ...RESET }}>
          {personal.fullName || 'Your Name'}
        </h1>
        <p style={{ ...s.contact, ...RESET, marginTop: '5px' }}>
          {[personal.email, personal.phone, personal.location].filter(Boolean).join(' · ')}
        </p>
        {(personal.linkedin || personal.github || personal.portfolio) && (
          <p style={{ ...s.link, ...RESET, marginTop: '2px' }}>
            {[personal.linkedin, personal.github, personal.portfolio].filter(Boolean).join(' · ')}
          </p>
        )}
      </div>

      {/* ── Summary ─────────────────────────────────────────── */}
      {personal.summary && (
        <Section title="Summary" s={s}>
          <p style={{ ...s.body, ...RESET }}>{personal.summary}</p>
        </Section>
      )}

      {/* ── Education ─────────────────────────────────────────── */}
      {education.length > 0 && (
        <Section title="Education" s={s}>
          <div style={{ ...COL, gap: '8px' }}>
            {education.map((e) => (
              <div key={e.id} style={ROW}>
                <div>
                  <p style={{ ...s.bold, ...RESET }}>{e.degree || 'Degree'}</p>
                  <p style={{ ...s.accent, ...RESET }}>{e.institution}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ ...s.meta, ...RESET }}>{e.year}</p>
                  {e.gpa && <p style={{ ...s.meta, ...RESET }}>GPA: {e.gpa}</p>}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Experience ─────────────────────────────────────────── */}
      {experience.length > 0 && (
        <Section title="Experience" s={s}>
          <div style={{ ...COL, gap: '10px' }}>
            {experience.map((e) => (
              <div key={e.id}>
                <div style={ROW}>
                  <div>
                    <p style={{ ...s.bold, ...RESET }}>{e.role || 'Role'}</p>
                    <p style={{ ...s.accent, ...RESET }}>{e.company}</p>
                  </div>
                  <p style={{ ...s.meta, ...RESET }}>{e.duration}</p>
                </div>
                {e.description && (
                  <p style={{ ...s.body, ...RESET, marginTop: '4px' }}>{e.description}</p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Projects ─────────────────────────────────────────── */}
      {projects.length > 0 && (
        <Section title="Projects" s={s}>
          <div style={{ ...COL, gap: '10px' }}>
            {projects.map((p) => (
              <div key={p.id}>
                <p style={RESET}>
                  <span style={s.bold}>{p.title || 'Project'}</span>
                  {p.tech && <span style={{ ...s.accent, marginLeft: '4px' }}>· {p.tech}</span>}
                  {p.link && <span style={{ ...s.link, marginLeft: '4px' }}>· {p.link}</span>}
                </p>
                {p.description && (
                  <p style={{ ...s.body, ...RESET, marginTop: '3px' }}>{p.description}</p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Skills ─────────────────────────────────────────── */}
      {skills.length > 0 && (
        <Section title="Skills" s={s}>
          <div style={{ ...COL, gap: '2px' }}>
            {Object.entries(groupSkills(skills)).map(([cat, list]) => (
              <p key={cat} style={{ ...s.body, ...RESET }}>
                <span style={s.bold}>{cat}:</span>{' '}
                <span style={{ color: '#374151' }}>{list.join(', ')}</span>
              </p>
            ))}
          </div>
        </Section>
      )}

      {/* ── Certifications ─────────────────────────────────────────── */}
      {certifications.length > 0 && (
        <Section title="Certifications" s={s}>
          <div style={{ ...COL, gap: '6px' }}>
            {certifications.map((c) => (
              <div key={c.id} style={{ ...ROW, alignItems: 'center' }}>
                <div>
                  <p style={{ ...s.bold, ...RESET }}>{c.name || 'Certificate'}</p>
                  {c.issuer && <p style={{ ...s.accent, ...RESET }}>{c.issuer}</p>}
                </div>
                {c.year && <p style={{ ...s.meta, ...RESET }}>{c.year}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Achievements ─────────────────────────────────────────── */}
      {achievements.length > 0 && (
        <Section title="Achievements" s={s}>
          <div style={{ ...COL, gap: '6px' }}>
            {achievements.map((a) => (
              <div key={a.id}>
                <p style={{ ...s.bold, ...RESET }}>{a.title}</p>
                {a.description && (
                  <p style={{ ...s.body, ...RESET, marginTop: '2px' }}>{a.description}</p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

    </div>
  );
}
