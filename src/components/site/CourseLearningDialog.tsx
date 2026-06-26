import { useState, useEffect, type ReactNode } from "react";
import { Check, BookOpen, ExternalLink, Lock } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { getFirebaseFirestore } from "@/lib/firebase/config";
import type { CourseEnrollment } from "@/lib/firebase/users";
import type { CourseDoc } from "@/lib/firebase/courses";

export function CourseLearningDialog({
  enrollment,
  courseData,
  trigger,
}: {
  enrollment: CourseEnrollment;
  courseData?: CourseDoc;
  trigger: ReactNode;
}) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);

  const completedIndices = enrollment.completedLessonIndices || [];

  useEffect(() => {
    async function fetchVideos() {
      if (!open || !courseData?.youtubePlaylistUrl) return;
      
      let listId = null;
      if (courseData.youtubePlaylistUrl.includes("list=")) {
        const match = courseData.youtubePlaylistUrl.match(/[?&]list=([a-zA-Z0-9_-]+)/);
        listId = match ? match[1] : null;
      } else {
        listId = courseData.youtubePlaylistUrl.trim();
      }
      if (!listId) return;

      const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
      if (!apiKey) {
        console.warn("YouTube API key not found in environment.");
        return;
      }

      setLoadingVideos(true);
      try {
        const res = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${listId}&key=${apiKey}`);
        if (!res.ok) throw new Error("Failed to fetch playlist");
        const data = await res.json();
        const items = data.items || [];
        setVideos(items);

        // Auto-correct totalLessons in Firebase if it mismatches
        if (items.length > 0 && enrollment.totalLessons !== items.length && user) {
          const db = getFirebaseFirestore();
          const docRef = doc(db, "users", user.uid, "enrollments", enrollment.slug);
          await updateDoc(docRef, { totalLessons: items.length }).catch(console.error);
        }
      } catch (err) {
        console.error("Error fetching YouTube playlist:", err);
      } finally {
        setLoadingVideos(false);
      }
    }
    fetchVideos();
  }, [open, courseData?.youtubePlaylistUrl]);

  const handleToggleLesson = async (index: number) => {
    if (!user) return;
    setUpdating(true);
    
    try {
      const isCompleted = completedIndices.includes(index);
      let newIndices: number[];
      
      if (isCompleted) {
        newIndices = completedIndices.filter((i) => i !== index);
      } else {
        newIndices = [...completedIndices, index];
      }
      
      const total = videos.length > 0 ? videos.length : enrollment.totalLessons;
      const newCompleted = newIndices.length;
      const newProgress = Math.round((newCompleted / total) * 100);
      
      // Determine next lesson
      let nextLessonIndex = 0;
      while (newIndices.includes(nextLessonIndex) && nextLessonIndex < total) {
        nextLessonIndex++;
      }
      
      let nextLessonText = "Completed";
      if (nextLessonIndex < total) {
        if (videos.length > 0 && videos[nextLessonIndex]) {
           nextLessonText = videos[nextLessonIndex].snippet.title;
        } else {
           nextLessonText = `Lesson ${nextLessonIndex + 1}`;
           if (nextLessonIndex === 0) nextLessonText += ": Introduction";
        }
      }

      const db = getFirebaseFirestore();
      const docRef = doc(db, "users", user.uid, "enrollments", enrollment.slug);
      
      await updateDoc(docRef, {
        completedLessonIndices: newIndices,
        completedLessons: newCompleted,
        totalLessons: total,
        progress: newProgress,
        nextLesson: nextLessonText
      });

    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error("Failed to update progress");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="px-1 py-2">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            {courseData?.title || enrollment.title}
          </DialogTitle>
          <div className="mt-2">
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="font-medium text-muted-foreground">Course Progress</span>
              <span className="font-bold">{enrollment.progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500"
                style={{ width: `${enrollment.progress}%` }}
              />
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto pr-2 mt-4 space-y-2 pb-4">
          {loadingVideos ? (
             <div className="py-8 text-center text-sm text-muted-foreground animate-pulse">Loading lessons...</div>
          ) : (videos.length > 0 ? videos : Array.from({ length: enrollment.totalLessons })).map((video: any, i: number) => {
            const isDone = completedIndices.includes(i);
            const isAvailable = i === 0 || completedIndices.includes(i - 1);
            
            let title = "";
            let videoUrl = "";
            if (videos.length > 0) {
              title = video.snippet.title;
              videoUrl = `https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`;
            } else {
              title = `Lesson ${i + 1}`;
              if (i === 0) title += ": Introduction";
              if (i === enrollment.totalLessons - 1) title += ": Final Project";
            }
            
            return (
              <div 
                key={i}
                className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${!isAvailable ? 'bg-secondary/20 border-border/50 opacity-60' : isDone ? 'bg-primary/5 border-primary/20' : 'bg-card border-border hover:border-primary/40'}`}
              >
                <div className="flex items-center gap-3 w-full">
                  <button
                    disabled={updating || !isAvailable}
                    onClick={() => handleToggleLesson(i)}
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${!isAvailable ? 'border-border bg-secondary/50 cursor-not-allowed' : isDone ? 'bg-primary border-primary text-primary-foreground' : 'border-input hover:border-primary'}`}
                  >
                    {isDone && <Check className="h-3.5 w-3.5" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    {isAvailable && videoUrl ? (
                       <a href={videoUrl} target="_blank" rel="noopener noreferrer" className={`font-medium text-sm flex items-center gap-1.5 hover:text-primary hover:underline ${isDone ? 'text-foreground/70' : 'text-foreground'}`}>
                         <span className="truncate">{title}</span>
                         <ExternalLink className="h-3 w-3 shrink-0" />
                       </a>
                    ) : (
                       <span className={`font-medium text-sm flex items-center gap-1.5 ${isDone ? 'text-foreground/70' : 'text-foreground'}`}>
                         <span className="truncate">{title}</span>
                         {!isAvailable && <Lock className="h-3 w-3 shrink-0 text-muted-foreground" />}
                       </span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 ml-4">
                  {videos.length > 0 ? "Video" : `${Math.floor(Math.random() * 10 + 5)} mins`}
                </span>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
