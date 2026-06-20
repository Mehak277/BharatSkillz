import razorpayLogo from "@/assets/logos/razorpay.png";
import flipkartLogo from "@/assets/logos/flipkart.png";
import zomatoLogo from "@/assets/logos/zomato.png";
import swiggyLogo from "@/assets/logos/swiggy.png";
import microsoftLogo from "@/assets/logos/microsoft.png";
import tcsLogo from "@/assets/logos/tcs.png";

export type Internship = {
  id: string;
  role: string;
  company: string;
  logoColor: string;
  logo?: string;
  location: string;
  mode: "Remote" | "Hybrid" | "On-site";
  duration: string;
  stipend: string;
  skills: string[];
  postedDays: number;
  openings: number;
};

export const INTERNSHIPS: Internship[] = [
  { id: "i1", role: "Frontend Developer Intern", company: "Razorpay", logoColor: "#0a2540", logo: razorpayLogo,
    location: "Bengaluru", mode: "Hybrid", duration: "6 months", stipend: "₹35,000/mo",
    skills: ["React", "TypeScript", "Tailwind"], postedDays: 2, openings: 4 },
  { id: "i2", role: "Data Science Intern", company: "Flipkart", logoColor: "#2874f0", logo: flipkartLogo,
    location: "Bengaluru", mode: "On-site", duration: "4 months", stipend: "₹40,000/mo",
    skills: ["Python", "SQL", "ML"], postedDays: 1, openings: 2 },
  { id: "i3", role: "Growth Marketing Intern", company: "Zomato", logoColor: "#e23744", logo: zomatoLogo,
    location: "Gurugram", mode: "Hybrid", duration: "3 months", stipend: "₹25,000/mo",
    skills: ["SEO", "Google Ads", "Analytics"], postedDays: 4, openings: 3 },
  { id: "i4", role: "Product Design Intern", company: "Swiggy", logoColor: "#fc8019", logo: swiggyLogo,
    location: "Bengaluru", mode: "Remote", duration: "6 months", stipend: "₹30,000/mo",
    skills: ["Figma", "User Research", "Prototyping"], postedDays: 3, openings: 2 },
  { id: "i5", role: "AI / ML Intern", company: "Microsoft", logoColor: "#0078d4", logo: microsoftLogo,
    location: "Hyderabad", mode: "Hybrid", duration: "6 months", stipend: "₹55,000/mo",
    skills: ["PyTorch", "LLMs", "Python"], postedDays: 5, openings: 2 },
  { id: "i6", role: "Cyber Security Intern", company: "TCS", logoColor: "#1f3a8a", logo: tcsLogo,
    location: "Pune", mode: "On-site", duration: "4 months", stipend: "₹28,000/mo",
    skills: ["Networking", "Burp", "OWASP"], postedDays: 6, openings: 5 },
];
