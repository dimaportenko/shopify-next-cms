"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCmsTheme } from "@cms/_lib/cms-theme-provider";

export function CmsEditorThemeToggle() {
  const { editorTheme, toggleEditorTheme } = useCmsTheme();

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button variant="ghost" size="icon" onClick={toggleEditorTheme} />
        }
      >
        {editorTheme === "dark" ? (
          <Moon className="size-4" />
        ) : (
          <Sun className="size-4" />
        )}
      </TooltipTrigger>
      <TooltipContent>
        Editor: {editorTheme === "dark" ? "Dark" : "Light"} mode
      </TooltipContent>
    </Tooltip>
  );
}

export function CmsPreviewThemeToggle() {
  const { previewTheme, togglePreviewTheme } = useCmsTheme();

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button variant="ghost" size="icon" onClick={togglePreviewTheme} />
        }
      >
        <span className="relative">
          {previewTheme === "dark" ? (
            <Moon className="size-4" />
          ) : (
            <Sun className="size-4" />
          )}
          <Monitor className="absolute -right-1 -bottom-1 size-2.5" />
        </span>
      </TooltipTrigger>
      <TooltipContent>
        Preview: {previewTheme === "dark" ? "Dark" : "Light"} mode
      </TooltipContent>
    </Tooltip>
  );
}
