/**
 * Firestore service for Courses collection.
 * 
 * Collection: "courses"
 * Each document represents a course that can be created/edited from the
 * admin dashboard or directly in the Firebase console.
 * All public pages use the useCourses() hook for real-time updates via onSnapshot.
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

export interface CourseDoc {
  id: string;            // Firestore document ID
  slug: string;
  title: string;
  category: string;
  level: string;         // "Beginner" | "Intermediate" | "Advanced"
  duration: string;      // e.g. "6 months"
  lessons: number;
  rating: number;
  students: number;
  price: number;
  originalPrice: number;
  certificate: boolean;
  emoji: string;
  short: string;         // Short description for cards
  long: string;          // Long description for detail page
  outcomes: string[];    // Learning outcomes (array of strings)
  status: "active" | "draft"; // "active" = visible publicly
  createdAt?: unknown;
  updatedAt?: unknown;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function snapToDoc(docSnap: DocumentData & { id: string }): CourseDoc {
  const d = docSnap.data();
  return {
    id: docSnap.id,
    slug: d.slug ?? docSnap.id,
    title: d.title ?? "",
    category: d.category ?? "",
    level: d.level ?? "Beginner",
    duration: d.duration ?? "",
    lessons: d.lessons ?? 0,
    rating: d.rating ?? 5,
    students: d.students ?? 0,
    price: d.price ?? 0,
    originalPrice: d.originalPrice ?? 0,
    certificate: d.certificate ?? true,
    emoji: d.emoji ?? "📚",
    short: d.short ?? "",
    long: d.long ?? "",
    outcomes: Array.isArray(d.outcomes) ? d.outcomes : [],
    status: d.status ?? "active",
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  };
}

// ─── Real-time Hook ───────────────────────────────────────────────────────────

/**
 * useCourses — subscribes to the Firestore "courses" collection in real-time.
 * Any change made in the Firebase console or admin dashboard
 * updates the local state automatically without a page refresh.
 */
export function useCourses() {
  const [courses, setCourses] = useState<CourseDoc[]>([]);
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

    const q = query(collection(db, "courses"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot) => {
        const docs = snapshot.docs.map((d) =>
          snapToDoc(d as unknown as DocumentData & { id: string })
        );
        setCourses(docs);
        setLoading(false);
      },
      (err) => {
        console.error("Courses snapshot error:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { courses, loading, error };
}

// ─── Write Operations (Admin) ─────────────────────────────────────────────────

type CourseInput = Omit<CourseDoc, "id" | "createdAt" | "updatedAt">;

/** Add a new course to Firestore */
export async function addCourse(data: CourseInput): Promise<string> {
  const db = getFirebaseFirestore();
  const ref = await addDoc(collection(db, "courses"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

/** Update an existing course document */
export async function updateCourse(
  id: string,
  data: Partial<CourseInput>
): Promise<void> {
  const db = getFirebaseFirestore();
  await updateDoc(doc(db, "courses", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/** Delete a course document */
export async function deleteCourse(id: string): Promise<void> {
  const db = getFirebaseFirestore();
  await deleteDoc(doc(db, "courses", id));
}
