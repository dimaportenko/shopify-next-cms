import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center text-center px-4">
      <div className="overflow-hidden rounded-lg w-44 h-44 mb-6">
        <Image
          src="/logo.png"
          alt="Shopify Next CMS"
          width={180}
          height={180}
          className=""
          priority
        />
      </div>
      <h1 className="text-4xl font-bold mb-4">Shopify Next CMS</h1>
      <p className="text-lg text-fd-muted-foreground mb-8">Documentation</p>
      <Link
        href="/docs"
        className="rounded-lg bg-fd-primary px-6 py-3 text-fd-primary-foreground font-medium"
      >
        Get Started
      </Link>
    </main>
  );
}
