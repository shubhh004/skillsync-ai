const STOP_WORDS = new Set([
  'a','an','the','is','are','was','were','be','been','being',
  'have','has','had','do','does','did','will','would','should',
  'could','may','might','must','shall','to','of','in','on','at',
  'by','for','with','about','into','through','before','after',
  'from','up','down','out','off','over','under','then','once',
  'here','there','when','where','why','how','all','both','each',
  'more','most','other','some','such','no','nor','not','only',
  'same','so','than','too','very','just','as','until','while',
  'if','or','and','but','it','its','this','that','these','those',
  'i','you','he','she','we','they','what','which','who','whom',
  'can','use','used','also','their','our','your','his','her',
  'one','two','three','four','five','any','each','either','own',
  'per','via','eg','ie','etc','vs','well','since','even','between',
  'get','set','let','put','new','old','run','got','need','make',
]);

const TECH_TERMS = new Set([
  // Java
  'java','jvm','jre','jdk','bytecode','classpath','garbage','collection',
  'heap','stack','thread','runnable','callable','future','synchronized',
  'volatile','transient','static','final','abstract','interface','class',
  'object','method','constructor','overloading','overriding','polymorphism',
  'inheritance','encapsulation','abstraction','generics','lambda','stream',
  'optional','annotation','reflection','serialization','exception','checked',
  'unchecked','runtime','compile','immutable','autoboxing','unboxing',
  // DSA
  'array','linked','list','queue','tree','graph','hash','map','sort',
  'search','recursion','dynamic','programming','greedy','divide','conquer',
  'binary','bfs','dfs','traversal','inorder','preorder','postorder',
  'complexity','notation','linear','logarithmic','quadratic','constant',
  'amortized','trie','segment','sliding','window','backtracking',
  'memoization','tabulation','topological','dijkstra','bellman','floyd',
  'kruskal','prim','pivot','merge','quick','bubble','insertion','selection',
  // DBMS
  'database','sql','nosql','table','column','row','schema','index','primary',
  'foreign','key','join','inner','outer','left','right','full','cross',
  'query','transaction','acid','atomicity','consistency','isolation','durability',
  'normalization','denormalization','relation','tuple','attribute','entity',
  'integrity','constraint','trigger','view','stored','procedure','cursor',
  'deadlock','lock','concurrency','recovery','replication','sharding',
  'partitioning','mongodb','mysql','postgresql','redis','cassandra','mvcc',
  // OS
  'process','thread','scheduler','scheduling','fcfs','sjf','round','robin',
  'priority','preemptive','cpu','context','switch','semaphore','mutex',
  'monitor','critical','section','race','condition','paging','segmentation',
  'virtual','memory','cache','tlb','inode','file','interrupt','kernel',
  'user','mode','fork','exec','ipc','pipe','socket','signal','zombie',
  'orphan','buffer','spooling','thrashing','fragmentation','compaction',
  // Networks
  'network','protocol','tcp','udp','ip','dns','dhcp','http','https','ftp',
  'smtp','ssl','tls','osi','model','layer','application','transport',
  'session','presentation','datalink','physical','router','switch','gateway',
  'firewall','nat','mac','address','packet','frame','bandwidth','latency',
  'throughput','congestion','handshake','port','url','domain','subnet',
  'cidr','vpn','cdn','load','balancer','proxy','rest','soap','websocket',
  'cors','oauth','jwt','cookie','header','request','response','status',
  // General
  'agile','scrum','kanban','git','devops','cicd','docker','kubernetes',
  'microservice','monolith','mvc','solid','singleton','factory','observer',
  'strategy','decorator','repository','dependency','injection','unit','test',
  'integration','tdd','bdd','refactoring','scalability','availability',
  'reliability','asynchronous','synchronous','callback','promise','async',
  'await','event','closure','prototype','scope','hoisting','immutability',
]);

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3);
}

function extractKeywords(text) {
  return [...new Set(tokenize(text).filter((w) => !STOP_WORDS.has(w)))];
}

