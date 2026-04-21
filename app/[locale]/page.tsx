import { Navbar } from "@/components/layout/Navbar";
import { HorizontalScrollSection } from "@/components/features/HorizontalScrollSection";
import { PrincipleCard } from "@/components/features/PrincipleCard";
import { PromoCard } from "@/components/features/PromoCard";
import { CommunitySection } from "@/components/features/CommunitySection";
import { SearchBar } from "@/components/ui/SearchBar";
import { getPrinciplesForHomeSection } from "@/lib/principles";
import type { PublishedPrinciple } from "@/lib/principles";

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

function PrinciplesFromDB({ principles }: { principles: PublishedPrinciple[] }) {
  return (
    <>
      {principles.map((p, i) => (
        <PrincipleCard
          key={p.id}
          title={p.title}
          description={p.description ?? ""}
          slug={p.slug}
          imageUrl={p.illustration_url ?? undefined}
          position={i}
        />
      ))}
    </>
  );
}

export default async function HomePage() {
  const [aPrinciples, bPrinciples, cPrinciples] = await Promise.all([
    getPrinciplesForHomeSection("a"),
    getPrinciplesForHomeSection("b"),
    getPrinciplesForHomeSection("c"),
  ]);

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
              <div className="min-w-80 shrink-0 snap-start md:min-w-0 md:flex-1 flex flex-col">
                <PromoCard variant="book" />
              </div>
              <div className="min-w-80 shrink-0 snap-start md:min-w-0 md:flex-1 flex flex-col">
                <PromoCard variant="community" ctaHref="/#community" />
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
        {aPrinciples.length > 0 && (
          <section className="mt-20">
            <HorizontalScrollSection title="A Principles">
              <PrinciplesFromDB principles={aPrinciples} />
            </HorizontalScrollSection>
          </section>
        )}
        {bPrinciples.length > 0 && (
          <section className="mt-20">
            <HorizontalScrollSection title="B Principles">
              <PrinciplesFromDB principles={bPrinciples} />
            </HorizontalScrollSection>
          </section>
        )}
        {cPrinciples.length > 0 && (
          <section className="mt-20">
            <HorizontalScrollSection title="C Principles">
              <PrinciplesFromDB principles={cPrinciples} />
            </HorizontalScrollSection>
          </section>
        )}

        <section className="mt-20">
          <CommunitySection />
        </section>
      </main>
    </div>
  );
}
