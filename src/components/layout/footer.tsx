export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background py-6">
      <div className="container flex flex-col md:flex-row items-center justify-center gap-4">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {currentYear} Questioneer. All rights reserved.
        </p>
      </div>
    </footer>
  );
}