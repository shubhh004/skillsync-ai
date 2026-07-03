import api from '../../services/api';

export async function createRoadmap(payload) {
  const { data } = await api.post('/career/roadmap', payload);
  return data.roadmap;
}

export async function getRoadmaps() {
  const { data } = await api.get('/career/roadmaps');
  return data.roadmaps;
}

export async function getRoadmap(id) {
  const { data } = await api.get(`/career/roadmap/${id}`);
  return data.roadmap;
}

export async function updateChecklist(id, checklist) {
  const { data } = await api.put(`/career/roadmap/${id}/checklist`, { checklist });
  return data.roadmap;
}

export async function deleteRoadmap(id) {
  await api.delete(`/career/roadmap/${id}`);
}

export async function regenerateRoadmap(id) {
  const { data } = await api.post(`/career/roadmap/${id}/regenerate`);
  return data.roadmap;
}

export async function getLatestRoadmap() {
  const { data } = await api.get('/career/roadmap/latest');
  return data.roadmap;
}

export function downloadRoadmapPDF(roadmap) {
  const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Convert markdown to simple HTML for print
  const lines = roadmap.content.split('\n');
  let html = '';
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trimStart().startsWith('```')) {
      const block = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith('```')) {
        block.push(esc(lines[i]));
        i++;
      }
      html += `<pre class="code">${block.join('\n')}</pre>`;
      i++;
      continue;
    }
    if (/^## /.test(line)) {
      html += `<h2>${esc(line.replace(/^## /, ''))}</h2>`;
    } else if (/^### /.test(line)) {
      html += `<h3>${esc(line.replace(/^### /, ''))}</h3>`;
    } else if (/^- \[[ x]\] /.test(line)) {
      const done = line.startsWith('- [x]');
      html += `<div class="task${done ? ' done' : ''}">&#9744; ${esc(line.replace(/^- \[[ x]\] /, ''))}</div>`;
    } else if (/^[-*] /.test(line)) {
      html += `<li>${esc(line.replace(/^[-*] /, ''))}</li>`;
    } else if (/^\d+\. /.test(line)) {
      html += `<li>${esc(line.replace(/^\d+\. /, ''))}</li>`;
    } else if (line.trim() === '') {
      html += '<br/>';
    } else {
      const formatted = esc(line)
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+)`/g, '<code>$1</code>');
      html += `<p>${formatted}</p>`;
    }
    i++;
  }

  const doc = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Roadmap — ${esc(roadmap.targetRole)} at ${esc(roadmap.targetCompany)}</title>
<style>
@page { size: A4; margin: 16mm 14mm; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Helvetica Neue', sans-serif; font-size: 10pt; color: #1a1a1a; line-height: 1.5; }
.header { border-bottom: 2px solid #2a52eb; padding-bottom: 8px; margin-bottom: 12px; }
.header h1 { font-size: 16pt; font-weight: 700; color: #6366f1; }
.header .meta { font-size: 8pt; color: #666; margin-top: 3px; }
h2 { font-size: 11pt; font-weight: 700; margin-top: 14px; margin-bottom: 5px; color: #1f2937; border-bottom: 1px solid #e4e7ed; padding-bottom: 3px; }
h3 { font-size: 9.5pt; font-weight: 600; margin-top: 10px; margin-bottom: 4px; color: #374151; }
p  { font-size: 9pt; margin-bottom: 4px; }
li { font-size: 9pt; margin-left: 16px; margin-bottom: 2px; list-style: disc; }
.task { font-size: 9pt; margin-bottom: 3px; color: #374151; }
.task.done { color: #15803d; text-decoration: line-through; }
code { background: #f1f3f6; font-family: monospace; font-size: 8pt; padding: 1px 3px; border-radius: 2px; }
pre.code { background: #1f2937; color: #d1fae5; font-family: monospace; font-size: 8pt; padding: 8px; border-radius: 4px; overflow-x: auto; margin: 6px 0; white-space: pre-wrap; }
strong { font-weight: 600; }
@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
<div class="header">
  <h1>${esc(roadmap.targetRole)} at ${esc(roadmap.targetCompany)}</h1>
  <div class="meta">Timeline: ${esc(roadmap.timeline)} · Skill Level: ${esc(roadmap.skillLevel)} · Readiness Score: ${roadmap.readinessScore}/100</div>
</div>
${html}
</body>
</html>`;

  const win = window.open('', '_blank', 'width=900,height=700');
  if (!win) { alert('Please allow pop-ups to download the roadmap as PDF.'); return; }
  win.document.write(doc);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 400);
}
