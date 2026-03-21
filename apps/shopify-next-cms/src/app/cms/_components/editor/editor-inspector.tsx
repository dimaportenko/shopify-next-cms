"use client";

import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ItemSelector {
  index: number;
  zone?: string;
}

interface EditorFieldsPanelProps {
  children: ReactNode;
  isLoading: boolean;
  itemSelector?: ItemSelector | null;
}

interface EditorFieldLabelProps {
  children?: ReactNode;
  icon?: ReactNode;
  label: string;
  el?: "label" | "div";
  readOnly?: boolean;
  className?: string;
}

interface EditorDrawerProps {
  children: ReactNode;
}

function formatZoneLabel(zone?: string) {
  if (!zone) return null;

  return zone
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function EditorFieldsPanel({
  children,
  isLoading,
  itemSelector,
}: EditorFieldsPanelProps) {
  const zoneLabel = formatZoneLabel(itemSelector?.zone);

  return (
    <div className="flex h-full min-h-0 flex-col border-l border-border bg-muted/20">
      <Card className="h-full rounded-none border-0 bg-transparent py-0 ring-0">
        <CardHeader className="gap-3 border-b border-border/80 bg-background/95 py-4 backdrop-blur supports-backdrop-filter:bg-background/80">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-col gap-1">
              <CardTitle className="text-sm">Properties</CardTitle>
              <CardDescription>
                Tune content, layout, and block settings without leaving the
                canvas.
              </CardDescription>
            </div>

            <Badge variant="outline">
              {itemSelector ? `Block ${itemSelector.index + 1}` : "Page"}
            </Badge>
          </div>

          {zoneLabel ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Drop zone</span>
              <Badge variant="secondary">{zoneLabel}</Badge>
            </div>
          ) : null}
        </CardHeader>

        <CardContent className="min-h-0 flex-1 px-0">
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-4 p-4">
              {isLoading ? (
                <div className="rounded-xl border border-dashed border-border bg-background px-4 py-6 text-sm text-muted-foreground">
                  Loading fields...
                </div>
              ) : (
                children
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

export function EditorDrawer({ children }: EditorDrawerProps) {
  return (
    <div className="cms-editor-drawer h-full bg-background [&>div:first-child]:hidden [&>div:nth-child(2)]:h-full [&>div:nth-child(2)]:border-t-0">
      {children}
    </div>
  );
}

export function EditorFieldLabel({
  children,
  icon,
  label,
  el = "label",
  readOnly,
  className,
}: EditorFieldLabelProps) {
  const Comp = el;

  return (
    <Comp className={cn("flex flex-col gap-2", className)}>
      <span className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
        {icon ? <span className="text-foreground/70">{icon}</span> : null}
        <span className="truncate">{label}</span>
        {readOnly ? <Badge variant="outline">Read only</Badge> : null}
      </span>

      {children ? <div className="min-w-0">{children}</div> : null}
    </Comp>
  );
}
