"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCollectionSearch } from "./use-collection-search";

interface CollectionPickerFieldProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export function CollectionPickerField({
  value,
  onChange,
  readOnly,
}: CollectionPickerFieldProps) {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setTimeout(() => setSearchQuery(inputValue), 300);
    return () => clearTimeout(id);
  }, [inputValue]);

  useEffect(() => {
    if (!isOpen) return;
    function handleMouseDown(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [isOpen]);

  const { data, isLoading } = useCollectionSearch(searchQuery, isOpen);
  const results = data ?? [];

  return (
    <div ref={containerRef} className="flex flex-col gap-1.5">
      {value && (
        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 px-2.5 py-1 text-sm">
          <span className="truncate text-foreground">{value}</span>
          {!readOnly && (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => onChange("")}
              className="ml-1 shrink-0 text-muted-foreground hover:text-destructive"
            >
              <X className="size-3" />
            </Button>
          )}
        </div>
      )}

      {!readOnly && (
        <div className="relative">
          <Input
            value={inputValue}
            placeholder="Search collections..."
            onChange={(e) => {
              setInputValue(e.currentTarget.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
          />

          {isOpen && (
            <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-border bg-background shadow-md">
              {isLoading && (
                <div className="px-3 py-2 text-xs text-muted-foreground">
                  Loading...
                </div>
              )}
              {!isLoading && results.length === 0 && (
                <div className="px-3 py-2 text-xs text-muted-foreground">
                  No collections found
                </div>
              )}
              {results.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted",
                    item.handle === value && "bg-muted",
                  )}
                  onClick={() => {
                    onChange(item.handle);
                    setInputValue("");
                    setIsOpen(false);
                  }}
                >
                  {item.imageUrl && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="size-6 rounded object-cover"
                    />
                  )}
                  <span className="flex-1 truncate">{item.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.handle}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
