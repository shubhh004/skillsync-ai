const templateStyles = {
  1: {
    name:    'text-2xl font-bold text-neutral-900 tracking-tight',
    contact: 'text-neutral-500',
    heading: 'text-xs font-bold uppercase tracking-widest text-neutral-700 border-b border-neutral-300 pb-0.5 mb-2 mt-5',
    accent:  'text-neutral-700',
    link:    'text-neutral-500',
  },
  2: {
    name:    'text-2xl font-bold text-brand-700 tracking-tight',
    contact: 'text-brand-400',
    heading: 'text-xs font-bold uppercase tracking-widest text-brand-600 border-b border-brand-200 pb-0.5 mb-2 mt-5',
    accent:  'text-brand-600',
    link:    'text-brand-500',
  },
};

function PreviewSection({ title, children, style }) {
  return (
    <div>
      <h3 className={style.heading}>{title}</h3>
      {children}
    </div>
  );
}

export default function ResumePreview({ data, template }) {
  const s = templateStyles[template] ?? templateStyles[1];
  const { personal, education, skills, experience, projects, certifications } = data;

  return (
    <div className="bg-white p-8 min-h-full font-sans text-sm text-neutral-800 leading-relaxed">
      {/* Header */}
      <div className="mb-2">
        <h1 className={s.name}>{personal.name || 'Your Name'}</h1>
        <p className={`text-xs mt-1 ${s.contact}`}>
          {[personal.email, personal.phone, personal.location].filter(Boolean).join(' · ')}
        </p>
        {(personal.linkedin || personal.github) && (
          <p className={`text-xs mt-0.5 ${s.link}`}>
            {[personal.linkedin, personal.github].filter(Boolean).join(' · ')}
          </p>
        )}
      </div>

      {/* Summary */}
      {personal.summary && (
        <PreviewSection title="Summary" style={s}>
          <p className="text-xs text-neutral-700 leading-relaxed">{personal.summary}</p>
        </PreviewSection>
      )}

      {/* Education */}
      {education.length > 0 && (
        <PreviewSection title="Education" style={s}>
          <div className="space-y-2">
            {education.map((e) => (
              <div key={e.id} className="flex justify-between items-start gap-4">
                <div>
                  <p className="text-xs font-semibold text-neutral-900">{e.degree || 'Degree'}</p>
                  <p className={`text-xs ${s.accent}`}>{e.institution}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-neutral-500">{e.year}</p>
                  {e.gpa && <p className="text-xs text-neutral-500">{e.gpa}</p>}
                </div>
              </div>
            ))}
          </div>
        </PreviewSection>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <PreviewSection title="Experience" style={s}>
          <div className="space-y-3">
            {experience.map((e) => (
              <div key={e.id}>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="text-xs font-semibold text-neutral-900">{e.role || 'Role'}</p>
                    <p className={`text-xs ${s.accent}`}>{e.company}</p>
                  </div>
                  <p className="text-xs text-neutral-500 flex-shrink-0">{e.duration}</p>
                </div>
                {e.description && (
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{e.description}</p>
                )}
              </div>
            ))}
          </div>
        </PreviewSection>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <PreviewSection title="Projects" style={s}>
          <div className="space-y-3">
            {projects.map((p) => (
              <div key={p.id}>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <p className="text-xs font-semibold text-neutral-900">{p.title || 'Project'}</p>
                  {p.tech && <p className={`text-xs ${s.accent}`}>· {p.tech}</p>}
                  {p.link && <p className={`text-xs ${s.link}`}>· {p.link}</p>}
                </div>
                {p.description && (
                  <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">{p.description}</p>
                )}
              </div>
            ))}
          </div>
        </PreviewSection>
      )}

      {/* Skills */}
      {Object.values(skills).some(Boolean) && (
        <PreviewSection title="Skills" style={s}>
          <div className="space-y-1">
            {[
              { label: 'Languages',            value: skills.languages  },
              { label: 'Frameworks',           value: skills.frameworks },
              { label: 'Tools & Platforms',    value: skills.tools      },
              { label: 'Concepts',             value: skills.concepts   },
            ].filter(({ value }) => value).map(({ label, value }) => (
              <p key={label} className="text-xs text-neutral-700">
                <span className="font-semibold">{label}: </span>{value}
              </p>
            ))}
          </div>
        </PreviewSection>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <PreviewSection title="Certifications" style={s}>
          <div className="space-y-1">
            {certifications.map((c) => (
              <div key={c.id} className="flex justify-between items-center gap-4">
                <div>
                  <p className="text-xs font-semibold text-neutral-900">{c.name || 'Certificate'}</p>
                  {c.issuer && <p className={`text-xs ${s.accent}`}>{c.issuer}</p>}
                </div>
                {c.year && <p className="text-xs text-neutral-500 flex-shrink-0">{c.year}</p>}
              </div>
            ))}
          </div>
        </PreviewSection>
      )}
    </div>
  );
}
