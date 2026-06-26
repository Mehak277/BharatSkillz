/**
 * Firestore service for Users collection.
 *
 * Collection: "users"
 * Documents are created on signup (see createUserProfile).
 * Sub-collections:
 *   users/{uid}/enrollments  - courses the user is enrolled in
 *   users/{uid}/applications - internship applications submitted
 */

import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  where,
  setDoc,
  getDoc,
  DocumentData,
  QuerySnapshot,
  FieldValue,
} from "firebase/firestore";
import { getFirebaseFirestore } from "./config";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  skills?: string[];
  education?: string;
  social?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
  role: "student" | "admin";
  status: "Active" | "Suspended";
  createdAt: FieldValue | unknown;
}

export interface CourseEnrollment {
  slug: string;
  title: string;
  instructor: string;
  thumbnail: string;
  progress: number; // 0-100
  nextLesson: string;
  totalLessons: number;
  completedLessons: number;
  completedLessonIndices?: number[];
  enrolledAt?: FieldValue | unknown;
}

export interface InternshipApplication {
  id: string;
  userId?: string;
  internshipId?: string;
  role: string;
  company: string;
  status: "Applied" | "Shortlisted" | "Interview" | "Selected" | "Rejected";
  appliedOn: string;
  location: string;
  stipend: string;
  appliedAt?: FieldValue | unknown;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function snapToUser(docSnap: DocumentData & { id: string }): UserProfile {
  const d = docSnap.data();
  return {
    uid: docSnap.id,
    name: d.name ?? d.displayName ?? "Unknown",
    email: d.email ?? "",
    phone: d.phone ?? "",
    bio: d.bio ?? "",
    skills: d.skills ?? [],
    education: d.education ?? "",
    social: d.social ?? {},
    role: d.role ?? "student",
    status: d.status ?? "Active",
    createdAt: d.createdAt,
  };
}

// ─── Real-time Hook (Admin) ───────────────────────────────────────────────────

/** useUsers — real-time listener on all user documents (admin only) */
export function useUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let db: ReturnType<typeof getFirebaseFirestore>;
    try {
      db = getFirebaseFirestore();
    } catch (err) {
      setError("Firebase not configured");
      setLoading(false);
      return;
    }

    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot) => {
        const docs = snapshot.docs.map((d) =>
          snapToUser(d as unknown as DocumentData & { id: string })
        );
        setUsers(docs);
        setLoading(false);
      },
      (err) => {
        console.error("Users snapshot error:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { users, loading, error };
}

// ─── User Profile Hooks ───────────────────────────────────────────────────────

/** useUserProfile — real-time listener on a single user's profile document */
export function useUserProfile(uid: string | undefined) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    let db: ReturnType<typeof getFirebaseFirestore>;
    try {
      db = getFirebaseFirestore();
    } catch (err) {
      setError("Firebase not configured");
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, "users", uid),
      (docSnap) => {
        if (docSnap.exists()) {
          setProfile(snapToUser(docSnap as unknown as DocumentData & { id: string }));
        } else {
          setProfile(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error("User profile snapshot error:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [uid]);

  return { profile, loading, error };
}

// ─── Enrollment Hooks ─────────────────────────────────────────────────────────

/** useUserEnrollments — real-time listener on users/{uid}/enrollments */
export function useUserEnrollments(uid: string | undefined) {
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setEnrollments([]);
      setLoading(false);
      return;
    }

    let db: ReturnType<typeof getFirebaseFirestore>;
    try {
      db = getFirebaseFirestore();
    } catch {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "users", uid, "enrollments"),
      orderBy("enrolledAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs: CourseEnrollment[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          slug: d.id,
          title: data.title ?? "",
          instructor: data.instructor ?? "",
          thumbnail: data.thumbnail ?? "📚",
          progress: data.progress ?? 0,
          nextLesson: data.nextLesson ?? "",
          totalLessons: data.totalLessons ?? 0,
          completedLessons: data.completedLessons ?? 0,
          completedLessonIndices: data.completedLessonIndices ?? [],
          enrolledAt: data.enrolledAt,
        };
      });
      setEnrollments(docs);
      setLoading(false);
    }, () => {
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid]);

  return { enrollments, loading };
}

