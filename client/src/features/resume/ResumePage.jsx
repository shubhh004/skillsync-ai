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

function Toast({ message, type }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white ${type === 'error' ? 'bg-danger-600' : 'bg-success-600'}`}>
      {message}
    </div>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

const SECTIONS = [
  { key: 'personal',       label: 'Personal Information', Component: PersonalInfoSection },
  { key: 'skills',         label: 'Skills',               Component: SkillsSection },
  { key: 'education',      label: 'Education',            Component: EducationSection },
  { key: 'experience',     label: 'Experience',           Component: ExperienceSection },
  { key: 'projects',       label: 'Projects',             Component: ProjectsSection },
  { key: 'certifications', label: 'Certifications',       Component: CertificationsSection },
  { key: 'achievements',   label: 'Achievements',         Component: AchievementsSection },
];

export default function ResumePage() {
  const [resumeData,     setResumeData]     = useState(EMPTY_RESUME);
  const [loading,        setLoading]        = useState(true);
  const [saving,         setSaving]         = useState(false);
  const [openSections,   setOpenSections]   = useState(['personal']);
  const [activeTemplate, setActiveTemplate] = useState(1);
  const [activeView,     setActiveView]     = useState('editor');
  const [pageTab,        setPageTab]        = useState('builder');
  const [toast,          setToast]          = useState(null);

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
      showToast('Resume saved successfully.');
    } catch {
      showToast('Failed to save resume.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="Resume Builder">
      <div className="space-y-5">
        {/* Page header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Resume Builder</h2>
            <p className="mt-0.5 text-sm text-neutral-500">
              Fill in your details and save your resume.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => printResumePDF(resumeData)}
              disabled={loading}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={saving || loading}
            >
              {saving ? 'Saving...' : 'Save Resume'}
            </Button>
          </div>
        </div>

        {/* Page tab bar */}
        <div className="flex border-b border-neutral-200">
          {[
            { key: 'builder', label: 'Builder' },
            { key: 'ats',     label: 'ATS Checker' },
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setPageTab(key)}
              className={[
                'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
                pageTab === key
                  ? 'border-brand-600 text-brand-400'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ATS Checker view */}
        {pageTab === 'ats' && <AtsCheckerView />}

        {/* Builder view */}
        {pageTab === 'builder' && (
          <>
            {/* Mobile view toggle */}
            <div className="flex lg:hidden rounded-lg overflow-hidden border border-neutral-200">
              {['editor', 'preview'].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setActiveView(v)}
                  className={[
                    'flex-1 py-2 text-sm font-medium capitalize transition-colors',
                    activeView === v
                      ? 'bg-brand-600 text-white'
                      : 'bg-neutral-0 text-neutral-600 hover:bg-neutral-200',
                  ].join(' ')}
                >
                  {v}
                </button>
              ))}
            </div>

            {/* Main two-column layout */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* LEFT — Editor */}
              <div className={`w-full lg:w-2/5 space-y-3 ${activeView === 'preview' ? 'hidden lg:block' : ''}`}>
                {loading ? (
                  <div className="flex justify-center py-16">
                    <div className="w-8 h-8 rounded-full border-2 border-neutral-200 border-t-brand-600 animate-spin" />
                  </div>
                ) : (
                  SECTIONS.map(({ key, label, Component }) => {
                    const isOpen = openSections.includes(key);
                    return (
                      <div
                        key={key}
                        className="bg-neutral-0 rounded-xl border border-neutral-200 shadow-sm overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => toggleSection(key)}
                          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-neutral-200 transition-colors"
                        >
                          <span className="text-sm font-semibold text-neutral-800">{label}</span>
                          <ChevronIcon open={isOpen} />
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-5 border-t border-neutral-200 pt-4">
                            <Component
                              data={resumeData[key]}
                              onChange={handleSectionChange(key)}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* RIGHT — Preview */}
              <div className={`w-full lg:w-3/5 space-y-4 ${activeView === 'editor' ? 'hidden lg:block' : ''}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TemplateSelector activeTemplate={activeTemplate} onSelect={setActiveTemplate} />
                  <AtsScoreCard />
                </div>
                <div
                  className="resume-preview-container rounded-xl border border-neutral-200 overflow-hidden shadow-sm"
                  style={{ maxHeight: 'calc(100vh - 22rem)', overflowY: 'auto' }}
                >
                  <ResumePreview data={resumeData} template={activeTemplate} />
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