export function evaluateAnswer(candidateAnswer, idealAnswer) {
  const candidate = (candidateAnswer || '').trim();
  const ideal = (idealAnswer || '').trim();

  if (!candidate) {
    return {
      score: 0,
      matchedKeywords: [],
      missingKeywords: extractKeywords(ideal).slice(0, 8),
      strengths: [],
      weaknesses: ['No answer provided'],
      suggestions: ['Provide an answer covering the key concepts from the ideal answer'],
    };
  }

  const idealKeywords = extractKeywords(ideal);
  const candidateTokens = tokenize(candidate);
  const candidateSet = new Set(candidateTokens);

  // 1. Keyword match (50%)
  const matched = idealKeywords.filter((kw) => candidateSet.has(kw));
  const missing = idealKeywords.filter((kw) => !candidateSet.has(kw));
  const keywordScore = idealKeywords.length > 0
    ? (matched.length / idealKeywords.length) * 100
    : 0;

  // 2. Length adequacy (20%)
  const idealWordCount = ideal.split(/\s+/).length;
  const candidateWordCount = candidate.split(/\s+/).length;
  const lengthRatio = Math.min(candidateWordCount / Math.max(idealWordCount * 0.4, 15), 1);
  const lengthScore = lengthRatio * 100;

  // 3. Completeness via sentence count (10%)
  const sentences = (candidate.match(/[.!?]+/g) || []).length;
  const completenessScore = Math.min(sentences / 2, 1) * 100;

  // 4. Technical depth (20%)
  const techCount = candidateTokens.filter((t) => TECH_TERMS.has(t)).length;
  const idealTechCount = tokenize(ideal).filter((t) => TECH_TERMS.has(t)).length;
  const techRatio = idealTechCount > 0
    ? Math.min(techCount / idealTechCount, 1)
    : Math.min(techCount / 3, 1);
  const techScore = techRatio * 100;

  const score = Math.round(
    keywordScore * 0.50 +
    lengthScore  * 0.20 +
    completenessScore * 0.10 +
    techScore    * 0.20,
  );

  const strengths = [];
  if (keywordScore >= 60)      strengths.push('Good coverage of key concepts');
  if (techCount >= 3)          strengths.push('Strong use of technical terminology');
  if (lengthScore >= 70)       strengths.push('Well-elaborated answer');
  if (completenessScore >= 50) strengths.push('Structured multi-point response');

  const weaknesses = [];
  if (keywordScore < 40)       weaknesses.push('Missing important concepts');
  if (lengthScore < 40)        weaknesses.push('Answer is too brief');
  if (techScore < 30)          weaknesses.push('Limited use of technical terms');
  if (completenessScore < 25)  weaknesses.push('Answer lacks sufficient detail');

  const suggestions = [];
  if (missing.length > 0) {
    suggestions.push(`Cover these concepts: ${missing.slice(0, 5).join(', ')}`);
  }
  if (lengthScore < 50)  suggestions.push('Expand your answer with more details and examples');
  if (techScore < 40)    suggestions.push('Use relevant technical terms to demonstrate depth');
  if (strengths.length === 0 && suggestions.length === 0) {
    suggestions.push('Review the ideal answer to understand the expected depth');
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    matchedKeywords: matched,
    missingKeywords: missing.slice(0, 10),
    strengths,
    weaknesses,
    suggestions,
  };
}

export function evaluateInterview(questions, answers) {
  const evaluations = questions.map((q) => ({
    ...evaluateAnswer(answers[q.id] || '', q.idealAnswer),
    questionId: q.id,
    category: q.category,
  }));

  const answered = questions.filter((q) => (answers[q.id] || '').trim()).length;
  const totalScore = evaluations.reduce((s, e) => s + e.score, 0);
  const overallScore = questions.length > 0 ? Math.round(totalScore / questions.length) : 0;
  const completion = questions.length > 0 ? Math.round((answered / questions.length) * 100) : 0;

  // Per-category breakdown
  const catMap = {};
  evaluations.forEach((e) => {
    if (!catMap[e.category]) catMap[e.category] = [];
    catMap[e.category].push(e.score);
  });
  const categoryScores = Object.entries(catMap).map(([category, scores]) => ({
    category,
    avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
  }));

  const strongTopics = categoryScores.filter((c) => c.avg >= 60).map((c) => c.category);
  const weakTopics   = categoryScores.filter((c) => c.avg < 40).map((c) => c.category);

  // Most missed keywords across all questions
  const freqMap = {};
  evaluations.forEach((e) => {
    e.missingKeywords.forEach((kw) => { freqMap[kw] = (freqMap[kw] || 0) + 1; });
  });
  const mostMissed = Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([kw]) => kw);

  return {
    evaluations,
    overallScore,
    completion,
    answered,
    unanswered: questions.length - answered,
    strongTopics,
    weakTopics,
    mostMissed,
    categoryScores,
  };
}
