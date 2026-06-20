import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { useCourses, addCourse as dbAddCourse, deleteCourse as dbDeleteCourse } from "@/lib/firebase/courses";
import { useInternships, addInternship as dbAddInternship, deleteInternship as dbDeleteInternship, updateInternship as dbUpdateInternship } from "@/lib/firebase/internships";
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
  CheckCircle as CheckCircleIcon,
  LayoutDashboard as DashboardIcon,
  Settings as SettingsIcon,
  FileText as FileTextIcon,
  UserCheck as UserCheckIcon,
  UserX as UserXIcon,
  TrendingUp as TrendingIcon,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  name: string;
  email: string;
  role: string;
  company: string;
  status: "Applied" | "Shortlisted" | "Interview" | "Selected" | "Rejected";
  date: string;
}

// No mock user/course/internship data — all sourced live from Firestore.
// Applications still use localStorage until they get a Firestore sub-collection.
const INITIAL_APPLICATIONS: ApplicationRecord[] = [];

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

  useEffect(() => {
    if (!loading && !user) {
      navigate({
        to: "/auth/login",
        search: { email: undefined },
      });
    }
  }, [user, loading, navigate]);

  const [activeTab, setActiveTab] = useState<"overview" | "users" | "courses" | "internships" | "applications" | "settings">("overview");

  // Firestore data hooks
  const { courses = [], loading: coursesLoading } = useCourses();
  const { internships = [], loading: internshipsLoading } = useInternships();
  const { users: dbUsers = [], loading: usersLoading } = useUsers();

  const users: UserRecord[] = dbUsers.map(u => ({
    id: u.uid,
    name: u.name,
    email: u.email,
    role: u.role === "admin" ? "Admin" : "Student",
    status: u.status,
    joined: u.createdAt ? new Date(((u.createdAt as any)?.seconds || 0) * 1000).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Recently",
  }));

  const [applications, setApplications] = useState<ApplicationRecord[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("admin_applications");
      if (saved) return JSON.parse(saved);
    }
    return INITIAL_APPLICATIONS;
  });

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

  // Modal Inputs
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Student" as "Student" | "Admin" });
  const [newCourse, setNewCourse] = useState({ title: "", category: "", price: "", originalPrice: "", lessons: "", rating: "4.5" });
  const [newInternship, setNewInternship] = useState({ role: "", company: "", location: "", stipend: "", openings: "" });

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [isAddInternshipOpen, setIsAddInternshipOpen] = useState(false);

  // Sync remaining mock state to LocalStorage
  useEffect(() => { localStorage.setItem("admin_applications", JSON.stringify(applications)); }, [applications]);
  useEffect(() => { localStorage.setItem("admin_settings", JSON.stringify(settings)); }, [settings]);

  // Handlers
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) { toast.error("Please fill in all fields."); return; }
    try {
      const tempUid = "usr_" + Date.now();
      await createUserProfile(tempUid, newUser.name, newUser.email);
      if (newUser.role === "Admin") {
        await dbToggleUserRole(tempUid, "student");
      }
      setNewUser({ name: "", email: "", role: "Student" });
      setIsAddUserOpen(false);
      toast.success(`User ${newUser.name} created successfully.`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to register user in Firestore.");
    }
  };

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
      });
      setNewCourse({ title: "", category: "", price: "", originalPrice: "", lessons: "", rating: "4.5" });
      setIsAddCourseOpen(false);
      toast.success(`Course ${newCourse.title} added successfully.`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to publish course to Firestore.");
    }
  };

  const handleAddInternship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInternship.role || !newInternship.company) { toast.error("Please fill in required fields."); return; }
    try {
      await dbAddInternship({
        role: newInternship.role,
        company: newInternship.company,
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
      setNewInternship({ role: "", company: "", location: "", stipend: "", openings: "" });
      setIsAddInternshipOpen(false);
      toast.success("Internship posted for approval.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to post internship to Firestore.");
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    try {
      await dbToggleUserStatus(userId, currentStatus);
      toast.info(`User status updated.`);
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  const handleChangeUserRole = async (userId: string, currentRole: string) => {
    try {
      await dbToggleUserRole(userId, currentRole);
      toast.info(`Role updated.`);
    } catch (err) {
      toast.error("Failed to change user role.");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await dbDeleteUserProfile(userId);
      toast.error("User deleted");
    } catch (err) {
      toast.error("Failed to delete user profile.");
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

  const updateApplicationStatus = (id: string, status: ApplicationRecord["status"]) => {
    setApplications(applications.map(a => {
      if (a.id === id) { toast.info(`Application for ${a.name} marked as ${status}`); return { ...a, status }; }
      return a;
    }));
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

  if (!user) return null;

  const NAV_ITEMS = [
    { id: "overview", label: "Overview", icon: DashboardIcon },
    { id: "users", label: "Manage Users", icon: UsersIcon },
    { id: "courses", label: "Manage Courses", icon: BookOpenIcon },
    { id: "internships", label: "Manage Internships", icon: BriefcaseIcon },
    { id: "applications", label: "Applications", icon: FileTextIcon },
    { id: "settings", label: "System Settings", icon: SettingsIcon },
  ] as const;

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
        <aside className="hidden md:flex w-60 border-r border-border flex-col justify-between bg-card sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto p-4">
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
                    className={`w-full group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-200 ${
                      active
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
              <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 grid place-items-center text-xs font-black text-primary">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground truncate">{user.displayName || "Administrator"}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-full">

          {/* Mobile tab scroll */}
          <div className="flex md:hidden gap-1.5 overflow-x-auto pb-4 mb-4 border-b border-border">
            {NAV_ITEMS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`shrink-0 text-xs font-semibold px-4 py-2 rounded-lg border transition-all ${
                  activeTab === tab.id
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
                            <stop offset="5%" stopColor="oklch(0.62 0.17 148)" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="oklch(0.62 0.17 148)" stopOpacity={0}/>
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
                <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                  <DialogTrigger asChild>
                    <Button className="h-10 bg-primary text-primary-foreground btn-shine">
                      <PlusIcon className="h-4 w-4 mr-2" /> Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border border-border text-foreground rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-lg font-bold">Register New Account</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddUser} className="space-y-4 py-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="usr-name" className="text-xs">Full Name</Label>
                        <Input id="usr-name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} placeholder="e.g. Priya Sharma" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="usr-email" className="text-xs">Email Address</Label>
                        <Input id="usr-email" type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} placeholder="priya@gmail.com" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="usr-role" className="text-xs">System Role</Label>
                        <Select value={newUser.role} onValueChange={(val) => setNewUser({ ...newUser, role: val as any })}>
                          <SelectTrigger><SelectValue placeholder="Select Role" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Student">Student</SelectItem>
                            <SelectItem value="Admin">Administrator</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <DialogFooter className="pt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
                        <Button type="submit" className="bg-primary text-primary-foreground">Register User</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
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
                            <Button variant="outline" size="sm" onClick={() => handleChangeUserRole(u.id, u.role === "Admin" ? "admin" : "student")} className="h-8 text-xs">Toggle Role</Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(u.id)} className="h-8 hover:bg-destructive/10 hover:text-destructive">
                              <TrashIcon className="h-3.5 w-3.5" />
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
              </div>

              <div className="relative">
                <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search course titles or categories..." value={courseSearch} onChange={(e) => setCourseSearch(e.target.value)} className="pl-10 w-full max-w-md" />
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCourses.map((c) => (
                  <div key={c.slug} className="glass-card lift-card border border-border bg-card rounded-2xl p-5 flex flex-col justify-between">
                    <div>
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
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteCourse(c.id)} className="h-8 hover:bg-destructive/10 hover:text-destructive">
                        <TrashIcon className="h-3.5 w-3.5" />
                      </Button>
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

          {/* ── TAB: SETTINGS ──────────────────────────────────────── */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-fade-in-up max-w-2xl">
              <div>
                <h2 className="text-2xl font-black text-foreground">System Configuration</h2>
                <p className="text-sm text-muted-foreground mt-1">Configure site branding, commission percentages, and platform access.</p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-5 glass-card border border-border bg-card rounded-2xl p-6">
                <div className="space-y-1.5">
                  <Label htmlFor="set-name" className="text-xs">Site Title / Logo Text</Label>
                  <Input id="set-name" value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="set-email" className="text-xs">System Notification Email</Label>
                  <Input id="set-email" type="email" value={settings.systemEmail} onChange={(e) => setSettings({ ...settings, systemEmail: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="set-fee" className="text-xs">Platform Commission Fee (%)</Label>
                    <Input id="set-fee" type="number" value={settings.platformFee} onChange={(e) => setSettings({ ...settings, platformFee: Number(e.target.value) || 0 })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="set-phone" className="text-xs">Contact / Helpline Phone</Label>
                    <Input id="set-phone" value={settings.supportPhone} disabled className="opacity-60" />
                  </div>
                </div>
                <div className="border-t border-border pt-5 flex justify-between items-center">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold block">Platform Maintenance Mode</Label>
                    <span className="text-[10px] text-muted-foreground">Temporarily restrict public access while running upgrades.</span>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => {
                      setSettings({ ...settings, maintenanceMode: checked });
                      checked ? toast.warning("Platform is now in maintenance mode.") : toast.success("Platform is now public.");
                    }}
                  />
                </div>
                <div className="pt-4 border-t border-border flex justify-end">
                  <Button type="submit" className="bg-primary text-primary-foreground btn-shine">Save Configuration</Button>
                </div>
              </form>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
