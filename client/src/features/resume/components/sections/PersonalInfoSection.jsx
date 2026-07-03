import Input from '../../../../components/ui/Input';
import Label from '../../../../components/ui/Label';

const TEXTAREA = 'w-full px-3 py-2.5 rounded-md text-sm border border-neutral-300 bg-neutral-100 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-brand-500 focus:border-brand-500 transition-colors duration-150 resize-none';

export default function PersonalInfoSection({ data, onChange }) {
  const handle = (field) => (e) => onChange({ ...data, [field]: e.target.value });

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="pi-name">Full Name</Label>
        <Input id="pi-name" placeholder="Priya Sharma" value={data.fullName} onChange={handle('fullName')} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pi-email">Email</Label>
          <Input id="pi-email" type="email" placeholder="you@college.edu" value={data.email} onChange={handle('email')} />
        </div>
        <div>
          <Label htmlFor="pi-phone">Phone</Label>
          <Input id="pi-phone" type="tel" placeholder="+91 98765 43210" value={data.phone} onChange={handle('phone')} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pi-college">College</Label>
          <Input id="pi-college" placeholder="NIT Trichy" value={data.college} onChange={handle('college')} />
        </div>
        <div>
          <Label htmlFor="pi-degree">Degree</Label>
          <Input id="pi-degree" placeholder="B.Tech Computer Science" value={data.degree} onChange={handle('degree')} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pi-grad">Graduation Year</Label>
          <Input id="pi-grad" placeholder="2025" value={data.graduationYear} onChange={handle('graduationYear')} />
        </div>
        <div>
          <Label htmlFor="pi-location">Location</Label>
          <Input id="pi-location" placeholder="City, State" value={data.location} onChange={handle('location')} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pi-linkedin">LinkedIn</Label>
          <Input id="pi-linkedin" placeholder="linkedin.com/in/yourname" value={data.linkedin} onChange={handle('linkedin')} />
        </div>
        <div>
          <Label htmlFor="pi-github">GitHub</Label>
          <Input id="pi-github" placeholder="github.com/yourname" value={data.github} onChange={handle('github')} />
        </div>
      </div>
      <div>
        <Label htmlFor="pi-portfolio">Portfolio</Label>
        <Input id="pi-portfolio" placeholder="yourportfolio.com" value={data.portfolio} onChange={handle('portfolio')} />
      </div>
      <div>
        <Label htmlFor="pi-summary">Professional Summary</Label>
        <textarea
          id="pi-summary"
          rows={4}
          placeholder="Write a brief professional summary..."
          value={data.summary}
          onChange={handle('summary')}
          className={TEXTAREA}
        />
      </div>
    </div>
  );
}
