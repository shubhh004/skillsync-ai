import { useState } from 'react';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';

export default function SkillsSection({ data, onChange }) {
  const [input, setInput] = useState('');

  const addSkill = () => {
    const trimmed = input.trim();
    if (!trimmed || data.includes(trimmed)) return;
    onChange([...data, trimmed]);
    setInput('');
  };

  const removeSkill = (skill) => onChange(data.filter((s) => s !== skill));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addSkill(); }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Type a skill and press Enter or Add"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button variant="outline" size="sm" onClick={addSkill} className="flex-shrink-0">
          Add
        </Button>
      </div>
      {data.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-700 border border-brand-200"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="text-brand-400 hover:text-brand-700 transition-colors leading-none"
                aria-label={`Remove ${skill}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
