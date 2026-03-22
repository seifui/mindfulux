export default function EnLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-full bg-cream">
      <div className="mx-auto w-full max-w-page px-6 md:px-10 lg:px-20">
        {children}
      </div>
    </div>
  );
}
