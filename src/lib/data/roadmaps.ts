export type RoadmapPhase = {
  title: string;
  duration: string;
  topics: string[];
  tools?: string[];
  project: string;
};

export type DetailedRoadmap = {
  slug: string;
  description: string;
  duration: string;
  avgSalary: string;
  prerequisites: string;
  phases: RoadmapPhase[];
  careerOpportunities: string[];
};

export const DETAILED_ROADMAPS: Record<string, DetailedRoadmap> = {
  "ai-engineer": {
    slug: "ai-engineer",
    description: "Master Python, Machine Learning, Deep Learning, LLMs, RAG Systems, and MLOps while building real-world AI applications. By the end of the program, you'll have a strong portfolio, industry projects, and interview-ready skills.",
    duration: "9 Months",
    avgSalary: "₹14 LPA",
    prerequisites: "Basic computer knowledge. No coding required.",
    phases: [
      { title: "Python Foundations", duration: "Month 1", topics: ["Python Basics", "OOP", "Data Structures", "APIs", "Git & GitHub"], project: "Expense Tracker" },
      { title: "Data Analysis", duration: "Month 2", topics: ["NumPy", "Pandas", "Data Cleaning", "Visualization", "Statistics"], project: "Sales Dashboard" },
      { title: "Machine Learning", duration: "Month 3-4", topics: ["Regression", "Classification", "Clustering", "Feature Engineering", "Model Evaluation"], project: "House Price Predictor" },
      { title: "Deep Learning", duration: "Month 5", topics: ["Neural Networks", "TensorFlow", "PyTorch", "CNN", "RNN"], project: "Image Classifier" },
      { title: "NLP & Generative AI", duration: "Month 6", topics: ["NLP", "Transformers", "GPT Models", "Prompt Engineering"], project: "AI Content Generator" },
      { title: "LLMs & RAG", duration: "Month 7", topics: ["LangChain", "Vector DB", "RAG", "AI Agents"], project: "PDF Chatbot" },
      { title: "MLOps", duration: "Month 8", topics: ["Docker", "FastAPI", "AWS", "CI/CD"], project: "AI Deployment" },
      { title: "Capstone & Placement", duration: "Month 9", topics: ["Resume Building", "Mock Interviews", "Industry Project"], project: "AI Career Coach" }
    ],
    careerOpportunities: ["AI Engineer", "Machine Learning Engineer", "Data Scientist", "NLP Engineer", "LLM Engineer", "MLOps Engineer"]
  },
  "full-stack": {
    slug: "full-stack",
    description: "Master Web Fundamentals, React.js, Next.js, Node.js, and System Design while building production-ready web apps.",
    duration: "8 Months",
    avgSalary: "₹12 LPA",
    prerequisites: "Basic computer knowledge. No coding required.",
    phases: [
      { title: "Web Fundamentals", duration: "Month 1", topics: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "Git"], project: "Portfolio Website" },
      { title: "Advanced JavaScript", duration: "Month 2", topics: ["ES6+", "DOM", "Async JS", "APIs"], project: "Weather App" },
      { title: "React.js", duration: "Month 3", topics: ["Components", "Hooks", "Routing", "State Management"], project: "Ecommerce Frontend" },
      { title: "Next.js", duration: "Month 4", topics: ["SSR", "SSG", "SEO", "Authentication"], project: "Blog Platform" },
      { title: "Backend Development", duration: "Month 5", topics: ["Node.js", "Express.js", "REST APIs", "JWT Auth"], project: "Authentication System" },
      { title: "Database", duration: "Month 6", topics: ["MongoDB", "PostgreSQL", "Database Design"], project: "CRM Backend" },
      { title: "System Design", duration: "Month 7", topics: ["Scalability", "Caching", "Load Balancing", "Microservices"], project: "URL Shortener" },
      { title: "Capstone & Placement", duration: "Month 8", topics: ["Full Ecommerce Platform", "Admin Dashboard", "Payment Gateway"], project: "Full Stack Ecommerce" }
    ],
    careerOpportunities: ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Software Development Engineer (SDE)"]
  },
  "data-science": {
    slug: "data-science",
    description: "Master Python, SQL, Statistics, Machine Learning, and Deep Learning. Build a strong portfolio of real-world business cases and analytics dashboards.",
    duration: "8 Months",
    avgSalary: "₹13 LPA",
    prerequisites: "Basic computer knowledge. No coding required.",
    phases: [
      { title: "Python & SQL", duration: "Month 1", topics: ["Python", "SQL Queries", "Data Manipulation"], project: "Database Analytics" },
      { title: "Statistics", duration: "Month 2", topics: ["Probability", "Hypothesis Testing", "Descriptive Statistics"], project: "Market Analysis" },
      { title: "Data Analysis", duration: "Month 3", topics: ["Pandas", "NumPy", "EDA"], project: "Customer Insights" },
      { title: "Data Visualization", duration: "Month 4", topics: ["Tableau", "Power BI", "Matplotlib"], project: "Business Dashboard" },
      { title: "Machine Learning", duration: "Month 5", topics: ["Regression", "Classification", "Clustering"], project: "Customer Churn Prediction" },
      { title: "Deep Learning", duration: "Month 6", topics: ["ANN", "CNN", "NLP Basics"], project: "Sentiment Analysis" },
      { title: "Business Cases", duration: "Month 7", topics: ["Retail Analytics", "Finance Analytics", "Marketing Analytics"], project: "Revenue Forecasting" },
      { title: "Capstone & Placement", duration: "Month 8", topics: ["Resume Building", "Mock Interviews", "End-to-End Data Science Solution"], project: "Data Science Capstone" }
    ],
    careerOpportunities: ["Data Scientist", "Data Analyst", "Machine Learning Engineer", "Business Analyst", "BI Developer"]
  },
  "cyber-security": {
    slug: "cyber-security",
    description: "Master Networking, Web Security, Penetration Testing, and SOC Operations. Become an expert in identifying vulnerabilities and securing infrastructure.",
    duration: "7 Months",
    avgSalary: "₹11 LPA",
    prerequisites: "Basic computer knowledge. No coding required.",
    phases: [
      { title: "Networking", duration: "Month 1", topics: ["TCP/IP", "OSI Model", "DNS", "Routing"], project: "Network Setup" },
      { title: "Linux & Security Basics", duration: "Month 2", topics: ["Linux Commands", "User Management", "Security Fundamentals"], project: "Secure Linux Server" },
      { title: "Web Security", duration: "Month 3", topics: ["OWASP Top 10", "Vulnerability Assessment"], project: "Web Security Audit" },
      { title: "Penetration Testing", duration: "Month 4", topics: ["Burp Suite", "Nmap", "Metasploit"], project: "Pentesting Lab" },
      { title: "SOC Operations", duration: "Month 5", topics: ["SIEM", "Incident Response", "Threat Hunting"], project: "SOC Monitoring" },
      { title: "Cloud Security", duration: "Month 6", topics: ["AWS Security", "IAM", "Cloud Threats"], project: "Secure Cloud Infrastructure" },
      { title: "Capstone & Placement", duration: "Month 7", topics: ["Resume Building", "Mock Interviews", "Enterprise Security Assessment"], project: "Enterprise Pentest" }
    ],
    careerOpportunities: ["Cyber Security Analyst", "Penetration Tester", "SOC Analyst", "Security Engineer", "Ethical Hacker"]
  },
  "digital-marketing": {
    slug: "digital-marketing",
    description: "Master SEO, Performance Marketing, Social Media, and Analytics. Run end-to-end campaigns and become a full-stack growth marketer.",
    duration: "6 Months",
    avgSalary: "₹9 LPA",
    prerequisites: "Basic computer knowledge. No coding required.",
    phases: [
      { title: "Marketing Fundamentals", duration: "Month 1", topics: ["Digital Marketing Basics", "Customer Journey", "Branding"], project: "Brand Strategy" },
      { title: "SEO Mastery", duration: "Month 2", topics: ["On-Page SEO", "Off-Page SEO", "Technical SEO"], project: "Website SEO Audit" },
      { title: "Performance Marketing", duration: "Month 3", topics: ["Google Ads", "Meta Ads", "Remarketing"], project: "Lead Generation Campaign" },
      { title: "Content & Social Media", duration: "Month 4", topics: ["Instagram", "LinkedIn", "YouTube", "Content Strategy"], project: "Social Media Calendar" },
      { title: "Analytics & Automation", duration: "Month 5", topics: ["GA4", "Tag Manager", "Email Marketing", "CRM"], project: "Marketing Dashboard" },
      { title: "Capstone & Placement", duration: "Month 6", topics: ["Resume Building", "Mock Interviews", "Complete Digital Marketing Campaign"], project: "Live Campaign Execution" }
    ],
    careerOpportunities: ["SEO Specialist", "Performance Marketer", "Growth Marketer", "Social Media Manager", "Digital Marketing Lead"]
  }
};
