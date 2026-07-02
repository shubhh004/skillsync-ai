import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import Label from '../../../../components/ui/Label';
import Card from '../../../../components/ui/Card';

const emptyEntry = () => ({ id: Date.now(), degree: '', institution: '', year: '', gpa: '' });

export default function EducationSection({ data, onChange }) {
  const handleField = (id, field) => (e) =>
    onChange(data.map((item) => (item.id === id ? { ...item, [field]: e.target.value } : item)));

  return (
    <div className="space-y-4">
      {data.map((item, idx) => (
        <Card key={item.id} padding={false} className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Entry {idx + 1}</p>
            {data.length > 1 && (
              <button
                type="button"
                onClick={() => onChange(data.filter((i) => i.id !== item.id))}
                className="text-xs text-danger-500 hover:text-danger-700 font-medium transition-colors"
              >
                Remove
              </button>
            )}
          </div>
          <div className="space-y-3">
            <div>
              <Label htmlFor={`edu-degree-${item.id}`} required>Degree / Qualification</Label>
              <Input id={`edu-degree-${item.id}`} placeholder="B.Tech Computer Science" value={item.degree} onChange={handleField(item.id, 'degree')} />
            </div>
            <div>
              <Label htmlFor={`edu-inst-${item.id}`} required>Institution</Label>
              <Input id={`edu-inst-${item.id}`} placeholder="NIT Trichy" value={item.institution} onChange={handleField(item.id, 'institution')} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor={`edu-year-${item.id}`}>Year</Label>
                <Input id={`edu-year-${item.id}`} placeholder="2021 – 2025" value={item.year} onChange={handleField(item.id, 'year')} />
              </div>
              <div>
                <Label htmlFor={`edu-gpa-${item.id}`}>GPA / %</Label>
                <Input id={`edu-gpa-${item.id}`} placeholder="8.7 / 10" value={item.gpa} onChange={handleField(item.id, 'gpa')} />
              </div>
            </div>
          </div>
        </Card>
      ))}
      <Button variant="outline" size="sm" onClick={() => onChange([...data, emptyEntry()])}>
        + Add Education
      </Button>
    </div>
  );
}
