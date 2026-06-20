export const SITE = {
  name: "BharatSkillz",
  tagline: "Learn Skills. Gain Experience. Build Your Career.",
  description:
    "India's premium career platform — industry-focused courses, paid internships, mentorship, certifications and placement support.",
};

export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Courses", to: "/courses" },
  { label: "Internships", to: "/internships" },
  { label: "Career Tracks", to: "/career-tracks" },
  
  { label: "Success Stories", to: "/success-stories" },
  { label: "Contact", to: "/contact" },
] as const;

export const STATS = [
  { label: "Students Trained", value: 52000, suffix: "+" },
  { label: "Hiring Partners", value: 480, suffix: "+" },
  { label: "Internships Offered", value: 12500, suffix: "+" },
  { label: "Placement Success Rate", value: 92, suffix: "%" },
];

export const TRUSTED_COMPANIES = [
  "Google", "Microsoft", "Amazon", "Flipkart", "TCS",
  "Infosys", "Zomato", "Swiggy", "Paytm", "Wipro", "Razorpay", "Byju's",
];
