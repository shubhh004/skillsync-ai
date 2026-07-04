import { useState, useCallback, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';
import TemplateSelector from './components/TemplateSelector';
import AtsScoreCard from './components/AtsScoreCard';
import ResumePreview from './components/ResumePreview';
import PersonalInfoSection from './components/sections/PersonalInfoSection';
import EducationSection from './components/sections/EducationSection';
import SkillsSection from './components/sections/SkillsSection';
import ExperienceSection from './components/sections/ExperienceSection';
import ProjectsSection from './components/sections/ProjectsSection';
import CertificationsSection from './components/sections/CertificationsSection';
import AchievementsSection from './components/sections/AchievementsSection';
import { getResume, updateResume } from '../../services/resumeService';
import AtsCheckerView from './components/AtsCheckerView';
import { printResumePDF } from '../../utils/pdfExport';

const EMPTY_RESUME = {
  personal: {
    fullName: '', email: '', phone: '', college: '', degree: '',
    graduationYear: '', location: '', linkedin: '', github: '', portfolio: '', summary: '',
  },
  skills: [],
  education: [],
  experience: [],
  projects: [],
  certifications: [],
  achievements: [],
};

function addIds(arr) {
  return (arr || []).map((item, i) => (item.id ? item : { ...item, id: Date.now() + i }));
}

function normalizeResume(raw) {
  return {
    personal: { ...EMPTY_RESUME.personal, ...(raw.personal || {}) },
    skills: raw.skills || [],
    education: addIds(raw.education),
    experience: addIds(raw.experience),
    projects: addIds(raw.projects),
    certifications: addIds(raw.certifications),
    achievements: addIds(raw.achievements),
  };
}

// ─── Section icons ────────────────────────────────────────────────────────────
const SECTION_ICONS = {
  personal: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  skills: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  ),
  education: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
    </svg>
  ),
  experience: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
    </svg>
  ),
  projects: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  ),
  certifications: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
    </svg>
  ),
  achievements: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
    </svg>
  ),
};

const SECTIONS = [
  { key: 'personal',       label: 'Personal Information', Component: PersonalInfoSection },
  { key: 'skills',         label: 'Skills',               Component: SkillsSection },
  { key: 'education',      label: 'Education',            Component: EducationSection },
  { key: 'experience',     label: 'Experience',           Component: ExperienceSection },
  { key: 'projects',       label: 'Projects',             Component: ProjectsSection },
  { key: 'certifications', label: 'Certifications',       Component: CertificationsSection },
  { key: 'achievements',   label: 'Achievements',         Component: AchievementsSection },
];

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl text-sm font-medium flex items-center gap-2.5 animate-pop-in glass-heavy border ${
        type === 'error' ? 'border-danger-500/30' : 'border-success-500/30'
      }`}
      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
    >
      {type === 'error' ? (
        <svg className="w-4 h-4 flex-shrink-0 text-danger-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
        </svg>
      ) : (
        <svg className="w-4 h-4 flex-shrink-0 text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      <span style={{ color: type === 'error' ? '#fca5a5' : '#86efac' }}>{message}</span>
    </div>
  );
}

// ─── Section accordion chevron ────────────────────────────────────────────────
function ChevronIcon({ open }) {
  return (
    <svg
      className={`w-4 h-4 text-neutral-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// ─── Editor loading skeleton ──────────────────────────────────────────────────