// ─── Application Hooks ────────────────────────────────────────────────────────

/** useUserApplications — real-time listener on top-level applications collection */
export function useUserApplications(uid: string | undefined) {
  const [applications, setApplications] = useState<InternshipApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setApplications([]);
      setLoading(false);
      return;
    }

    let db: ReturnType<typeof getFirebaseFirestore>;
    try {
      db = getFirebaseFirestore();
    } catch {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "applications"),
      where("userId", "==", uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs: InternshipApplication[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          userId: data.userId,
          internshipId: data.internshipId,
          role: data.role ?? "",
          company: data.company ?? "",
          status: data.status ?? "Applied",
          appliedOn: data.appliedOn ?? "",
          location: data.location ?? "",
          stipend: data.stipend ?? "",
          appliedAt: data.appliedAt,
        };
      });
      // Client-side sorting to avoid requiring a composite index in Firestore
      docs.sort((a, b) => {
        const timeA = (a.appliedAt as any)?.toMillis ? (a.appliedAt as any).toMillis() : 0;
        const timeB = (b.appliedAt as any)?.toMillis ? (b.appliedAt as any).toMillis() : 0;
        return timeB - timeA;
      });
      setApplications(docs);
      setLoading(false);
    }, (err) => {
      console.error("Applications fetch error:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid]);

  return { applications, loading };
}

// ─── Write Helpers ────────────────────────────────────────────────────────────

/**
 * Creates a new user profile document in Firestore at users/{uid}
 */
export const createUserProfile = async (
  uid: string,
  name: string,
  email: string
): Promise<void> => {
  const db = getFirebaseFirestore();
  const userDocRef = doc(db, "users", uid);
  await setDoc(userDocRef, {
    uid,
    name,
    email,
    phone: "",
    bio: "",
    skills: [],
    education: "",
    social: { linkedin: "", github: "", twitter: "" },
    role: "student",
    status: "Active",
    createdAt: serverTimestamp(),
  });
};

/**
 * Retrieves a user profile document from Firestore at users/{uid}
 */
export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  const db = getFirebaseFirestore();
  const userDocRef = doc(db, "users", uid);
  const docSnap = await getDoc(userDocRef);
  if (docSnap.exists()) {
    return snapToUser(docSnap as unknown as DocumentData & { id: string });
  }
  return null;
};

/**
 * Update a user's profile fields (name, phone, bio, skills, education, social)
 */
export const updateUserProfile = async (
  uid: string,
  data: Partial<Pick<UserProfile, "name" | "phone" | "bio" | "skills" | "education" | "social">>
): Promise<void> => {
  const db = getFirebaseFirestore();
  await updateDoc(doc(db, "users", uid), { ...data });
};

/** Toggle user status: Active ↔ Suspended */
export async function toggleUserStatus(uid: string, currentStatus: string): Promise<void> {
  const db = getFirebaseFirestore();
  const nextStatus = currentStatus === "Active" ? "Suspended" : "Active";
  await updateDoc(doc(db, "users", uid), { status: nextStatus });
}

/** Toggle user role: student ↔ admin */
export async function toggleUserRole(uid: string, currentRole: string): Promise<void> {
  const db = getFirebaseFirestore();
  const nextRole = currentRole === "admin" ? "student" : "admin";
  await updateDoc(doc(db, "users", uid), { role: nextRole });
}

/** Delete a user document from Firestore (does NOT delete Firebase Auth account) */
export async function deleteUserProfile(uid: string): Promise<void> {
  const db = getFirebaseFirestore();
  await deleteDoc(doc(db, "users", uid));
}
