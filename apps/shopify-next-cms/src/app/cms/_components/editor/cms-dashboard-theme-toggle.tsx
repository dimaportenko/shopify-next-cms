"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCmsTheme } from "@cms/_lib/cms-theme-provider";

export function CmsDashboardThemeToggle() {
  const { editorTheme, toggleEditorTheme } = useCmsTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleEditorTheme}
      aria-label={`Switch to ${editorTheme === "dark" ? "light" : "dark"} mode`}
    >
      {editorTheme === "dark" ? (
        <Moon className="size-4" />
      ) : (
        <Sun className="size-4" />
      )}
    </Button>
  );
}
