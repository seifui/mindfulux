import { Navbar } from "@/components/layout/Navbar";
import { HorizontalScrollSection } from "@/components/features/HorizontalScrollSection";
import { LockedSection } from "@/components/features/LockedSection";
import { PrincipleCard } from "@/components/features/PrincipleCard";
import { PromoCard } from "@/components/features/PromoCard";
import { CommunitySection } from "@/components/features/CommunitySection";
import { SearchBar } from "@/components/ui/SearchBar";
import { getUserTier } from "@/lib/access";
import {
  getPrinciplesForHomeSection,
  getPublishedPrinciples,
  type PublishedPrinciple,
} from "@/lib/principles";

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
  const userTier = await getUserTier();
  const [featuredPrinciples, aPrinciples, bPrinciples, cPrinciples] =
    await Promise.all([
      getPublishedPrinciples(4),
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
          <h1 className="font-display font-semibold text-balance text-ink w-full max-w-[min(100%,52rem)] px-4 text-center whitespace-normal break-words text-4xl leading-none tracking-normal md:text-5xl md:tracking-[-3px] lg:text-7xl lg:tracking-[-3px]">
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

        {/* 2. Promo cards */}
        <section className="mt-20 w-full overflow-hidden px-4 md:px-6">
          <div className="flex w-full flex-col gap-4 md:flex-row md:gap-6">
            <div className="w-full md:flex-1">
              <PromoCard variant="book" />
            </div>
            <div className="w-full md:flex-1">
              <PromoCard variant="community" ctaHref="/#community" />
            </div>
          </div>
        </section>

        {/* 3. Featured skills */}
        {featuredPrinciples.length > 0 && (
          <section className="mt-28">
            <HorizontalScrollSection title="Featured skills">
              <PrinciplesFromDB principles={featuredPrinciples} />
            </HorizontalScrollSection>
          </section>
        )}

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

        <section className="mt-20 px-4 md:px-0">
          <LockedSection userTier={userTier} />
        </section>

        <section className="mt-20">
          <CommunitySection />
        </section>
      </main>
    </div>
  );
}
