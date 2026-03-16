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

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between gap-10 px-16 py-32 sm:items-start">
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
          <ThemeToggle />
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold leading-10 tracking-tight">
              To get started, edit the page.tsx file.
            </CardTitle>
            <CardDescription className="text-lg leading-8">
              Looking for a starting point or more instructions? Head over to
              the Templates or Learning center.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" render={<a href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer" />}>
              <Rocket />
              Deploy Now
              <ArrowRight />
            </Button>
            <Button variant="outline" size="lg" render={<a href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer" />}>
              <BookOpen />
              Documentation
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
