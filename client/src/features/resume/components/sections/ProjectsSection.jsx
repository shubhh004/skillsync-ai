import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import Label from '../../../../components/ui/Label';
import Card from '../../../../components/ui/Card';

const TEXTAREA = 'w-full px-3 py-2.5 rounded-md text-sm border border-neutral-300 bg-neutral-100 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-brand-500 focus:border-brand-500 transition-colors duration-150 resize-none';

const emptyEntry = () => ({ id: Date.now(), title: '', tech: '', description: '', link: '' });

export default function ProjectsSection({ data, onChange }) {
  const handleField = (id, field) => (e) =>
    onChange(data.map((item) => (item.id === id ? { ...item, [field]: e.target.value } : item)));

  return (
    <div className="space-y-4">
      {data.map((item, idx) => (
        <Card key={item.id} padding={false} className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Project {idx + 1}</p>
            <button
              type="button"
              onClick={() => onChange(data.filter((i) => i.id !== item.id))}
              className="text-xs text-danger-500 hover:text-danger-700 font-medium transition-colors"
            >
              Remove
            </button>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor={`proj-title-${item.id}`} required>Project Title</Label>
                <Input id={`proj-title-${item.id}`} placeholder="SkillSync AI" value={item.title} onChange={handleField(item.id, 'title')} />
              </div>
              <div>
                <Label htmlFor={`proj-tech-${item.id}`}>Tech Stack</Label>
                <Input id={`proj-tech-${item.id}`} placeholder="React, Node.js, MongoDB" value={item.tech} onChange={handleField(item.id, 'tech')} />
              </div>
            </div>
            <div>
              <Label htmlFor={`proj-desc-${item.id}`}>Description</Label>
              <textarea id={`proj-desc-${item.id}`} rows={2} placeholder="What did you build and what impact did it have?" value={item.description} onChange={handleField(item.id, 'description')} className={TEXTAREA} />
            </div>
            <div>
              <Label htmlFor={`proj-link-${item.id}`}>Link</Label>
              <Input id={`proj-link-${item.id}`} placeholder="github.com/yourname/project" value={item.link} onChange={handleField(item.id, 'link')} />
            </div>
          </div>
        </Card>
      ))}
      <Button variant="outline" size="sm" onClick={() => onChange([...data, emptyEntry()])}>
        + Add Project
      </Button>
    </div>
  );
}
