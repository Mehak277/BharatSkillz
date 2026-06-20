/**
 * Firestore service for Internships collection.
 *
 * Collection: "internships"
 * Each document is an internship listing. The admin can create / edit / approve
 * listings from the dashboard, and changes are visible to public in real-time.
 * Public pages show only status === "Approved" listings.
 */

import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore";
import { getFirebaseFirestore } from "./config";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InternshipDoc {
  id: string;           // Firestore document ID
  role: string;
  company: string;
  logoColor: string;    // Hex color for fallback avatar
  location: string;
  mode: string;         // "Remote" | "Hybrid" | "On-site"
  duration: string;     // e.g. "6 months"
  stipend: string;      // e.g. "₹35,000/mo"
  skills: string[];
  openings: number;
  postedDays: number;
  status: "Approved" | "Pending" | "Rejected";
  createdAt?: unknown;
  updatedAt?: unknown;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function snapToDoc(docSnap: DocumentData & { id: string }): InternshipDoc {
  const d = docSnap.data();
  return {
    id: docSnap.id,
    role: d.role ?? "",
    company: d.company ?? "",
    logoColor: d.logoColor ?? "#6366f1",
    location: d.location ?? "Remote",
    mode: d.mode ?? "Remote",
    duration: d.duration ?? "3 months",
    stipend: d.stipend ?? "TBD",
    skills: Array.isArray(d.skills) ? d.skills : [],
    openings: d.openings ?? 1,
    postedDays: d.postedDays ?? 0,
    status: d.status ?? "Pending",
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  };
}

// ─── Real-time Hook ───────────────────────────────────────────────────────────

/**
 * useInternships — subscribes to the Firestore "internships" collection in real-time.
 * Returns ALL internships (admin use) or filter by status on the consuming side.
 */
export function useInternships() {
  const [internships, setInternships] = useState<InternshipDoc[]>([]);
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

    const q = query(
      collection(db, "internships"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot) => {
        const docs = snapshot.docs.map((d) =>
          snapToDoc(d as unknown as DocumentData & { id: string })
        );
        setInternships(docs);
        setLoading(false);
      },
      (err) => {
        console.error("Internships snapshot error:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { internships, loading, error };
}

// ─── Write Operations (Admin) ─────────────────────────────────────────────────

type InternshipInput = Omit<InternshipDoc, "id" | "createdAt" | "updatedAt">;

/** Add a new internship listing */
export async function addInternship(data: InternshipInput): Promise<string> {
  const db = getFirebaseFirestore();
  const ref = await addDoc(collection(db, "internships"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

/** Update an internship (status, fields, etc.) */
export async function updateInternship(
  id: string,
  data: Partial<InternshipInput>
): Promise<void> {
  const db = getFirebaseFirestore();
  await updateDoc(doc(db, "internships", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/** Delete an internship listing */
export async function deleteInternship(id: string): Promise<void> {
  const db = getFirebaseFirestore();
  await deleteDoc(doc(db, "internships", id));
}
