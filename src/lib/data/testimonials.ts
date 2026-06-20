export type Testimonial = {
  id: string;
  name: string;
  initials: string;
  beforeRole: string;
  afterRole: string;
  company: string;
  package: string;
  quote: string;
  tone: "mint" | "peach" | "lavender" | "gold";
};

export const TESTIMONIALS: Testimonial[] = [
  { id: "t1", name: "Aarav Patel", initials: "AP", beforeRole: "Final-year student",
    afterRole: "SDE-1", company: "Razorpay", package: "₹18 LPA", tone: "mint",
    quote: "The Full Stack track gave me real projects, mock interviews and a mentor who walked me through every offer. I cracked 3 interviews in 6 weeks." },
  { id: "t2", name: "Ishita Rao", initials: "IR", beforeRole: "Mechanical engineer",
    afterRole: "Data Analyst", company: "Flipkart", package: "₹14 LPA", tone: "lavender",
    quote: "I switched from a non-tech role to data with BharatSkillz. The case studies and placement team made all the difference." },
  { id: "t3", name: "Mohit Singh", initials: "MS", beforeRole: "Service-company developer",
    afterRole: "AI Engineer", company: "Microsoft", package: "₹26 LPA", tone: "peach",
    quote: "The AI bootcamp is the most hands-on program I've taken. Built a RAG product in week 6 — that's what landed me the role." },
  { id: "t4", name: "Neha Gupta", initials: "NG", beforeRole: "BCom graduate",
    afterRole: "Growth Marketer", company: "Zomato", package: "₹11 LPA", tone: "gold",
    quote: "Ran live ad campaigns from week 2. The mentors gave brutally honest feedback and that's how I grew fast." },
  { id: "t5", name: "Rohan Malhotra", initials: "RM", beforeRole: "BTech CS student",
    afterRole: "Cloud Engineer", company: "Amazon", package: "₹22 LPA", tone: "mint",
    quote: "The AWS & DevOps track was incredibly practical. Running production-scale clusters and learning CI/CD helped me clear AWS certification and Amazon's interviews." },
  { id: "t6", name: "Ananya Iyer", initials: "AI", beforeRole: "BCA graduate",
    afterRole: "Backend Dev", company: "PhonePe", package: "₹15 LPA", tone: "lavender",
    quote: "The system design modules were outstanding. I went from writing simple APIs to understanding sharding, caching, and queuing systems. Truly career-defining." },
  { id: "t7", name: "Kabir Sen", initials: "KS", beforeRole: "Self-taught designer",
    afterRole: "Product Designer", company: "Swiggy", package: "₹12 LPA", tone: "peach",
    quote: "Creating high-fidelity UI/UX projects under industry mentors gave me a portfolio that stood out. The feedback on typography and spacing was exactly what I needed." },
  { id: "t8", name: "Priya Nair", initials: "PN", beforeRole: "BSC graduate",
    afterRole: "QA Automation", company: "TCS", package: "₹8.5 LPA", tone: "gold",
    quote: "BharatSkillz helped me transition from pure science to tech. The automation testing track and Selenium projects gave me a strong technical foundation." },
  { id: "t9", name: "Devansh Mehta", initials: "DM", beforeRole: "Marketing intern",
    afterRole: "Product Growth", company: "CRED", package: "₹16 LPA", tone: "mint",
    quote: "Data-driven marketing bootcamps here teach you real analytical skills. SQL and web analytics courses enabled me to crack CRED's rigorous product-case rounds." }
];
