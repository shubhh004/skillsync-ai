import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Container from '../components/ui/Container';

const features = [
  {
    title: 'DSA Progress Tracker',
    description:
      'Log and track your Data Structures & Algorithms practice across topics and difficulty levels.',
  },
  {
    title: 'ATS Resume Builder',
    description:
      'Build ATS-optimized resumes with AI-driven suggestions and a real-time compatibility score.',
  },
  {
    title: 'AI Mock Interviews',
    description:
      'Simulate technical and behavioral interviews with Gemini-powered feedback and scoring.',
  },
  {
    title: 'Job Application Pipeline',
    description:
      'Track every application, status, and deadline in a Kanban-style board — no spreadsheet needed.',
  },
  {
    title: 'Analytics & Insights',
    description:
      'Visualize streaks, topic coverage, weak areas, and preparation progress over time.',
  },
  {
    title: 'All in One Place',
    description:
      'From your first solved problem to your offer letter — one focused platform for the full journey.',
  },
];

export default function Home() {
  return (
    <MainLayout>
      {/* Hero */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-50 text-brand-400 text-sm font-medium mb-6 border border-brand-100">
              Built for placement season
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 leading-tight tracking-tight">
              Ace placements with{' '}
              <span className="text-brand-400">AI-powered</span> preparation
            </h1>
            <p className="mt-6 text-lg text-neutral-500 leading-relaxed">
              SkillSync AI is your all-in-one placement toolkit — DSA tracking, resume building,
              mock interviews, and job management in one focused platform.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button size="lg" fullWidth>
                  Get Started — It's Free
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" fullWidth>
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Features */}
      <section className="py-16 bg-neutral-100 border-t border-neutral-200">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">
              Everything you need to get placed
            </h2>
            <p className="mt-3 text-neutral-500">
              Six focused tools. One goal: your offer letter.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ title, description }) => (
              <Card key={title}>
                <h3 className="font-semibold text-neutral-900 mb-2">{title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20">
        <Container>
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">
              Ready to start preparing?
            </h2>
            <p className="mt-3 text-neutral-500">
              Join thousands of students who are turning placement anxiety into placement offers.
            </p>
            <div className="mt-8">
              <Link to="/signup">
                <Button size="lg">Create Your Free Account</Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </MainLayout>
  );
}
