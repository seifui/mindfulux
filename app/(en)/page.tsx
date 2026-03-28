import { Navbar } from "@/components/layout/Navbar";
import { HorizontalScrollSection } from "@/components/features/HorizontalScrollSection";
import { PrincipleCard } from "@/components/features/PrincipleCard";
import { PromoCard } from "@/components/features/PromoCard";
import { CommunitySection } from "@/components/features/CommunitySection";
import { SearchBar } from "@/components/ui/SearchBar";

const PLACEHOLDER_DESC =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum...";

const featuredPrinciples = [
  { title: "Centre-Stage Effect", description: PLACEHOLDER_DESC },
  { title: "Chronoception", description: PLACEHOLDER_DESC },
  { title: "Chunking", description: PLACEHOLDER_DESC },
  { title: "Cognitive Tax", description: PLACEHOLDER_DESC },
] as const;

function PrincipleRow() {
  return (
    <>
      {featuredPrinciples.map((item) => (
        <PrincipleCard
          key={item.title}
          title={item.title}
          description={item.description}
        />
      ))}
    </>
  );
}

export default function HomePage() {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col pb-20">
        {/* 1. Hero + Search */}
        <section className="flex flex-col items-center gap-10 pt-16 text-center md:pt-20 lg:pt-28">
          {/* Figma: Secondary large — Clash Display Semibold 72px, lh 1, tracking -3px */}
          <h1 className="font-display font-semibold text-balance text-ink max-w-[min(100%,52rem)] text-[clamp(2rem,5.5vw+0.5rem,4.5rem)] leading-none tracking-[-3px] md:text-hero">
            <span className="block">
              Discover awesome Product principles and
            </span>
            <span className="mt-3 block md:mt-4">
              <span className="text-accent-brand">AI skills</span>{" "}
              <span className="text-ink">for design</span>
            </span>
          </h1>
          <div className="w-full max-w-2xl">
            <SearchBar />
          </div>
        </section>

        {/* 2. Promo cards — horizontal scroll on mobile, two columns on desktop */}
        <section className="mt-20">
          <div className="-mx-6 px-6 md:mx-0 md:px-0">
            <div className="flex flex-row flex-nowrap items-stretch gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none md:gap-6 md:overflow-visible">
              <div className="min-w-80 shrink-0 snap-start md:min-w-0 md:flex-1 h-full">
                <PromoCard
                  variant="book"
                  title="Book is out now!"
                  description="Learn MindfulUX principles in depth with practical examples and exercises."
                  ctaLabel="Buy now →"
                  ctaHref="/book"
                />
              </div>
              <div className="min-w-80 shrink-0 snap-start md:min-w-0 md:flex-1 h-full">
                <PromoCard
                  variant="community"
                  title="Join to the Community!"
                  description="Connect with designers and share experiments, feedback, and resources."
                  ctaLabel="Join now →"
                  ctaHref="/community"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 3. Featured skills */}
        <section className="mt-28">
          <HorizontalScrollSection title="Featured skills">
            <PrincipleRow />
          </HorizontalScrollSection>
        </section>

        {/* 4–6. Principle sections */}
        <section className="mt-20">
          <HorizontalScrollSection title="Section 1 title">
            <PrincipleRow />
          </HorizontalScrollSection>
        </section>
        <section className="mt-20">
          <HorizontalScrollSection title="Section 2 title">
            <PrincipleRow />
          </HorizontalScrollSection>
        </section>
        <section className="mt-20">
          <HorizontalScrollSection title="Section 3 title">
            <PrincipleRow />
          </HorizontalScrollSection>
        </section>

        <section className="mt-20">
          <CommunitySection />
        </section>
      </main>
    </div>
  );
}
