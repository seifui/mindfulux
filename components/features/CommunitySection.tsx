import { NewsletterForm } from "@/components/features/NewsletterForm";

export function CommunitySection() {
  return (
    <section className="w-full py-16 md:py-20">
      <div className="mx-auto flex max-w-page flex-col items-center gap-10 px-6">
        <h2 className="font-display font-semibold text-3xl text-ink text-center leading-tight">
          Join the Mindful UX Growth
          <br />
          community with 10k+ members
        </h2>
        <NewsletterForm />
      </div>
    </section>
  );
}
