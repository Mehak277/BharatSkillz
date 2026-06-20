import { STATS } from "@/lib/data/site";
import ibm from "@/assets/logos/ibm.png";
import tcs from "@/assets/logos/tcs.png";
import unilever from "@/assets/logos/unilever.png";
import adobe from "@/assets/logos/adobe.png";
import cognizant from "@/assets/logos/cognizant.png";
import chevron from "@/assets/logos/chevron.png";
import google from "@/assets/logos/google.png";
import wipro from "@/assets/logos/wipro.png";
import unitedhealth from "@/assets/logos/unitedhealth.png";
import amazon from "@/assets/logos/amazon.png";
import flipkart from "@/assets/logos/flipkart.png";

import mastercard from "@/assets/logos/mastercard.png";
import twitter from "@/assets/logos/twitter.png";
import pepsi from "@/assets/logos/pepsi.png";

const LOGOS = [
  { name: "IBM", url: ibm },
  { name: "TCS", url: tcs },
  { name: "Unilever", url: unilever },
  { name: "Adobe", url: adobe },
  { name: "Cognizant", url: cognizant },
  { name: "Chevron", url: chevron },
  { name: "Google", url: google },
  { name: "Wipro", url: wipro },
  { name: "UnitedHealth Group", url: unitedhealth },
  { name: "Amazon", url: amazon },
  { name: "Flipkart", url: flipkart },
  
  { name: "Mastercard", url: mastercard },
  { name: "Twitter", url: twitter },
  { name: "Pepsi", url: pepsi },
];

export function TrustedBy() {
  const loop = [...LOGOS, ...LOGOS];
  return (
    <section className="border-y border-border bg-secondary/40 py-10 sm:py-12">
      <div className="container-page">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Our students work at India&apos;s top companies
        </p>

        <div className="mt-7 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex w-max animate-marquee items-center gap-12 py-2 sm:gap-16">
            {loop.map((c, i) => (
              <img
                key={`${c.name}-${i}`}
                src={c.url}
                alt={c.name}
                loading="lazy"
                className="h-11 w-auto shrink-0 object-contain transition-transform duration-300 hover:scale-110 sm:h-14"
              />
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="glass-card lift-card rounded-2xl p-4 text-center sm:p-5"
            >
              <p className="font-display text-2xl font-extrabold text-foreground sm:text-4xl">
                {s.value.toLocaleString("en-IN")}
                <span className="text-primary">{s.suffix}</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

