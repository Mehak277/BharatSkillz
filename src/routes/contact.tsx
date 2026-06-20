import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SectionHeading } from "@/components/site/SectionHeading";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — BharatSkillz" },
      { name: "description", content: "Talk to our team about courses, internships and partnerships." },
      { property: "og:title", content: "Contact — BharatSkillz" },
      { property: "og:description", content: "We'd love to hear from you." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Contact"
          title="Let's talk"
          description="Have a question about courses, internships or partnerships? Drop us a note."
        />

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-[1fr_1.3fr]">
          <div className="rounded-3xl bg-mint p-6">
            <h3 className="text-lg font-bold">Reach us directly</h3>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex items-start gap-3"><Mail className="mt-0.5 h-4 w-4 text-primary" /> hello@bharatskillz.com</li>
              <li className="flex items-start gap-3"><Phone className="mt-0.5 h-4 w-4 text-primary" /> +91 80-4567-8900</li>
              <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 text-primary" /> 12th Floor, Prestige Tower, Bengaluru 560001</li>
            </ul>
            <p className="mt-6 rounded-2xl bg-background p-4 text-sm text-muted-foreground">
              We typically reply within one business day. For urgent placement queries, call us.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Message sent!", { description: "We'll get back to you within 1 business day." });
              (e.currentTarget as HTMLFormElement).reset();
            }}
            className="rounded-3xl border border-border bg-card p-6"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" required className="mt-1.5" placeholder="Your full name" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required className="mt-1.5" placeholder="you@email.com" />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" required className="mt-1.5" placeholder="How can we help?" />
            </div>
            <div className="mt-4">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" required rows={6} className="mt-1.5" placeholder="Tell us more..." />
            </div>
            <Button type="submit" className="mt-5 w-full">Send message</Button>
          </form>
        </div>
      </div>
    </section>
  );
}
