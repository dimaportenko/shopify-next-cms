import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ThemeCustomizer } from "@/components/theme/theme-customizer";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function Header() {
  return (
    <header className="border-b border-border/60 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <Image
              className="dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={100}
              height={20}
              priority
            />
          </Link>
          <Separator orientation="vertical" className="h-6" />
          <Link href="/cms">
            <Badge variant="secondary">Shopify CMS</Badge>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <ThemeCustomizer />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
