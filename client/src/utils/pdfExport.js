import { groupSkills } from './skillsUtils';

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function section(title, rows) {
  return `
    <div class="section">
      <div class="section-title">${esc(title)}</div>
      ${rows}
    </div>`;
}

export function printResumePDF(resumeData) {
  const { personal, education, skills, experience, projects, certifications, achievements } = resumeData;

  const educationHTML = education.length === 0 ? '' : section('Education',
    education.map(e => `
      <div class="entry">
        <div class="row">
          <div>
            <span class="bold">${esc(e.degree || 'Degree')}</span>
            ${e.institution ? `<span class="accent"> · ${esc(e.institution)}</span>` : ''}
          </div>
          <span class="meta">${esc(e.year || '')}</span>
        </div>
        ${e.gpa ? `<div class="meta">GPA: ${esc(e.gpa)}</div>` : ''}
      </div>`).join('')
  );

  const experienceHTML = experience.length === 0 ? '' : section('Experience',
    experience.map(e => `
      <div class="entry">
        <div class="row">
          <div>
            <span class="bold">${esc(e.role || 'Role')}</span>
            ${e.company ? `<span class="accent"> · ${esc(e.company)}</span>` : ''}
          </div>
          <span class="meta">${esc(e.duration || '')}</span>
        </div>
        ${e.description ? `<div class="desc">${esc(e.description)}</div>` : ''}
      </div>`).join('')
  );

  const projectsHTML = projects.length === 0 ? '' : section('Projects',
    projects.map(p => `
      <div class="entry">
        <div>
          <span class="bold">${esc(p.title || 'Project')}</span>
          ${p.tech ? `<span class="accent"> · ${esc(p.tech)}</span>` : ''}
          ${p.link ? `<span class="meta"> · ${esc(p.link)}</span>` : ''}
        </div>
        ${p.description ? `<div class="desc">${esc(p.description)}</div>` : ''}
      </div>`).join('')
  );

  const skillGroups = groupSkills(skills);
  const skillsHTML = skills.length === 0 ? '' : section('Skills',
    Object.entries(skillGroups)
      .map(([cat, list]) => `<div class="desc"><span class="bold">${esc(cat)}:</span> ${esc(list.join(', '))}</div>`)
      .join('')
  );

  const certsHTML = certifications.length === 0 ? '' : section('Certifications',
    certifications.map(c => `
      <div class="entry">
        <div class="row">
          <div>
            <span class="bold">${esc(c.name || 'Certificate')}</span>
            ${c.issuer ? `<span class="accent"> · ${esc(c.issuer)}</span>` : ''}
          </div>
          <span class="meta">${esc(c.year || '')}</span>
        </div>
      </div>`).join('')
  );

  const achievementsHTML = achievements.length === 0 ? '' : section('Achievements',
    achievements.map(a => `
      <div class="entry">
        <span class="bold">${esc(a.title || '')}</span>
        ${a.description ? `<div class="desc">${esc(a.description)}</div>` : ''}
      </div>`).join('')
  );

  const contactLine = [personal.email, personal.phone, personal.location].filter(Boolean).join(' · ');
  const linksLine   = [personal.linkedin, personal.github, personal.portfolio].filter(Boolean).join(' · ');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${esc(personal.fullName || 'Resume')}</title>
  <style>
    @page { size: A4; margin: 18mm 16mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 10pt;
      color: #1a1a1a;
      line-height: 1.45;
    }
    .name    { font-size: 20pt; font-weight: 700; letter-spacing: -0.3px; margin-bottom: 3px; }
    .contact { font-size: 8.5pt; color: #555; margin-bottom: 1px; }
    .links   { font-size: 8.5pt; color: #888; margin-bottom: 3px; }
    .summary { font-size: 8.5pt; color: #333; margin-top: 5px; line-height: 1.5; }
    .section { margin-top: 11px; page-break-inside: avoid; }
    .section-title {
      font-size: 7.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #222;
      border-bottom: 1px solid #ccc;
      padding-bottom: 2px;
      margin-bottom: 6px;
    }
    .entry  { margin-bottom: 6px; page-break-inside: avoid; }
    .row    { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
    .bold   { font-weight: 600; font-size: 9pt; }
    .accent { color: #444; font-size: 8.5pt; }
    .meta   { color: #666; font-size: 8pt; flex-shrink: 0; }
    .desc   { color: #333; font-size: 8.5pt; margin-top: 2px; line-height: 1.45; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="name">${esc(personal.fullName || 'Your Name')}</div>
  ${contactLine ? `<div class="contact">${esc(contactLine)}</div>` : ''}
  ${linksLine   ? `<div class="links">${esc(linksLine)}</div>`    : ''}
  ${personal.summary ? `<div class="summary">${esc(personal.summary)}</div>` : ''}
  ${educationHTML}
  ${experienceHTML}
  ${projectsHTML}
  ${skillsHTML}
  ${certsHTML}
  ${achievementsHTML}
</body>
</html>`;

  const win = window.open('', '_blank', 'width=900,height=700');
  if (!win) {
    alert('Please allow pop-ups for this site to export your resume as PDF.');
    return;
  }
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); }, 400);
}
