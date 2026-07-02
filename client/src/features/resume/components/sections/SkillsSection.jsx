import Input from '../../../../components/ui/Input';
import Label from '../../../../components/ui/Label';

const fields = [
  { key: 'languages',  label: 'Languages',           placeholder: 'Java, Python, JavaScript, C++' },
  { key: 'frameworks', label: 'Frameworks & Libraries', placeholder: 'React, Node.js, Express.js' },
  { key: 'tools',      label: 'Tools & Platforms',    placeholder: 'Git, Docker, MongoDB, PostgreSQL' },
  { key: 'concepts',   label: 'Concepts',             placeholder: 'Data Structures, Algorithms, OOP' },
];

export default function SkillsSection({ data, onChange }) {
  const handle = (key) => (e) => onChange({ ...data, [key]: e.target.value });

  return (
    <div className="space-y-4">
      <p className="text-xs text-neutral-500">Enter skills as comma-separated values.</p>
      {fields.map(({ key, label, placeholder }) => (
        <div key={key}>
          <Label htmlFor={`skill-${key}`}>{label}</Label>
          <Input
            id={`skill-${key}`}
            placeholder={placeholder}
            value={data[key]}
            onChange={handle(key)}
          />
        </div>
      ))}
    </div>
  );
}
