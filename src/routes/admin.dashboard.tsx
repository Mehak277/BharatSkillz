import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { collectionGroup, getDocs, query, orderBy, doc, updateDoc, addDoc, collection } from "firebase/firestore";
import { getFirebaseFirestore } from "@/lib/firebase/config";
import { useAuth } from "@/contexts/AuthContext";
import { useCourses, addCourse as dbAddCourse, deleteCourse as dbDeleteCourse, updateCourse as dbUpdateCourse } from "@/lib/firebase/courses";
import { useInternships, addInternship as dbAddInternship, deleteInternship as dbDeleteInternship, updateInternship as dbUpdateInternship } from "@/lib/firebase/internships";
import { useSubscribers, deleteSubscriber as dbDeleteSubscriber } from "@/lib/firebase/subscribers";
import { useBlogs, addBlog as dbAddBlog, updateBlog as dbUpdateBlog, deleteBlog as dbDeleteBlog } from "@/lib/firebase/blogs";
import { updateUserPassword } from "@/lib/firebase/auth";
import { useUsers, createUserProfile, toggleUserStatus as dbToggleUserStatus, toggleUserRole as dbToggleUserRole, deleteUserProfile as dbDeleteUserProfile } from "@/lib/firebase/users";
import {
  Users as UsersIcon,
  BookOpen as BookOpenIcon,
  Briefcase as BriefcaseIcon,
  BarChart3 as BarChartIcon,
  LogOut as LogOutIcon,
  ShieldCheck as ShieldIcon,
  Search as SearchIcon,
  Plus as PlusIcon,
  Trash2 as TrashIcon,
  Edit2 as EditIcon,
  CheckCircle as CheckCircleIcon,
  LayoutDashboard as DashboardIcon,
  Settings as SettingsIcon,
  FileText as FileTextIcon,
  UserCheck as UserCheckIcon,
  UserX as UserXIcon,
  TrendingUp as TrendingIcon,
  GraduationCap,
  Mail as MailIcon,
  Download as DownloadIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
} from "recharts";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

// Types
interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Student";
  status: "Active" | "Suspended";
  joined: string;
}

interface CourseRecord {
  slug: string;
  title: string;
  category: string;
  price: number;
  originalPrice: number;
  lessons: number;
  rating: number;
}

interface InternshipRecord {
  id: string;
  role: string;
  company: string;
  location: string;
  stipend: string;
  openings: number;
  status: "Approved" | "Pending" | "Rejected";
}

interface ApplicationRecord {
  id: string;
  docPath?: string;
  userId: string;
  internshipId: string;
  name: string;
  email: string;
  role: string;
  company: string;
  status: "Applied" | "Shortlisted" | "Interview" | "Selected" | "Rejected";
  date: string;
}

const CHART_DATA = [
  { month: "Jan", users: 12000, revenue: 15 },
  { month: "Feb", users: 19000, revenue: 22 },
  { month: "Mar", users: 26000, revenue: 28 },
  { month: "Apr", users: 34000, revenue: 38 },
  { month: "May", users: 45000, revenue: 42 },
  { month: "Jun", users: 52148, revenue: 48 },
];

function AdminDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const isAdminSession = typeof window !== "undefined" && localStorage.getItem("admin_session") === "true";
  console.log('Admin session:', isAdminSession, 'Loading:', loading, 'User:', !!user);

  useEffect(() => {
    if (!loading && !user && !isAdminSession) {
      navigate({ to: "/admin" });
    }
  }, [user, loading, navigate, isAdminSession]);

  const [activeTab, setActiveTab] = useState<"overview" | "users" | "courses" | "internships" | "applications" | "subscribers" | "blogs" | "settings">("overview");

  // Firestore data hooks
  const { courses = [], loading: coursesLoading } = useCourses();
  const { internships = [], loading: internshipsLoading } = useInternships();
  const { users: dbUsers = [], loading: usersLoading } = useUsers();
  const { subscribers = [], loading: subscribersLoading } = useSubscribers();
  const { blogs = [], loading: blogsLoading } = useBlogs();

  const users: UserRecord[] = dbUsers.map(u => ({
    id: u.uid,
    name: u.name,
    email: u.email,
    role: u.role === "admin" ? "Admin" : "Student",
    status: u.status,
    joined: u.createdAt ? new Date(((u.createdAt as any)?.seconds || 0) * 1000).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Recently",
  }));

  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [appsLoading, setAppsLoading] = useState(true);

  useEffect(() => {
    async function fetchApps() {
      try {
        const db = getFirebaseFirestore();
        const appsQuery = query(collectionGroup(db, "applications"));
        const snapshot = await getDocs(appsQuery);
        let fetchedApps = snapshot.docs.map(doc => {
          const data = doc.data();
          const docPath = doc.ref.path;
          return {
            id: doc.id,
            docPath: docPath,
            userId: data.userId || "unknown",
            internshipId: data.internshipId || doc.id,
            name: data.applicantName || "Unknown",
            email: data.applicantPhone || "N/A",
            role: data.role || "Unknown",
            company: data.company || "Unknown",
            status: data.status || "Applied",
            date: data.appliedOn || new Date().toLocaleDateString(),
            appliedAt: data.appliedAt || null
          };
        });

        fetchedApps.sort((a, b) => {
          const timeA = a.appliedAt?.toMillis ? a.appliedAt.toMillis() : 0;
          const timeB = b.appliedAt?.toMillis ? b.appliedAt.toMillis() : 0;
          return timeB - timeA;
        });

        setApplications(fetchedApps as ApplicationRecord[]);
      } catch (err) {
        console.error("Failed to fetch applications", err);
      } finally {
        setAppsLoading(false);
      }
    }
    fetchApps();
  }, []);

  const [settings, setSettings] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("admin_settings");
      if (saved) return JSON.parse(saved);
    }
    return {
      siteName: "BharatSkillz",
      maintenanceMode: false,
      systemEmail: "admin@bharatskillz.in",
      platformFee: 10,
      supportPhone: "+91 98765 43210",
    };
  });

  // Search queries
  const [userSearch, setUserSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");
  const [internshipSearch, setInternshipSearch] = useState("");
  const [appSearch, setAppSearch] = useState("");
  const [subscriberSearch, setSubscriberSearch] = useState("");
  const [blogSearch, setBlogSearch] = useState("");

  const [newCourse, setNewCourse] = useState({ title: "", category: "", price: "", originalPrice: "", lessons: "", rating: "4.5", image: "", youtubePlaylistUrl: "" });
  const [newInternship, setNewInternship] = useState({ role: "", company: "", logo: "", location: "", stipend: "", openings: "" });
  const [newBlog, setNewBlog] = useState({ 
    title: "", 
    slug: "",
    description: "", 
    content: "", 
    category: "General", 
    readTime: "5 min read", 
    tags: "", 
    image: "", 
    authorName: "BharatSkillz Editor",
    authorImage: "https://ui-avatars.com/api/?name=Admin&background=random",
    metaTitle: "",
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  });

  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [isEditCourseOpen, setIsEditCourseOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [isAddInternshipOpen, setIsAddInternshipOpen] = useState(false);
  const [isEditInternshipOpen, setIsEditInternshipOpen] = useState(false);
  const [editingInternship, setEditingInternship] = useState<any>(null);
  const [isAddBlogOpen, setIsAddBlogOpen] = useState(false);
  const [isEditBlogOpen, setIsEditBlogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);

  // Sync remaining mock state to LocalStorage
  useEffect(() => { localStorage.setItem("admin_settings", JSON.stringify(settings)); }, [settings]);

  // Handlers
  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.title || !newCourse.category || !newCourse.price) { toast.error("Please fill in required fields."); return; }
    try {
      await dbAddCourse({
        slug: newCourse.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        title: newCourse.title,
        category: newCourse.category,
        price: Number(newCourse.price) || 0,
        originalPrice: Number(newCourse.originalPrice) || Number(newCourse.price) || 0,
        lessons: Number(newCourse.lessons) || 10,
        rating: Number(newCourse.rating) || 4.5,
        level: "Beginner",
        duration: "3 months",
        students: 0,
        certificate: true,
        emoji: "📚",
        short: `Learn ${newCourse.title} from basic to advanced.`,
        long: `This is a comprehensive course covering ${newCourse.title} with hands-on projects and expert mentorship.`,
        outcomes: ["Master core concepts", "Build real-world projects", "Get certified"],
        status: "active",
        image: newCourse.image || "",
        youtubePlaylistUrl: newCourse.youtubePlaylistUrl || "",
      });
      setNewCourse({ title: "", category: "", price: "", originalPrice: "", lessons: "", rating: "4.5", image: "", youtubePlaylistUrl: "" });
      setIsAddCourseOpen(false);

      const activeSubscribers = subscribers.filter(s => s.status === "active").map(s => s.email);
      if (activeSubscribers.length > 0) {
        const db = getFirebaseFirestore();
        await addDoc(collection(db, "mail"), {
          to: "hello@bharatskillz.com", // Send to a central address, bcc the rest
          bcc: activeSubscribers,
          message: {
            subject: `New Course Alert: ${newCourse.title} 🚀`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                <h2 style="color: #10b981; margin-bottom: 16px;">New Course Available! 📚</h2>
                <p style="font-size: 16px; line-height: 1.6; color: #1e293b;">We just added a brand new course: <strong>${newCourse.title}</strong>.</p>
                <p style="font-size: 16px; line-height: 1.6; color: #1e293b;">Check it out on BharatSkillz and start learning today!</p>
              </div>
            `
          }
        });
      }

      toast.success(`Course ${newCourse.title} added successfully.`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to publish course to Firestore.");
    }
  };

  const handleEditCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse || !editingCourse.id) return;
    try {
      await dbUpdateCourse(editingCourse.id, {
        title: editingCourse.title,
        category: editingCourse.category,
        price: Number(editingCourse.price) || 0,
        originalPrice: Number(editingCourse.originalPrice) || 0,
        lessons: Number(editingCourse.lessons) || 10,
        rating: Number(editingCourse.rating) || 4.5,
        image: editingCourse.image || "",
        youtubePlaylistUrl: editingCourse.youtubePlaylistUrl || "",
      });
      setIsEditCourseOpen(false);
      setEditingCourse(null);
      toast.success(`Course ${editingCourse.title} updated successfully.`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update course in Firestore.");
    }
  };

  const openEditCourse = (c: any) => {
    setEditingCourse(c);
    setIsEditCourseOpen(true);
  };

  const handleAddInternship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInternship.role || !newInternship.company) { toast.error("Please fill in required fields."); return; }
    try {
      await dbAddInternship({
        role: newInternship.role,
        company: newInternship.company,
        logo: newInternship.logo,
        location: newInternship.location || "Remote",
        stipend: newInternship.stipend || "TBD",
        openings: Number(newInternship.openings) || 1,
        status: "Pending",
        logoColor: "#6366f1",
        mode: "Remote",
        duration: "3 months",
        skills: ["React", "Node.js"],
        postedDays: 0,
      });
      setNewInternship({ role: "", company: "", logo: "", location: "", stipend: "", openings: "" });
      setIsAddInternshipOpen(false);

      const activeSubscribers = subscribers.filter(s => s.status === "active").map(s => s.email);
      if (activeSubscribers.length > 0) {
        const db = getFirebaseFirestore();
        await addDoc(collection(db, "mail"), {
          to: "hello@bharatskillz.com",
          bcc: activeSubscribers,
          message: {
            subject: `New Internship Opportunity: ${newInternship.role} at ${newInternship.company} 💼`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                <h2 style="color: #10b981; margin-bottom: 16px;">New Internship Alert! 🚀</h2>
                <p style="font-size: 16px; line-height: 1.6; color: #1e293b;">A new internship opportunity has been posted: <strong>${newInternship.role}</strong> at <strong>${newInternship.company}</strong>.</p>
                <p style="font-size: 16px; line-height: 1.6; color: #1e293b;">Log into BharatSkillz to apply before the openings are filled!</p>
              </div>
            `
          }
        });
      }

      toast.success("Internship posted for approval.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to post internship to Firestore.");
    }
  };

  const handleEditInternshipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInternship || !editingInternship.id) return;
    try {
      await dbUpdateInternship(editingInternship.id, {
        role: editingInternship.role,
        company: editingInternship.company,
        logo: editingInternship.logo,
        location: editingInternship.location,
        stipend: editingInternship.stipend,
        openings: Number(editingInternship.openings),
      });
      setIsEditInternshipOpen(false);
      setEditingInternship(null);
      toast.success(`Internship updated successfully.`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update internship.");
    }
  };

  const openEditInternship = (i: any) => {
    setEditingInternship(i);
    setIsEditInternshipOpen(true);
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    try {
      await dbToggleUserStatus(userId, currentStatus);
      toast.info(`User status updated.`);
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      await dbDeleteCourse(id);
      toast.error("Course removed");
    } catch (err) {
      toast.error("Failed to delete course.");
    }
  };

  const handleUpdateInternshipStatus = async (id: string, status: "Approved" | "Rejected") => {
    try {
      await dbUpdateInternship(id, { status });
      toast.success(`Internship status updated: ${status}`);
    } catch (err) {
      toast.error("Failed to update internship status.");
    }
  };

  const handleDeleteInternship = async (id: string) => {
    try {
      await dbDeleteInternship(id);
      toast.error("Internship posting deleted");
    } catch (err) {
      toast.error("Failed to delete internship listing.");
    }
  };

  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.description) { toast.error("Title and description are required."); return; }
    try {
      const blogData = {
        ...newBlog,
        slug: newBlog.slug || newBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        tags: newBlog.tags ? newBlog.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      };
      await dbAddBlog(blogData as any);
      setNewBlog({ 
        title: "", slug: "", description: "", content: "", category: "General", readTime: "5 min read", 
        tags: "", image: "", authorName: "BharatSkillz Editor", authorImage: "https://ui-avatars.com/api/?name=Admin&background=random", 
        metaTitle: "", date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) 
      });
      setIsAddBlogOpen(false);
      toast.success("Blog post added.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add blog.");
    }
  };

  const handleEditBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog || !editingBlog.id) return;
    try {
      await dbUpdateBlog(editingBlog.id, {
        title: editingBlog.title,
        slug: editingBlog.slug || editingBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: editingBlog.description,
        content: editingBlog.content,
        category: editingBlog.category,
        readTime: editingBlog.readTime,
        tags: typeof editingBlog.tags === 'string' ? editingBlog.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : editingBlog.tags,
        image: editingBlog.image,
        authorName: editingBlog.authorName,
        authorImage: editingBlog.authorImage,
        metaTitle: editingBlog.metaTitle,
        date: editingBlog.date,
      });
      setIsEditBlogOpen(false);
      setEditingBlog(null);
      toast.success(`Blog updated successfully.`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update blog.");
    }
  };

  const openEditBlog = (b: any) => {
    setEditingBlog({
      ...b,
      tags: Array.isArray(b.tags) ? b.tags.join(', ') : b.tags
    });
    setIsEditBlogOpen(true);
  };

  const handleDeleteBlog = async (id: string) => {
    try {
      await dbDeleteBlog(id);
      toast.error("Blog post removed");
    } catch (err) {
      toast.error("Failed to delete blog.");
    }
  };

  const updateApplicationStatus = async (id: string, status: ApplicationRecord["status"]) => {
    const app = applications.find(a => a.id === id);
    if (!app) return;
    
    try {
      const db = getFirebaseFirestore();
      // Use docPath if available (for both subcollection and top-level apps)
      const docRef = app.docPath ? doc(db, app.docPath) : doc(db, "applications", app.id);
      await updateDoc(docRef, { status });
      
      setApplications(applications.map(a => {
        if (a.id === id) { return { ...a, status }; }
        return a;
      }));
      toast.success(`Application for ${app.name} marked as ${status}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update application status.");
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => { e.preventDefault(); toast.success("System configurations updated successfully."); };

  // Filters
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())
  );
  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(courseSearch.toLowerCase()) || c.category.toLowerCase().includes(courseSearch.toLowerCase())
  );
  const filteredInternships = internships.filter(i =>
    i.role.toLowerCase().includes(internshipSearch.toLowerCase()) || i.company.toLowerCase().includes(internshipSearch.toLowerCase())
  );
  const filteredApps = applications.filter(a =>
    a.name.toLowerCase().includes(appSearch.toLowerCase()) ||
    a.company.toLowerCase().includes(appSearch.toLowerCase()) ||
    a.role.toLowerCase().includes(appSearch.toLowerCase())
  );
  const filteredBlogs = blogs.filter(b =>
    b.title.toLowerCase().includes(blogSearch.toLowerCase()) || b.author.toLowerCase().includes(blogSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!user && !isAdminSession) return null;

  const NAV_ITEMS = [
    { id: "overview", label: "Overview", icon: DashboardIcon },
    { id: "users", label: "Manage Users", icon: UsersIcon },
    { id: "courses", label: "Manage Courses", icon: BookOpenIcon },
    { id: "internships", label: "Manage Internships", icon: BriefcaseIcon },
    { id: "applications", label: "Applications", icon: FileTextIcon },
    { id: "subscribers", label: "Subscribers", icon: MailIcon },
    { id: "blogs", label: "Manage Blogs", icon: FileTextIcon },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ] as const;

  // Subscribers filtered list
  const filteredSubscribers = subscribers.filter(s =>
    s.email.toLowerCase().includes(subscriberSearch.toLowerCase())
  );

  const handleDeleteSubscriber = async (email: string) => {
    try {
      await dbDeleteSubscriber(email);
      toast.success(`Subscriber ${email} removed.`);
    } catch (err) {
      toast.error("Failed to remove subscriber.");
    }
  };

  const handleExportSubscribers = () => {
    const csv = ["Email,Status,Subscribed At", ...subscribers.map(s => {
      const date = s.subscribedAt ? new Date((s.subscribedAt as any).seconds * 1000).toLocaleDateString("en-IN") : "Unknown";
      return `${s.email},${s.status},${date}`;
    })].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bharatskillz-subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${subscribers.length} subscribers to CSV.`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">

      {/* ── Top Header ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <GraduationCap className="h-5 w-5" />
          </span>
          <div>
            <span className="font-display text-base font-extrabold tracking-tight text-foreground">BharatSkillz</span>
            <Badge className="ml-2 text-[10px] py-0 px-1.5 bg-primary/10 text-primary border border-primary/20">Admin</Badge>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full py-1 px-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            System Healthy
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { toast.success("Signed out successfully"); navigate({ to: "/admin" }); }}
            className="text-muted-foreground hover:text-foreground text-xs"
          >
            <LogOutIcon className="h-3.5 w-3.5 mr-2" /> Sign Out
          </Button>
        </div>
      </header>

      {/* ── Shell ──────────────────────────────────────────────────── */}
      <div className="flex flex-1">

        {/* Sidebar */}
        <aside className="hidden md:flex w-60 border-r border-border flex-col justify-between bg-card fixed left-0 top-[57px] h-[calc(100vh-57px)] overflow-y-auto p-4 z-40">
          <div className="space-y-6">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3">Navigation</p>
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as typeof activeTab)}
                    className={`w-full group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-200 ${active
                        ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User card at bottom */}
          <div className="glass-card border border-border bg-secondary/40 rounded-2xl p-4 mt-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/20 text-primary font-bold">
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-sm font-bold text-foreground">{user?.displayName || "Administrator"}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email || "admin@bharatskillz.in"}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-full md:ml-60">

          {/* Mobile tab scroll */}
          <div className="flex md:hidden gap-1.5 overflow-x-auto pb-4 mb-4 border-b border-border">
            {NAV_ITEMS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`shrink-0 text-xs font-semibold px-4 py-2 rounded-lg border transition-all ${activeTab === tab.id
                    ? "bg-primary text-primary-foreground border-transparent"
                    : "bg-card text-muted-foreground border-border hover:bg-secondary"
                  }`}
              >
                {tab.label.split(" ")[tab.label.split(" ").length - 1]}
              </button>
            ))}
          </div>

          {/* ── TAB: OVERVIEW ──────────────────────────────────────── */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-fade-in-up">
              <div>
                <h2 className="text-2xl font-black text-foreground">Console Overview</h2>
                <p className="text-sm text-muted-foreground mt-1">Real-time platform metrics and pending actions.</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Users", value: usersLoading ? "…" : users.length, diff: `${users.filter(u => u.status === "Active").length} active`, icon: UsersIcon, color: "bg-primary/10 text-primary border-primary/20" },
                  { label: "Active Courses", value: coursesLoading ? "…" : courses.length, diff: "Live from Firestore", icon: BookOpenIcon, color: "bg-sky-50 text-sky-600 border-sky-200" },
                  { label: "Internships Listed", value: internshipsLoading ? "…" : internships.length, diff: `${internships.filter(i => i.status === "Pending").length} pending`, icon: BriefcaseIcon, color: "bg-amber-50 text-amber-600 border-amber-200" },
                  { label: "Suspended Users", value: usersLoading ? "…" : users.filter(u => u.status === "Suspended").length, diff: "needs review", icon: TrendingIcon, color: "bg-rose-50 text-rose-600 border-rose-200" },
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="glass-card lift-card border border-border bg-card rounded-2xl p-5">
                      <div className="flex justify-between items-start">
                        <div className={`grid h-10 w-10 place-items-center rounded-xl border ${stat.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600">{stat.diff}</span>
                      </div>
                      <div className="mt-4">
                        <p className="text-xs font-semibold text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-extrabold mt-1 text-foreground tracking-tight">{stat.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chart + Approvals */}
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card border border-border bg-card rounded-2xl p-5">
                  <div className="flex justify-between items-center mb-5">
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Registration & Growth Trends</h3>
                      <p className="text-[10px] text-muted-foreground">Student counts over the last 6 months</p>
                    </div>
                    <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-200 bg-emerald-50">Live</Badge>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="oklch(0.62 0.17 148)" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="oklch(0.62 0.17 148)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 240)" />
                        <XAxis dataKey="month" stroke="oklch(0.55 0.02 240)" fontSize={10} />
                        <YAxis stroke="oklch(0.55 0.02 240)" fontSize={10} />
                        <ChartTooltip contentStyle={{ backgroundColor: "#fff", borderColor: "#e5e7eb", color: "#111", borderRadius: "10px", fontSize: "12px" }} />
                        <Area type="monotone" dataKey="users" stroke="oklch(0.62 0.17 148)" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Pending Approvals */}
                <div className="glass-card border border-border bg-card rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-foreground mb-4">Pending Approvals</h3>
                    <div className="space-y-3">
                      {internships.filter(i => i.status === "Pending").map((item) => (
                        <div key={item.id} className="p-3.5 rounded-xl bg-secondary/50 border border-border">
                          <p className="text-xs font-bold text-foreground">{item.role}</p>
                          <p className="text-[10px] text-muted-foreground mb-3">{item.company} · {item.location}</p>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleUpdateInternshipStatus(item.id, "Approved")} className="h-7 px-3 bg-primary text-primary-foreground text-[10px]">Approve</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleUpdateInternshipStatus(item.id, "Rejected")} className="h-7 px-3 text-[10px]">Reject</Button>
                          </div>
                        </div>
                      ))}
                      {internships.filter(i => i.status === "Pending").length === 0 && (
                        <div className="text-center py-8">
                          <CheckCircleIcon className="h-8 w-8 text-primary mx-auto mb-2 opacity-50" />
                          <p className="text-xs text-muted-foreground font-medium">All items approved!</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border flex justify-between items-center text-[10px] text-muted-foreground">
                    <span>System Online</span>
                    <span>Last backup: 10m ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: USERS ─────────────────────────────────────────── */}
          {activeTab === "users" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-foreground">User Accounts</h2>
                  <p className="text-sm text-muted-foreground mt-1">Manage and audit student and admin credentials.</p>
                </div>
              </div>

              <div className="relative">
                <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search user name or email..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className="pl-10 w-full max-w-md" />
              </div>

              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <Table>
                  <TableHeader className="bg-secondary/50">
                    <TableRow className="border-b border-border">
                      <TableHead className="text-muted-foreground text-xs font-semibold py-4">User Details</TableHead>
                      <TableHead className="text-muted-foreground text-xs font-semibold">Role</TableHead>
                      <TableHead className="text-muted-foreground text-xs font-semibold">Joined</TableHead>
                      <TableHead className="text-muted-foreground text-xs font-semibold">Status</TableHead>
                      <TableHead className="text-muted-foreground text-xs font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((u) => (
                      <TableRow key={u.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                        <TableCell className="py-4">
                          <div>
                            <p className="text-sm font-semibold text-foreground">{u.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{u.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={u.role === "Admin" ? "bg-violet-50 text-violet-600 border border-violet-200" : "bg-primary/10 text-primary border border-primary/20"}>
                            {u.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{u.joined}</TableCell>
                        <TableCell>
                          <Badge className={u.status === "Active" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"}>
                            {u.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2.5 justify-end">
                            <Button variant="outline" size="sm" onClick={() => handleToggleUserStatus(u.id, u.status)} className="h-8" title={u.status === "Active" ? "Suspend user" : "Activate user"}>
                              {u.status === "Active" ? <UserXIcon className="h-3.5 w-3.5 text-destructive" /> : <UserCheckIcon className="h-3.5 w-3.5 text-emerald-600" />}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredUsers.length === 0 && (
                      <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-xs">No users matched your search criteria.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* ── TAB: COURSES ───────────────────────────────────────── */}
          {activeTab === "courses" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-foreground">Course Catalog</h2>
                  <p className="text-sm text-muted-foreground mt-1">Review, post and modify active learning curricula.</p>
                </div>
                <Dialog open={isAddCourseOpen} onOpenChange={setIsAddCourseOpen}>
                  <DialogTrigger asChild>
                    <Button className="h-10 bg-primary text-primary-foreground btn-shine">
                      <PlusIcon className="h-4 w-4 mr-2" /> Add Course
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border border-border text-foreground rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-lg font-bold">Publish New Course</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddCourse} className="space-y-4 py-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="crs-title" className="text-xs">Course Title</Label>
                        <Input id="crs-title" value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} placeholder="e.g. Cybersecurity Pentesting Masterclass" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="crs-category" className="text-xs">Category</Label>
                        <Input id="crs-category" value={newCourse.category} onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })} placeholder="Development, Data Science, AI, Design" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="crs-image" className="text-xs">Image URL</Label>
                        <Input id="crs-image" value={newCourse.image} onChange={(e) => setNewCourse({ ...newCourse, image: e.target.value })} placeholder="https://images.unsplash.com/..." />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="crs-youtube" className="text-xs">YouTube Playlist URL</Label>
                        <Input id="crs-youtube" value={newCourse.youtubePlaylistUrl} onChange={(e) => setNewCourse({ ...newCourse, youtubePlaylistUrl: e.target.value })} placeholder="https://www.youtube.com/playlist?list=..." />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="crs-price" className="text-xs">Sale Price (₹)</Label>
                          <Input id="crs-price" type="number" value={newCourse.price} onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })} placeholder="14999" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="crs-orig" className="text-xs">Original Price (₹)</Label>
                          <Input id="crs-orig" type="number" value={newCourse.originalPrice} onChange={(e) => setNewCourse({ ...newCourse, originalPrice: e.target.value })} placeholder="29999" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="crs-lessons" className="text-xs">Lesson Count</Label>
                          <Input id="crs-lessons" type="number" value={newCourse.lessons} onChange={(e) => setNewCourse({ ...newCourse, lessons: e.target.value })} placeholder="120" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="crs-rating" className="text-xs">Initial Rating</Label>
                          <Input id="crs-rating" type="number" step="0.1" min="1" max="5" value={newCourse.rating} onChange={(e) => setNewCourse({ ...newCourse, rating: e.target.value })} />
                        </div>
                      </div>
                      <DialogFooter className="pt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsAddCourseOpen(false)}>Cancel</Button>
                        <Button type="submit" className="bg-primary text-primary-foreground">Publish Course</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog open={isEditCourseOpen} onOpenChange={setIsEditCourseOpen}>
                  <DialogContent className="bg-card border border-border text-foreground rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-lg font-bold">Edit Course</DialogTitle>
                    </DialogHeader>
                    {editingCourse && (
                      <form onSubmit={handleEditCourseSubmit} className="space-y-4 py-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="edit-crs-title" className="text-xs">Course Title</Label>
                          <Input id="edit-crs-title" value={editingCourse.title} onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })} placeholder="Course Title" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="edit-crs-category" className="text-xs">Category</Label>
                          <Input id="edit-crs-category" value={editingCourse.category} onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })} placeholder="Development, Data Science..." />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="edit-crs-image" className="text-xs">Image URL</Label>
                          <Input id="edit-crs-image" value={editingCourse.image} onChange={(e) => setEditingCourse({ ...editingCourse, image: e.target.value })} placeholder="https://images.unsplash.com/..." />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="edit-crs-youtube" className="text-xs">YouTube Playlist URL</Label>
                          <Input id="edit-crs-youtube" value={editingCourse.youtubePlaylistUrl || ""} onChange={(e) => setEditingCourse({ ...editingCourse, youtubePlaylistUrl: e.target.value })} placeholder="https://www.youtube.com/playlist?list=..." />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="edit-crs-price" className="text-xs">Sale Price (₹)</Label>
                            <Input id="edit-crs-price" type="number" value={editingCourse.price} onChange={(e) => setEditingCourse({ ...editingCourse, price: e.target.value })} />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="edit-crs-orig" className="text-xs">Original Price (₹)</Label>
                            <Input id="edit-crs-orig" type="number" value={editingCourse.originalPrice} onChange={(e) => setEditingCourse({ ...editingCourse, originalPrice: e.target.value })} />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="edit-crs-lessons" className="text-xs">Lesson Count</Label>
                            <Input id="edit-crs-lessons" type="number" value={editingCourse.lessons} onChange={(e) => setEditingCourse({ ...editingCourse, lessons: e.target.value })} />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="edit-crs-rating" className="text-xs">Initial Rating</Label>
                            <Input id="edit-crs-rating" type="number" step="0.1" min="1" max="5" value={editingCourse.rating} onChange={(e) => setEditingCourse({ ...editingCourse, rating: e.target.value })} />
                          </div>
                        </div>
                        <DialogFooter className="pt-4">
                          <Button type="button" variant="ghost" onClick={() => setIsEditCourseOpen(false)}>Cancel</Button>
                          <Button type="submit" className="bg-primary text-primary-foreground">Save Changes</Button>
                        </DialogFooter>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
              </div>

              <div className="relative">
                <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search course titles or categories..." value={courseSearch} onChange={(e) => setCourseSearch(e.target.value)} className="pl-10 w-full max-w-md" />
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCourses.map((c) => (
                  <div key={c.slug} className="glass-card lift-card border border-border bg-card rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      {c.image && (
                        <div className="mb-4 aspect-[16/10] w-full overflow-hidden rounded-xl bg-secondary/30">
                          <img src={c.image} alt={c.title} className="h-full w-full object-cover" />
                        </div>
                      )}
                      <div className="flex justify-between items-start">
                        <Badge className="bg-primary/10 text-primary border border-primary/20">{c.category}</Badge>
                        <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">★ {c.rating}</Badge>
                      </div>
                      <h3 className="font-extrabold text-sm text-foreground mt-4 line-clamp-1">{c.title}</h3>
                      <p className="text-[10px] text-muted-foreground mt-1">{c.lessons} lessons total</p>
                      <div className="flex items-baseline gap-2 mt-4">
                        <span className="text-sm font-bold text-foreground">₹{c.price.toLocaleString("en-IN")}</span>
                        <span className="text-[10px] text-muted-foreground line-through">₹{c.originalPrice.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                    <div className="border-t border-border pt-4 mt-5 flex justify-between items-center">
                      <span className="text-[10px] text-muted-foreground font-mono">{c.slug.substring(0, 20)}...</span>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditCourse(c)} className="h-8 hover:bg-primary/10 hover:text-primary">
                          <EditIcon className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteCourse(c.id)} className="h-8 hover:bg-destructive/10 hover:text-destructive">
                          <TrashIcon className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredCourses.length === 0 && (
                  <div className="col-span-full text-center py-12 text-muted-foreground text-xs font-medium">No courses match your filter settings.</div>
                )}
              </div>
            </div>
          )}

          {/* ── TAB: INTERNSHIPS ───────────────────────────────────── */}
          {activeTab === "internships" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-foreground">Internship Positions</h2>
                  <p className="text-sm text-muted-foreground mt-1">Review active, pending, or rejected internship listings.</p>
                </div>
                <Dialog open={isAddInternshipOpen} onOpenChange={setIsAddInternshipOpen}>
                  <DialogTrigger asChild>
                    <Button className="h-10 bg-primary text-primary-foreground btn-shine">
                      <PlusIcon className="h-4 w-4 mr-2" /> Post Internship
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border border-border text-foreground rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-lg font-bold">Post Internship Listing</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddInternship} className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="int-role" className="text-xs">Role Title</Label>
                          <Input id="int-role" value={newInternship.role} onChange={(e) => setNewInternship({ ...newInternship, role: e.target.value })} placeholder="SDE Intern" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="int-comp" className="text-xs">Company</Label>
                          <Input id="int-comp" value={newInternship.company} onChange={(e) => setNewInternship({ ...newInternship, company: e.target.value })} placeholder="Razorpay" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="int-logo" className="text-xs">Company Logo URL</Label>
                        <Input id="int-logo" value={newInternship.logo} onChange={(e) => setNewInternship({ ...newInternship, logo: e.target.value })} placeholder="https://..." />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="int-loc" className="text-xs">Location</Label>
                          <Input id="int-loc" value={newInternship.location} onChange={(e) => setNewInternship({ ...newInternship, location: e.target.value })} placeholder="Bengaluru" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="int-stipend" className="text-xs">Stipend (Monthly)</Label>
                          <Input id="int-stipend" value={newInternship.stipend} onChange={(e) => setNewInternship({ ...newInternship, stipend: e.target.value })} placeholder="₹35,000/mo" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="int-openings" className="text-xs">Number of Openings</Label>
                        <Input id="int-openings" type="number" value={newInternship.openings} onChange={(e) => setNewInternship({ ...newInternship, openings: e.target.value })} placeholder="3" />
                      </div>
                      <DialogFooter className="pt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsAddInternshipOpen(false)}>Cancel</Button>
                        <Button type="submit" className="bg-primary text-primary-foreground">Submit for Review</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog open={isEditInternshipOpen} onOpenChange={setIsEditInternshipOpen}>
                  <DialogContent className="bg-card border border-border text-foreground rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-lg font-bold">Edit Internship Listing</DialogTitle>
                    </DialogHeader>
                    {editingInternship && (
                      <form onSubmit={handleEditInternshipSubmit} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="edit-int-role" className="text-xs">Role Title</Label>
                            <Input id="edit-int-role" value={editingInternship.role} onChange={(e) => setEditingInternship({ ...editingInternship, role: e.target.value })} />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="edit-int-comp" className="text-xs">Company</Label>
                            <Input id="edit-int-comp" value={editingInternship.company} onChange={(e) => setEditingInternship({ ...editingInternship, company: e.target.value })} />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="edit-int-logo" className="text-xs">Company Logo URL</Label>
                          <Input id="edit-int-logo" value={editingInternship.logo || ""} onChange={(e) => setEditingInternship({ ...editingInternship, logo: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="edit-int-loc" className="text-xs">Location</Label>
                            <Input id="edit-int-loc" value={editingInternship.location} onChange={(e) => setEditingInternship({ ...editingInternship, location: e.target.value })} />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="edit-int-stipend" className="text-xs">Stipend</Label>
                            <Input id="edit-int-stipend" value={editingInternship.stipend} onChange={(e) => setEditingInternship({ ...editingInternship, stipend: e.target.value })} />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="edit-int-openings" className="text-xs">Number of Openings</Label>
                          <Input id="edit-int-openings" type="number" value={editingInternship.openings} onChange={(e) => setEditingInternship({ ...editingInternship, openings: e.target.value })} />
                        </div>
                        <DialogFooter className="pt-4">
                          <Button type="button" variant="ghost" onClick={() => setIsEditInternshipOpen(false)}>Cancel</Button>
                          <Button type="submit" className="bg-primary text-primary-foreground">Save Changes</Button>
                        </DialogFooter>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
              </div>

              <div className="relative">
                <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search listings by role or company..." value={internshipSearch} onChange={(e) => setInternshipSearch(e.target.value)} className="pl-10 w-full max-w-md" />
              </div>

              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <Table>
                  <TableHeader className="bg-secondary/50">
                    <TableRow className="border-b border-border">
                      <TableHead className="text-muted-foreground text-xs font-semibold py-4">Position / Company</TableHead>
                      <TableHead className="text-muted-foreground text-xs font-semibold">Location</TableHead>
                      <TableHead className="text-muted-foreground text-xs font-semibold">Stipend</TableHead>
                      <TableHead className="text-muted-foreground text-xs font-semibold">Openings</TableHead>
                      <TableHead className="text-muted-foreground text-xs font-semibold">Status</TableHead>
                      <TableHead className="text-muted-foreground text-xs font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInternships.map((item) => (
                      <TableRow key={item.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                        <TableCell className="py-4">
                          <p className="text-sm font-semibold text-foreground">{item.role}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.company}</p>
                        </TableCell>
                        <TableCell className="text-xs text-foreground">{item.location}</TableCell>
                        <TableCell className="text-xs font-semibold text-emerald-600">{item.stipend}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{item.openings} positions</TableCell>
                        <TableCell>
                          <Badge className={
                            item.status === "Approved" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
                              item.status === "Pending" ? "bg-amber-50 text-amber-600 border border-amber-200" :
                                "bg-red-50 text-red-600 border border-red-200"
                          }>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            {item.status !== "Approved" && (
                              <Button size="sm" onClick={() => handleUpdateInternshipStatus(item.id, "Approved")} className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px]">Approve</Button>
                            )}
                            {item.status === "Pending" && (
                              <Button size="sm" variant="destructive" onClick={() => handleUpdateInternshipStatus(item.id, "Rejected")} className="h-8 text-[10px]">Reject</Button>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => openEditInternship(item)} className="h-8 hover:bg-primary/10 hover:text-primary">
                              <EditIcon className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteInternship(item.id)} className="h-8 hover:bg-destructive/10 hover:text-destructive">
                              <TrashIcon className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredInternships.length === 0 && (
                      <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">No internship records found.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* ── TAB: APPLICATIONS ──────────────────────────────────── */}
          {activeTab === "applications" && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <h2 className="text-2xl font-black text-foreground">Student Applications</h2>
                <p className="text-sm text-muted-foreground mt-1">Review student internship pipelines and progress.</p>
              </div>

              <div className="relative">
                <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search applicant name, company, or job role..." value={appSearch} onChange={(e) => setAppSearch(e.target.value)} className="pl-10 w-full max-w-md" />
              </div>

              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <Table>
                  <TableHeader className="bg-secondary/50">
                    <TableRow className="border-b border-border">
                      <TableHead className="text-muted-foreground text-xs font-semibold py-4">Applicant</TableHead>
                      <TableHead className="text-muted-foreground text-xs font-semibold">Internship Listing</TableHead>
                      <TableHead className="text-muted-foreground text-xs font-semibold">Applied On</TableHead>
                      <TableHead className="text-muted-foreground text-xs font-semibold">Pipeline Status</TableHead>
                      <TableHead className="text-muted-foreground text-xs font-semibold text-right">Update Pipeline</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApps.map((a) => (
                      <TableRow key={a.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                        <TableCell className="py-4">
                          <p className="text-sm font-semibold text-foreground">{a.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{a.email}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-xs font-semibold text-foreground">{a.role}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{a.company}</p>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{a.date}</TableCell>
                        <TableCell>
                          <Badge className={
                            a.status === "Selected" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
                              a.status === "Rejected" ? "bg-red-50 text-red-600 border border-red-200" :
                                a.status === "Interview" ? "bg-sky-50 text-sky-600 border border-sky-200" :
                                  a.status === "Shortlisted" ? "bg-violet-50 text-violet-600 border border-violet-200" :
                                    "bg-secondary text-muted-foreground border border-border"
                          }>
                            {a.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Select value={a.status} onValueChange={(val) => updateApplicationStatus(a.id, val as any)}>
                            <SelectTrigger className="w-36 h-8 ml-auto text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Applied">Applied</SelectItem>
                              <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                              <SelectItem value="Interview">Interview</SelectItem>
                              <SelectItem value="Selected">Selected</SelectItem>
                              <SelectItem value="Rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredApps.length === 0 && (
                      <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-xs">No student applications found.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* ── TAB: SUBSCRIBERS ───────────────────────────────────── */}
          {activeTab === "subscribers" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <h2 className="text-2xl font-black text-foreground">Newsletter Subscribers</h2>
                  <p className="text-sm text-muted-foreground mt-1">All users who subscribed via the homepage newsletter form.</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="h-10 text-xs"
                    onClick={handleExportSubscribers}
                    disabled={subscribers.length === 0}
                  >
                    <DownloadIcon className="h-4 w-4 mr-2" /> Export CSV
                  </Button>
                </div>
              </div>

              {/* Stats strip */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="glass-card border border-border bg-card rounded-2xl p-5">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                      <MailIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Total Subscribers</p>
                      <p className="text-2xl font-extrabold text-foreground tracking-tight">
                        {subscribersLoading ? "…" : subscribers.length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="glass-card border border-border bg-card rounded-2xl p-5">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                      <CheckCircleIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Active</p>
                      <p className="text-2xl font-extrabold text-foreground tracking-tight">
                        {subscribersLoading ? "…" : subscribers.filter(s => s.status === "active").length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="glass-card border border-border bg-card rounded-2xl p-5 col-span-2 sm:col-span-1">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                      <TrendingIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">This Month</p>
                      <p className="text-2xl font-extrabold text-foreground tracking-tight">
                        {subscribersLoading ? "…" : subscribers.filter(s => {
                          if (!s.subscribedAt) return false;
                          const d = new Date((s.subscribedAt as any).seconds * 1000);
                          const now = new Date();
                          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                        }).length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  placeholder="Search by email address..."
                  value={subscriberSearch}
                  onChange={(e) => setSubscriberSearch(e.target.value)}
                  className="w-full max-w-md pl-10 h-10 rounded-xl border border-border bg-background text-sm px-4 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {/* Table */}
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <Table>
                  <TableHeader className="bg-secondary/50">
                    <TableRow className="border-b border-border">
                      <TableHead className="text-muted-foreground text-xs font-semibold py-4">#</TableHead>
                      <TableHead className="text-muted-foreground text-xs font-semibold">Email Address</TableHead>
                      <TableHead className="text-muted-foreground text-xs font-semibold">Status</TableHead>
                      <TableHead className="text-muted-foreground text-xs font-semibold">Subscribed On</TableHead>
                      <TableHead className="text-muted-foreground text-xs font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscribersLoading && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-xs">
                          <div className="flex items-center justify-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            Loading subscribers from Firestore…
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                    {!subscribersLoading && filteredSubscribers.map((s, idx) => (
                      <TableRow key={s.email} className="border-b border-border hover:bg-secondary/30 transition-colors">
                        <TableCell className="py-4 text-xs text-muted-foreground font-mono">{idx + 1}</TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 grid place-items-center shrink-0">
                              <MailIcon className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <span className="text-sm font-medium text-foreground">{s.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            s.status === "active"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                              : "bg-secondary text-muted-foreground border border-border"
                          }>
                            {s.status === "active" ? "Active" : "Unsubscribed"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {s.subscribedAt
                            ? new Date((s.subscribedAt as any).seconds * 1000).toLocaleDateString("en-IN", {
                              day: "numeric", month: "short", year: "numeric",
                            })
                            : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSubscriber(s.email)}
                            className="h-8 hover:bg-destructive/10 hover:text-destructive"
                            title="Remove subscriber"
                          >
                            <TrashIcon className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!subscribersLoading && filteredSubscribers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12">
                          <MailIcon className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                          <p className="text-sm font-semibold text-muted-foreground">No subscribers yet</p>
                          <p className="text-xs text-muted-foreground mt-1">Subscribers will appear here once users sign up via the newsletter form.</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}



          {/* ── TAB: BLOGS ─────────────────────────────────────────── */}
          {activeTab === "blogs" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-foreground">Blog Management</h2>
                  <p className="text-sm text-muted-foreground mt-1">Create, edit, and publish career resources and articles.</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="h-10 border-primary/20 text-primary hover:bg-primary/10" onClick={async () => {
                    try {
                      const { seedBlogs } = await import('@/lib/firebase/blogs');
                      await seedBlogs();
                      toast.success("Demo blogs seeded successfully!");
                    } catch (e) {
                      toast.error("Failed to seed demo blogs.");
                    }
                  }}>
                    <BookOpenIcon className="h-4 w-4 mr-2" /> Seed Demo Blogs
                  </Button>
                  <Dialog open={isAddBlogOpen} onOpenChange={setIsAddBlogOpen}>
                    <DialogTrigger asChild>
                      <Button className="h-10 bg-primary text-primary-foreground btn-shine">
                        <PlusIcon className="h-4 w-4 mr-2" /> Publish Blog
                      </Button>
                    </DialogTrigger>
                  <DialogContent className="bg-card border border-border text-foreground rounded-2xl max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-lg font-bold">New Blog Post</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddBlog} className="space-y-6 py-4">
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="blog-title" className="text-xs">Title</Label>
                          <Input id="blog-title" value={newBlog.title} onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })} placeholder="Blog Title" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="blog-slug" className="text-xs">Slug (URL)</Label>
                          <Input id="blog-slug" value={newBlog.slug} onChange={(e) => setNewBlog({ ...newBlog, slug: e.target.value })} placeholder="blog-title-here" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="blog-desc" className="text-xs">Description (Excerpt)</Label>
                        <Input id="blog-desc" value={newBlog.description} onChange={(e) => setNewBlog({ ...newBlog, description: e.target.value })} placeholder="Short description..." />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="blog-content" className="text-xs">Content (Markdown)</Label>
                        <Textarea id="blog-content" value={newBlog.content} onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })} placeholder="Write your blog post in Markdown..." className="min-h-[250px] font-mono text-sm" />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="blog-category" className="text-xs">Category</Label>
                          <Input id="blog-category" value={newBlog.category} onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })} placeholder="Tech Trends" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="blog-readTime" className="text-xs">Read Time</Label>
                          <Input id="blog-readTime" value={newBlog.readTime} onChange={(e) => setNewBlog({ ...newBlog, readTime: e.target.value })} placeholder="5 min read" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="blog-date" className="text-xs">Date</Label>
                          <Input id="blog-date" value={newBlog.date} onChange={(e) => setNewBlog({ ...newBlog, date: e.target.value })} placeholder="e.g. Jun 18, 2026" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="blog-tags" className="text-xs">Tags (comma-separated)</Label>
                        <Input id="blog-tags" value={newBlog.tags} onChange={(e) => setNewBlog({ ...newBlog, tags: e.target.value })} placeholder="AI, Development, Career" />
                      </div>

                      <div className="space-y-3 pt-2 border-t border-border">
                        <h4 className="text-sm font-bold">Media & Author</h4>
                        <div className="space-y-1.5">
                          <Label htmlFor="blog-image" className="text-xs">Featured Image URL</Label>
                          <Input id="blog-image" value={newBlog.image} onChange={(e) => setNewBlog({ ...newBlog, image: e.target.value })} placeholder="https://..." />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="blog-authorName" className="text-xs">Author Name</Label>
                            <Input id="blog-authorName" value={newBlog.authorName} onChange={(e) => setNewBlog({ ...newBlog, authorName: e.target.value })} placeholder="BharatSkillz Editor" />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="blog-authorImage" className="text-xs">Author Image URL</Label>
                            <Input id="blog-authorImage" value={newBlog.authorImage} onChange={(e) => setNewBlog({ ...newBlog, authorImage: e.target.value })} placeholder="https://..." />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 pt-2 border-t border-border">
                        <h4 className="text-sm font-bold">SEO Settings</h4>
                        <div className="space-y-1.5">
                          <Label htmlFor="blog-metaTitle" className="text-xs">Meta Title</Label>
                          <Input id="blog-metaTitle" value={newBlog.metaTitle} onChange={(e) => setNewBlog({ ...newBlog, metaTitle: e.target.value })} placeholder="Leave blank to use main Title" />
                        </div>
                      </div>

                      <DialogFooter className="pt-4 border-t border-border">
                        <Button type="button" variant="ghost" onClick={() => setIsAddBlogOpen(false)}>Cancel</Button>
                        <Button type="submit" className="bg-primary text-primary-foreground">Publish</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog open={isEditBlogOpen} onOpenChange={setIsEditBlogOpen}>
                  <DialogContent className="bg-card border border-border text-foreground rounded-2xl max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-lg font-bold">Edit Blog</DialogTitle>
                    </DialogHeader>
                    {editingBlog && (
                      <form onSubmit={handleEditBlogSubmit} className="space-y-6 py-4">
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="edit-blog-title" className="text-xs">Title</Label>
                            <Input id="edit-blog-title" value={editingBlog.title} onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })} />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="edit-blog-slug" className="text-xs">Slug (URL)</Label>
                            <Input id="edit-blog-slug" value={editingBlog.slug} onChange={(e) => setEditingBlog({ ...editingBlog, slug: e.target.value })} />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="edit-blog-desc" className="text-xs">Description (Excerpt)</Label>
                          <Input id="edit-blog-desc" value={editingBlog.description} onChange={(e) => setEditingBlog({ ...editingBlog, description: e.target.value })} />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="edit-blog-content" className="text-xs">Content (Markdown)</Label>
                          <Textarea id="edit-blog-content" value={editingBlog.content} onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })} className="min-h-[250px] font-mono text-sm" />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="edit-blog-category" className="text-xs">Category</Label>
                            <Input id="edit-blog-category" value={editingBlog.category} onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })} />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="edit-blog-readTime" className="text-xs">Read Time</Label>
                            <Input id="edit-blog-readTime" value={editingBlog.readTime} onChange={(e) => setEditingBlog({ ...editingBlog, readTime: e.target.value })} />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="edit-blog-date" className="text-xs">Date</Label>
                            <Input id="edit-blog-date" value={editingBlog.date} onChange={(e) => setEditingBlog({ ...editingBlog, date: e.target.value })} />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="edit-blog-tags" className="text-xs">Tags (comma-separated)</Label>
                          <Input id="edit-blog-tags" value={editingBlog.tags} onChange={(e) => setEditingBlog({ ...editingBlog, tags: e.target.value })} />
                        </div>

                        <div className="space-y-3 pt-2 border-t border-border">
                          <h4 className="text-sm font-bold">Media & Author</h4>
                          <div className="space-y-1.5">
                            <Label htmlFor="edit-blog-image" className="text-xs">Featured Image URL</Label>
                            <Input id="edit-blog-image" value={editingBlog.image} onChange={(e) => setEditingBlog({ ...editingBlog, image: e.target.value })} />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <Label htmlFor="edit-blog-authorName" className="text-xs">Author Name</Label>
                              <Input id="edit-blog-authorName" value={editingBlog.authorName} onChange={(e) => setEditingBlog({ ...editingBlog, authorName: e.target.value })} />
                            </div>
                            <div className="space-y-1.5">
                              <Label htmlFor="edit-blog-authorImage" className="text-xs">Author Image URL</Label>
                              <Input id="edit-blog-authorImage" value={editingBlog.authorImage} onChange={(e) => setEditingBlog({ ...editingBlog, authorImage: e.target.value })} />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 pt-2 border-t border-border">
                          <h4 className="text-sm font-bold">SEO Settings</h4>
                          <div className="space-y-1.5">
                            <Label htmlFor="edit-blog-metaTitle" className="text-xs">Meta Title</Label>
                            <Input id="edit-blog-metaTitle" value={editingBlog.metaTitle} onChange={(e) => setEditingBlog({ ...editingBlog, metaTitle: e.target.value })} />
                          </div>
                        </div>

                        <DialogFooter className="pt-4 border-t border-border">
                          <Button type="button" variant="ghost" onClick={() => setIsEditBlogOpen(false)}>Cancel</Button>
                          <Button type="submit" className="bg-primary text-primary-foreground">Save Changes</Button>
                        </DialogFooter>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>
              <div className="relative">
                <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search blog titles or authors..." value={blogSearch} onChange={(e) => setBlogSearch(e.target.value)} className="pl-10 w-full max-w-md" />
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredBlogs.map((b) => (
                  <div key={b.id} className="glass-card lift-card border border-border bg-card rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Badge className={`border border-primary/20 bg-primary/10 text-primary`}>{b.category}</Badge>
                      </div>
                      <h3 className="font-extrabold text-sm text-foreground mt-4 line-clamp-2">{b.title}</h3>
                      <p className="text-[10px] text-muted-foreground mt-2 line-clamp-3">{b.description}</p>
                      <p className="text-xs font-semibold text-foreground mt-3">By {b.authorName}</p>
                    </div>
                    <div className="border-t border-border pt-4 mt-5 flex justify-between items-center">
                      <span className="text-[10px] text-muted-foreground">{b.date} • {b.readTime}</span>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditBlog(b)} className="h-8 hover:bg-primary/10 hover:text-primary">
                          <EditIcon className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteBlog(b.id)} className="h-8 hover:bg-destructive/10 hover:text-destructive">
                          <TrashIcon className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredBlogs.length === 0 && (
                  <div className="col-span-full text-center py-12 text-muted-foreground text-xs font-medium">No blogs match your filter.</div>
                )}
              </div>
            </div>
          )}

          {/* ── TAB: SETTINGS ────────────────────────────────────────── */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <h2 className="text-2xl font-black text-foreground">Account Settings</h2>
                <p className="text-sm text-muted-foreground mt-1">Manage your admin profile and security preferences.</p>
              </div>

              <div className="max-w-2xl">
                <div className="glass-card lift-card border border-border bg-card rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <ShieldIcon className="h-5 w-5 text-primary" /> Security Options
                  </h3>
                  
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const newPassword = (form.elements.namedItem('newPassword') as HTMLInputElement).value;
                    const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value;
                    
                    if (!newPassword || !confirmPassword) {
                      toast.error("Please fill in both fields.");
                      return;
                    }
                    if (newPassword !== confirmPassword) {
                      toast.error("Passwords do not match.");
                      return;
                    }
                    
                    try {
                      await updateUserPassword(newPassword);
                      toast.success("Password updated successfully.");
                      form.reset();
                    } catch (err: any) {
                      console.error(err);
                      if (err.message.includes("requires-recent-login")) {
                        toast.error("Security requirement: Please sign out and sign in again before changing your password.");
                      } else {
                        toast.error(err.message || "Failed to update password.");
                      }
                    }
                  }} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="newPassword" className="text-sm font-semibold">New Password</Label>
                      <Input id="newPassword" name="newPassword" type="password" placeholder="Enter new password" required minLength={6} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="confirmPassword" className="text-sm font-semibold">Confirm New Password</Label>
                      <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm new password" required minLength={6} />
                    </div>
                    <div className="pt-2">
                      <Button type="submit" className="bg-primary text-primary-foreground btn-shine w-full sm:w-auto">
                        Update Password
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                      Note: Changing your password may require you to have signed in recently. If you encounter an error, sign out and sign back in before trying again.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
