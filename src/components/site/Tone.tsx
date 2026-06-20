import { cn } from "@/lib/utils";

type Tone = "mint" | "peach" | "lavender" | "gold";

const tones: Record<Tone, string> = {
  mint: "bg-mint text-foreground",
  peach: "bg-peach text-foreground",
  lavender: "bg-lavender text-foreground",
  gold: "bg-gold/15 text-foreground",
};

export function ToneBlock({
  tone,
  className,
  children,
}: { tone: Tone; className?: string; children: React.ReactNode }) {
  return <div className={cn(tones[tone], className)}>{children}</div>;
}

export const toneBg: Record<Tone, string> = tones;
