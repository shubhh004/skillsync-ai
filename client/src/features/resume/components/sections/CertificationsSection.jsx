import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import Label from '../../../../components/ui/Label';
import Card from '../../../../components/ui/Card';

const emptyEntry = () => ({ id: Date.now(), name: '', issuer: '', year: '' });

export default function CertificationsSection({ data, onChange }) {
  const handleField = (id, field) => (e) =>
    onChange(data.map((item) => (item.id === id ? { ...item, [field]: e.target.value } : item)));

  return (
    <div className="space-y-4">
      {data.map((item, idx) => (
        <Card key={item.id} padding={false} className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Cert {idx + 1}</p>
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
              <Label htmlFor={`cert-name-${item.id}`} required>Certificate Name</Label>
              <Input id={`cert-name-${item.id}`} placeholder="AWS Certified Cloud Practitioner" value={item.name} onChange={handleField(item.id, 'name')} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor={`cert-issuer-${item.id}`}>Issuing Organisation</Label>
                <Input id={`cert-issuer-${item.id}`} placeholder="Amazon Web Services" value={item.issuer} onChange={handleField(item.id, 'issuer')} />
              </div>
              <div>
                <Label htmlFor={`cert-year-${item.id}`}>Year</Label>
                <Input id={`cert-year-${item.id}`} placeholder="2024" value={item.year} onChange={handleField(item.id, 'year')} />
              </div>
            </div>
          </div>
        </Card>
      ))}
      <Button variant="outline" size="sm" onClick={() => onChange([...data, emptyEntry()])}>
        + Add Certification
      </Button>
    </div>
  );
}
