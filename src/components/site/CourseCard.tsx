import { Link } from "@tanstack/react-router";
import { Award, Clock, Star, Users } from "lucide-react";
import type { Course } from "@/lib/data/courses";
import { Button } from "@/components/ui/button";
import { EnrollDialog } from "./EnrollDialog";

export function CourseCard({ course }: { course: Course }) {
  return (
    <article className="group glass-card lift-card flex h-full flex-col overflow-hidden rounded-3xl">
      <Link
        to="/courses/$slug"
        params={{ slug: course.slug }}
        className="relative block aspect-[16/10] overflow-hidden bg-muted"
      >
        <img
          src={course.image}
          alt={course.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/0 opacity-70 transition-opacity duration-500 group-hover:opacity-95" />
        <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-background/95 px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-sm backdrop-blur transition-transform duration-300 group-hover:-translate-y-0.5">
          {course.category}
        </span>
        {course.certificate && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/95 px-2.5 py-1 text-[11px] font-semibold text-gold-foreground shadow-sm backdrop-blur transition-transform duration-300 group-hover:-translate-y-0.5">
            <Award className="h-3 w-3" /> Certificate
          </span>
        )}
        <span className="absolute bottom-3 left-3 right-3 translate-y-2 text-xs font-medium text-white/90 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          by {course.instructor.name} · {course.instructor.company}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {course.duration}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" /> {course.students.toLocaleString("en-IN")}
          </span>
          <span className="ml-auto inline-flex items-center gap-1 text-foreground">
            <Star className="h-3.5 w-3.5 fill-gold text-gold" /> {course.rating}
          </span>
        </div>

        <h3 className="mt-3 text-lg font-bold leading-tight">
          <Link
            to="/courses/$slug"
            params={{ slug: course.slug }}
            className="transition-colors hover:text-primary"
          >
            {course.title}
          </Link>
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
          {course.short}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-foreground">
            {course.level}
          </span>
          <p className="font-display">
            <span className="text-lg font-extrabold">
              ₹{course.price.toLocaleString("en-IN")}
            </span>
            <span className="ml-1.5 text-xs text-muted-foreground line-through">
              ₹{course.originalPrice.toLocaleString("en-IN")}
            </span>
          </p>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
          <Button asChild variant="outline" size="sm" className="h-10">
            <Link to="/courses/$slug" params={{ slug: course.slug }}>
              Details
            </Link>
          </Button>
          <EnrollDialog
            course={course}
            trigger={
              <Button size="sm" className="btn-shine h-10 transition-transform active:scale-95">
                Enroll Now
              </Button>

            }
          />
        </div>
      </div>
    </article>
  );
}
