import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { getFirebaseFirestore } from "@/lib/firebase/config";

export interface Subscriber {
  email: string;
  subscribedAt: Timestamp | null;
  status: "active" | "unsubscribed";
}

/**
 * useSubscribers — subscribes to the Firestore "subscribers" collection in real-time.
 * Each document ID is the subscriber's email address.
 */
export function useSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let db: ReturnType<typeof getFirebaseFirestore>;
    try {
      db = getFirebaseFirestore();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "subscribers"),
      orderBy("subscribedAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: Subscriber[] = snapshot.docs.map((d) => ({
          email: d.id,
          subscribedAt: d.data().subscribedAt ?? null,
          status: d.data().status ?? "active",
        }));
        setSubscribers(data);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching subscribers:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { subscribers, loading, error };
}

/**
 * deleteSubscriber — removes a subscriber document from Firestore by email.
 */
export async function deleteSubscriber(email: string): Promise<void> {
  const db = getFirebaseFirestore();
  await deleteDoc(doc(db, "subscribers", email));
}
