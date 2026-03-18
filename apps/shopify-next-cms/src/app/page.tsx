import Image from "next/image";
import { ArrowRight, BookOpen, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeCustomizer } from "@/components/theme-customizer";
import { ProductCategory } from "@/components/product-category";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <main className="mx-auto flex w-full max-w-3xl flex-col items-center justify-between gap-10 px-16 py-32 sm:items-start">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              className="dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={100}
              height={20}
              priority
            />
            <Separator orientation="vertical" className="h-6" />
            <Badge variant="secondary">Shopify CMS</Badge>
          </div>
          <div className="flex items-center gap-2">
            <ThemeCustomizer />
            <ThemeToggle />
          </div>
        </div>
      </main>

      <ProductCategory />
    </div>
  );
}