function EditorSkeleton() {
  return (
    <div className="space-y-2.5">
      {[72, 64, 56, 64, 56, 56, 56].map((h, i) => (
        <div
          key={i}
          className="skeleton-shimmer rounded-2xl"
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  );
}

// ─── Resume completion bar ────────────────────────────────────────────────────
function CompletionBar({ resumeData }) {
  const checks = [
    !!resumeData.personal?.fullName,
    !!resumeData.personal?.email,
    (resumeData.skills?.length ?? 0) > 0,
    (resumeData.education?.length ?? 0) > 0,
    (resumeData.experience?.length ?? 0) > 0,
    (resumeData.projects?.length ?? 0) > 0,
    (resumeData.certifications?.length ?? 0) > 0,
  ];
  const filled = checks.filter(Boolean).length;
  const pct    = Math.round((filled / checks.length) * 100);

  return (
    <div className="card px-4 py-3 flex items-center gap-3">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-neutral-600">Resume Completion</span>
          <span className={`text-[11px] font-bold ${pct === 100 ? 'text-success-500' : pct >= 70 ? 'text-brand-400' : 'text-warning-500'}`}>
            {pct}%
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: pct === 100
                ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
              boxShadow: '0 0 6px rgba(99,102,241,0.4)',
            }}
          />
        </div>
      </div>
      <span className="text-xs text-neutral-500 flex-shrink-0">{filled}/{checks.length}</span>
    </div>
  );
}

export default function ResumePage() {
  const [resumeData,     setResumeData]     = useState(EMPTY_RESUME);
  const [loading,        setLoading]        = useState(true);
  const [saving,         setSaving]         = useState(false);
  const [openSections,   setOpenSections]   = useState(['personal']);
  const [activeTemplate, setActiveTemplate] = useState(1);
  const [activeView,     setActiveView]     = useState('editor');
  const [pageTab,        setPageTab]        = useState('builder');
  const [toast,          setToast]          = useState(null);
  const [lastSaved,      setLastSaved]      = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    getResume()
      .then((raw) => setResumeData(normalizeResume(raw)))
      .catch(() => showToast('Failed to load resume.', 'error'))
      .finally(() => setLoading(false));
  }, [showToast]);

  const toggleSection = (key) => {
    setOpenSections((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSectionChange = (key) => (sectionData) => {
    setResumeData((prev) => ({ ...prev, [key]: sectionData }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const saved = await updateResume(resumeData);
      setResumeData(normalizeResume(saved));
      setLastSaved(new Date());
      showToast('Resume saved successfully.');
    } catch {
      showToast('Failed to save resume.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const PAGE_TABS = [
    { key: 'builder', label: '✏️ Builder' },
    { key: 'ats',     label: '📊 ATS Checker' },
  ];

  return (
    <DashboardLayout title="Resume Builder">
      <div className="space-y-5">

        {/* ── Premium page header ───────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 55%, #15803d 100%)', boxShadow: '0 0 0 1px rgba(34,197,94,0.28), 0 0 20px rgba(34,197,94,0.4), 0 4px 10px rgba(0,0,0,0.4)' }}
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 tracking-tight leading-none">Resume Builder</h2>
              <p className="mt-1.5 text-sm text-neutral-500">
                {lastSaved
                  ? `Last saved ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : 'Fill in your details and export your resume.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* ATS badge */}
            <span
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl"
              style={{ background: 'rgba(99,102,241,0.12)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)' }}
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              ATS 78%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => printResumePDF(resumeData)}
              disabled={loading}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              PDF
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={saving || loading}
              isLoading={saving}
            >
              {saving ? 'Saving…' : 'Save Resume'}
            </Button>
          </div>
        </div>

        {/* ── Page tab bar ─────────────────────────────────────────────────── */}
        <div className="flex gap-1 bg-white/5 rounded-2xl p-1 max-w-xs">
          {PAGE_TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setPageTab(key)}
              className={[
                'flex-1 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 whitespace-nowrap',
                pageTab === key
                  ? 'glass-brand text-brand-400 shadow-glow-sm'
                  : 'text-neutral-500 hover:text-neutral-700 hover:bg-white/5',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── ATS Checker tab ───────────────────────────────────────────────── */}
        {pageTab === 'ats' && <AtsCheckerView />}

        {/* ── Builder tab ───────────────────────────────────────────────────── */}
        {pageTab === 'builder' && (
          <>
            {/* Mobile view toggle */}
            <div className="flex lg:hidden gap-1 bg-white/5 rounded-2xl p-1">
              {['editor', 'preview'].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setActiveView(v)}
                  className={[
                    'flex-1 py-2 text-sm font-medium rounded-xl capitalize transition-all duration-200',
                    activeView === v
                      ? 'glass-brand text-brand-400 shadow-glow-sm'
                      : 'text-neutral-500 hover:text-neutral-700 hover:bg-white/5',
                  ].join(' ')}
                >
                  {v === 'editor' ? '✏️ Editor' : '👁 Preview'}
                </button>
              ))}
            </div>

            {/* Main two-column layout */}
            <div className="flex flex-col lg:flex-row gap-5 items-start">

              {/* ── LEFT: Editor ────────────────────────────────────────────── */}
              <div className={`w-full lg:w-[44%] space-y-2.5 ${activeView === 'preview' ? 'hidden lg:block' : ''}`}>
                {loading ? (
                  <EditorSkeleton />
                ) : (
                  <>
                    {/* Completion bar */}
                    <CompletionBar resumeData={resumeData} />

                    {/* Sections accordion */}
                    {SECTIONS.map(({ key, label, Component }) => {
                      const isOpen = openSections.includes(key);
                      return (
                        <div
                          key={key}
                          className="card overflow-hidden transition-all duration-200"
                        >
                          {/* Section header */}
                          <button
                            type="button"
                            onClick={() => toggleSection(key)}
                            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-all duration-150 group"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                                  isOpen ? '' : 'bg-white/5 border border-white/10 group-hover:bg-white/10'
                                }`}
                                style={isOpen ? {
                                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                  boxShadow: '0 0 10px rgba(99,102,241,0.4)',
                                } : undefined}
                              >
                                <span className={`transition-colors duration-200 ${isOpen ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-700'}`}>
                                  {SECTION_ICONS[key]}
                                </span>
                              </div>
                              <span className="text-sm font-semibold text-neutral-800">{label}</span>
                            </div>
                            <ChevronIcon open={isOpen} />
                          </button>

                          {/* Section body */}
                          {isOpen && (
                            <div className="px-5 pb-5 pt-4 border-t border-white/10">
                              <Component
                                data={resumeData[key]}
                                onChange={handleSectionChange(key)}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </>
                )}
              </div>

              {/* ── RIGHT: Preview (sticky) ──────────────────────────────────── */}
              <div className={`w-full lg:flex-1 ${activeView === 'editor' ? 'hidden lg:block' : ''}`}>
                <div className="lg:sticky lg:top-5 space-y-3">

                  {/* Template selector + ATS score side by side */}
                  <div className="grid grid-cols-2 gap-3">
                    <TemplateSelector activeTemplate={activeTemplate} onSelect={setActiveTemplate} />
                    <AtsScoreCard />
                  </div>

                  {/* A4 Resume preview paper */}
                  <div
                    className="card overflow-hidden"
                    style={{ maxHeight: 'calc(100vh - 21rem)', overflowY: 'auto' }}
                  >
                    {/* Paper shadow tray */}
                    <div className="p-4" style={{ background: 'rgba(0,0,0,0.25)' }}>
                      <div
                        style={{
                          boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.03) inset',
                          borderRadius: '2px',
                        }}
                      >
                        <ResumePreview data={resumeData} template={activeTemplate} />
                      </div>
                    </div>
                  </div>

                  {/* Mobile sticky action bar */}
                  <div className="lg:hidden card px-4 py-3 flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      fullWidth
                      onClick={() => printResumePDF(resumeData)}
                      disabled={loading}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download PDF
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      onClick={handleSave}
                      disabled={saving || loading}
                      isLoading={saving}
                    >
                      {saving ? 'Saving…' : 'Save'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </DashboardLayout>
  );
}
