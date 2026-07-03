export const SKILL_DICT = [
  // Programming Languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C', 'C++', 'C#', 'Go', 'Rust', 'Swift',
  'Kotlin', 'Ruby', 'PHP', 'Scala', 'R', 'MATLAB', 'Dart', 'Perl', 'Haskell', 'Lua',
  // Frontend
  'React', 'Vue.js', 'Angular', 'Next.js', 'Nuxt.js', 'Svelte', 'HTML', 'CSS', 'Sass',
  'Tailwind CSS', 'Bootstrap', 'Material UI', 'Chakra UI', 'Redux', 'Zustand', 'Vite',
  'Webpack', 'Babel', 'jQuery', 'Three.js', 'D3.js', 'Framer Motion',
  // Backend
  'Node.js', 'Express.js', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'Laravel',
  'Ruby on Rails', 'ASP.NET', 'NestJS', 'Hapi.js', 'GraphQL', 'REST API', 'gRPC',
  'Microservices', 'WebSockets', 'Socket.io',
  // Database
  'MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Redis', 'Cassandra', 'DynamoDB',
  'Firebase', 'Supabase', 'Elasticsearch', 'Oracle', 'SQL Server', 'Neo4j', 'Prisma',
  'Mongoose', 'Sequelize', 'TypeORM',
  // DevOps & Cloud
  'Docker', 'Kubernetes', 'AWS', 'Google Cloud', 'Azure', 'Terraform', 'Ansible',
  'Jenkins', 'GitHub Actions', 'GitLab CI', 'CircleCI', 'Nginx', 'Apache', 'Linux',
  'Bash', 'CI/CD', 'Prometheus', 'Grafana', 'ELK Stack',
  // Tools & Others
  'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Jira', 'Confluence', 'Figma', 'Postman',
  'VS Code', 'IntelliJ IDEA', 'Vim', 'Jest', 'Mocha', 'Cypress', 'Playwright',
  'Selenium', 'Pytest', 'JUnit', 'Storybook', 'Swagger', 'OpenAPI',
  // AI/ML
  'TensorFlow', 'PyTorch', 'scikit-learn', 'Keras', 'Pandas', 'NumPy', 'OpenCV',
  'Hugging Face', 'LangChain', 'OpenAI API', 'Machine Learning', 'Deep Learning',
  'NLP', 'Computer Vision', 'Data Science',
];

const PROGRAMMING = new Set([
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C', 'C++', 'C#', 'Go', 'Rust', 'Swift',
  'Kotlin', 'Ruby', 'PHP', 'Scala', 'R', 'MATLAB', 'Dart', 'Perl', 'Haskell', 'Lua',
  'Bash',
]);

const FRONTEND = new Set([
  'React', 'Vue.js', 'Angular', 'Next.js', 'Nuxt.js', 'Svelte', 'HTML', 'CSS', 'Sass',
  'Tailwind CSS', 'Bootstrap', 'Material UI', 'Chakra UI', 'Redux', 'Zustand', 'Vite',
  'Webpack', 'Babel', 'jQuery', 'Three.js', 'D3.js', 'Framer Motion',
]);

const BACKEND = new Set([
  'Node.js', 'Express.js', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'Laravel',
  'Ruby on Rails', 'ASP.NET', 'NestJS', 'Hapi.js', 'GraphQL', 'REST API', 'gRPC',
  'Microservices', 'WebSockets', 'Socket.io',
]);

const DATABASE = new Set([
  'MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Redis', 'Cassandra', 'DynamoDB',
  'Firebase', 'Supabase', 'Elasticsearch', 'Oracle', 'SQL Server', 'Neo4j', 'Prisma',
  'Mongoose', 'Sequelize', 'TypeORM',
]);

const DEVOPS = new Set([
  'Docker', 'Kubernetes', 'AWS', 'Google Cloud', 'Azure', 'Terraform', 'Ansible',
  'Jenkins', 'GitHub Actions', 'GitLab CI', 'CircleCI', 'Nginx', 'Apache', 'Linux',
  'CI/CD', 'Prometheus', 'Grafana', 'ELK Stack',
]);

const AI_ML = new Set([
  'TensorFlow', 'PyTorch', 'scikit-learn', 'Keras', 'Pandas', 'NumPy', 'OpenCV',
  'Hugging Face', 'LangChain', 'OpenAI API', 'Machine Learning', 'Deep Learning',
  'NLP', 'Computer Vision', 'Data Science',
]);

function categorize(skill) {
  const s = skill.trim();
  if (PROGRAMMING.has(s)) return 'Programming';
  if (FRONTEND.has(s))    return 'Frontend';
  if (BACKEND.has(s))     return 'Backend';
  if (DATABASE.has(s))    return 'Database';
  if (DEVOPS.has(s))      return 'DevOps';
  if (AI_ML.has(s))       return 'AI / ML';
  return 'Tools & Other';
}

const CATEGORY_ORDER = ['Programming', 'Frontend', 'Backend', 'Database', 'DevOps', 'AI / ML', 'Tools & Other'];

export function groupSkills(flatSkills) {
  const groups = {};
  for (const skill of flatSkills) {
    if (!skill) continue;
    const cat = categorize(skill);
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(skill);
  }
  const ordered = {};
  for (const cat of CATEGORY_ORDER) {
    if (groups[cat]?.length) ordered[cat] = groups[cat];
  }
  return ordered;
}

// Migrate "Category: Skill1, Skill2" strings into a flat array of individual skills.
// Also handles plain comma-separated strings without a category prefix.
export function normalizeSkills(rawSkills) {
  if (!Array.isArray(rawSkills)) return [];
  const result = [];
  const seen = new Set();
  for (const item of rawSkills) {
    const str = String(item ?? '').trim();
    if (!str) continue;
    // "Category: Skill1, Skill2" pattern
    const colonIdx = str.indexOf(':');
    const values = colonIdx !== -1
      ? str.slice(colonIdx + 1).split(',').map((s) => s.trim()).filter(Boolean)
      : [str];
    for (const v of values) {
      const lower = v.toLowerCase();
      if (!seen.has(lower)) { seen.add(lower); result.push(v); }
    }
  }
  return result;
}
