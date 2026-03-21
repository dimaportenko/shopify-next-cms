"use client";

import { usePuck } from "@puckeditor/core";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Undo2,
  Redo2,
  PanelLeft,
  PanelRight,
  Eye,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type ReactNode, useCallback } from "react";

interface EditorHeaderProps {
  actions: ReactNode;
  pageTitle?: string;
}

export function EditorHeader({ actions, pageTitle }: EditorHeaderProps) {
  const { appState, dispatch, history } = usePuck();
  const router = useRouter();

  const { leftSideBarVisible, rightSideBarVisible, previewMode } = appState.ui;

  const toggleUi = useCallback(
    (ui: Record<string, unknown>) => {
      dispatch({ type: "setUi", ui });
    },
    [dispatch],
  );

  return (
    <TooltipProvider delay={300}>
      <header className="flex h-12 items-center justify-between border-b border-border bg-background px-3">
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button variant="ghost" onClick={() => router.push("/cms")} />
              }
            >
              <ArrowLeft className="size-4" />
            </TooltipTrigger>
            <TooltipContent>Back to dashboard</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-1 h-5" />

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  disabled={!history.hasPast}
                  onClick={() => history.back()}
                />
              }
            >
              <Undo2 className="size-4" />
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  disabled={!history.hasFuture}
                  onClick={() => history.forward()}
                />
              }
            >
              <Redo2 className="size-4" />
            </TooltipTrigger>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>
        </div>

        <span className="max-w-[200px] truncate text-sm font-medium text-foreground">
          {pageTitle ?? "Untitled"}
        </span>

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger
              render={
                <Toggle
                  pressed={previewMode === "interactive"}
                  onPressedChange={() =>
                    toggleUi({
                      previewMode:
                        previewMode === "edit" ? "interactive" : "edit",
                    })
                  }
                />
              }
            >
              {previewMode === "interactive" ? (
                <Eye className="size-4" />
              ) : (
                <Pencil className="size-4" />
              )}
            </TooltipTrigger>
            <TooltipContent>
              {previewMode === "interactive" ? "Preview mode" : "Edit mode"}
            </TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-1 h-5" />

          <Tooltip>
            <TooltipTrigger
              render={
                <Toggle
                  pressed={leftSideBarVisible}
                  onPressedChange={() =>
                    toggleUi({
                      leftSideBarVisible: !leftSideBarVisible,
                    })
                  }
                />
              }
            >
              <PanelLeft className="size-4" />
            </TooltipTrigger>
            <TooltipContent>Toggle components panel</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <Toggle
                  pressed={rightSideBarVisible}
                  onPressedChange={() =>
                    toggleUi({
                      rightSideBarVisible: !rightSideBarVisible,
                    })
                  }
                />
              }
            >
              <PanelRight className="size-4" />
            </TooltipTrigger>
            <TooltipContent>Toggle properties panel</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-1 h-5" />

          {actions}
        </div>
      </header>
    </TooltipProvider>
  );
}
