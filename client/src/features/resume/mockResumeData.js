const mockResumeData = {
  personal: {
    name: 'Priya Sharma',
    email: 'priya.sharma@nittrichy.ac.in',
    phone: '+91 98765 43210',
    location: 'Trichy, Tamil Nadu',
    linkedin: 'linkedin.com/in/priyasharma',
    github: 'github.com/priyasharma',
    summary:
      'Final year B.Tech CSE student at NIT Trichy with strong foundations in data structures, algorithms, and full-stack development. Seeking SWE roles in product-based companies. 142+ problems solved on LeetCode.',
  },
  education: [
    {
      id: 1,
      degree: 'B.Tech — Computer Science & Engineering',
      institution: 'National Institute of Technology, Trichy',
      year: '2021 – 2025',
      gpa: '8.7 / 10',
    },
    {
      id: 2,
      degree: 'Higher Secondary (Class XII)',
      institution: 'DAV Senior Secondary School, Chennai',
      year: '2019 – 2021',
      gpa: '95.6%',
    },
  ],
  skills: {
    languages: 'Java, Python, JavaScript, C++',
    frameworks: 'React, Node.js, Express.js, Spring Boot',
    tools: 'Git, MongoDB, PostgreSQL, Docker, Postman',
    concepts: 'Data Structures, Algorithms, OOP, System Design, REST APIs',
  },
  experience: [
    {
      id: 1,
      role: 'Software Engineering Intern',
      company: 'Tata Consultancy Services',
      duration: 'May 2024 – Aug 2024',
      description:
        'Built REST APIs for an internal HR portal using Node.js and Express. Reduced response latency by 35% through query optimisation and caching. Collaborated in a 6-member agile team.',
    },
  ],
  projects: [
    {
      id: 1,
      title: 'SkillSync AI',
      tech: 'React, Node.js, Express, MongoDB',
      description:
        'AI-powered placement preparation platform with DSA tracking, resume builder, mock interviews, and job application management.',
      link: 'github.com/priyasharma/skillsync-ai',
    },
    {
      id: 2,
      title: 'Real-Time Chat Application',
      tech: 'Socket.io, React, Node.js',
      description:
        'Full-stack chat application with real-time messaging, room support, and JWT-based user authentication.',
      link: 'github.com/priyasharma/chat-app',
    },
  ],
  certifications: [
    {
      id: 1,
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      year: '2024',
    },
    {
      id: 2,
      name: 'Meta Front-End Developer Certificate',
      issuer: 'Meta / Coursera',
      year: '2023',
    },
  ],
};

export default mockResumeData;
