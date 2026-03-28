import { NewsletterForm } from "@/components/features/NewsletterForm";

export function CommunitySection() {
  return (
    <section className="w-full py-16 md:py-20">
      <div className="mx-auto flex max-w-page flex-col items-center gap-[35px] px-6">
        <h2 className="font-display font-semibold text-[36px] text-ink text-center leading-none">
          Join the Mindful UX Growth community with 10k+ members
        </h2>
        <NewsletterForm />
      </div>
    </section>
  );
}
