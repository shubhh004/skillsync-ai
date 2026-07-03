import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import Label from '../../../../components/ui/Label';
import Card from '../../../../components/ui/Card';

const TEXTAREA = 'w-full px-3 py-2.5 rounded-md text-sm border border-neutral-300 bg-white text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-brand-500 focus:border-brand-500 transition-colors duration-150 resize-none';

const emptyEntry = () => ({ id: Date.now(), title: '', description: '' });

export default function AchievementsSection({ data, onChange }) {
  const handleField = (id, field) => (e) =>
    onChange(data.map((item) => (item.id === id ? { ...item, [field]: e.target.value } : item)));

  return (
    <div className="space-y-4">
      {data.map((item, idx) => (
        <Card key={item.id} padding={false} className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Achievement {idx + 1}</p>
            <button
              type="button"
              onClick={() => onChange(data.filter((i) => i.id !== item.id))}
              className="text-xs text-danger-500 hover:text-danger-700 font-medium transition-colors"
            >
              Remove
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <Label htmlFor={`ach-title-${item.id}`}>Title</Label>
              <Input
                id={`ach-title-${item.id}`}
                placeholder="Hackathon Winner, Academic Award..."
                value={item.title}
                onChange={handleField(item.id, 'title')}
              />
            </div>
            <div>
              <Label htmlFor={`ach-desc-${item.id}`}>Description</Label>
              <textarea
                id={`ach-desc-${item.id}`}
                rows={2}
                placeholder="Brief description of the achievement..."
                value={item.description}
                onChange={handleField(item.id, 'description')}
                className={TEXTAREA}
              />
            </div>
          </div>
        </Card>
      ))}
      <Button variant="outline" size="sm" onClick={() => onChange([...data, emptyEntry()])}>
        + Add Achievement
      </Button>
    </div>
  );
}
