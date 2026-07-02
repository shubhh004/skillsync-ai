import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import SectionNav from './components/SectionNav';
import TemplateSelector from './components/TemplateSelector';
import AtsScoreCard from './components/AtsScoreCard';
import ResumePreview from './components/ResumePreview';
import PersonalInfoSection from './components/sections/PersonalInfoSection';
import EducationSection from './components/sections/EducationSection';
import SkillsSection from './components/sections/SkillsSection';
import ExperienceSection from './components/sections/ExperienceSection';
import ProjectsSection from './components/sections/ProjectsSection';
import CertificationsSection from './components/sections/CertificationsSection';
import mockResumeData from './mockResumeData';

const sectionComponents = {
  personal:       PersonalInfoSection,
  education:      EducationSection,
  skills:         SkillsSection,
  experience:     ExperienceSection,
  projects:       ProjectsSection,
  certifications: CertificationsSection,
};

export default function ResumePage() {
  const [resumeData,    setResumeData]    = useState(mockResumeData);
  const [activeSection, setActiveSection] = useState('personal');
  const [activeTemplate, setActiveTemplate] = useState(1);
  const [activeView,    setActiveView]    = useState('editor');

  const handleSectionChange = (sectionData) => {
    setResumeData((prev) => ({ ...prev, [activeSection]: sectionData }));
  };

  const ActiveSection = sectionComponents[activeSection];

  return (
    <DashboardLayout title="Resume Builder">
      <div className="space-y-5">
        {/* Page header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Resume Builder</h2>
            <p className="mt-0.5 text-sm text-neutral-500">
              Edit your resume and see a live preview. Download when ready.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="outline" size="sm">Save Resume</Button>
            <Button size="sm">Download PDF</Button>
          </div>
        </div>

        {/* Mobile view toggle */}
        <div className="flex lg:hidden rounded-lg overflow-hidden border border-neutral-200">
          {['editor', 'preview'].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setActiveView(v)}
              className={[
                'flex-1 py-2 text-sm font-medium capitalize transition-colors',
                activeView === v ? 'bg-brand-600 text-white' : 'bg-white text-neutral-600 hover:bg-neutral-50',
              ].join(' ')}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Main two-column layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT — Editor */}
          <div className={`w-full lg:w-2/5 space-y-4 ${activeView === 'preview' ? 'hidden lg:block' : ''}`}>
            <SectionNav activeSection={activeSection} onSelect={setActiveSection} />
            <Card>
              <ActiveSection
                data={resumeData[activeSection]}
                onChange={handleSectionChange}
              />
            </Card>
          </div>

          {/* RIGHT — Preview */}
          <div className={`w-full lg:w-3/5 space-y-4 ${activeView === 'editor' ? 'hidden lg:block' : ''}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TemplateSelector activeTemplate={activeTemplate} onSelect={setActiveTemplate} />
              <AtsScoreCard />
            </div>

            <div className="rounded-xl border border-neutral-200 overflow-hidden shadow-sm" style={{ maxHeight: 'calc(100vh - 22rem)', overflowY: 'auto' }}>
              <ResumePreview data={resumeData} template={activeTemplate} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
