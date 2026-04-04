"use client";

import { type SubmitEvent, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMediaLibrary } from "./use-media-library";

interface MediaLibraryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
}

export function MediaLibraryModal({
  open,
  onOpenChange,
  onSelect,
}: MediaLibraryModalProps) {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data,
    isLoading,
    isError,
    isRefetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMediaLibrary(searchQuery || undefined);

  const images = data?.pages.flatMap((page) => page.images) ?? [];

  const handleSearchSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    setSearchQuery(searchInput);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[80vh] max-w-180 flex-col overflow-hidden md:max-w-[80%]">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by filename..."
            className="flex-1"
          />
          <Button type="submit" variant="outline" size="sm">
            Search
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            {isRefetching ? "Refreshing..." : "Refresh"}
          </Button>
          {searchQuery && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchInput("");
                setSearchQuery("");
              }}
            >
              Clear
            </Button>
          )}
        </form>

        <div className="flex-1 overflow-auto">
          {isError && (
            <div className="p-5 text-center text-destructive">
              Failed to load media library
            </div>
          )}

          {!isError && images.length === 0 && !isLoading && (
            <div className="p-10 text-center text-muted-foreground">
              No media found
            </div>
          )}

          <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
            {images.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelect(item.url);
                  onOpenChange(false);
                }}
                className="flex cursor-pointer flex-col overflow-hidden rounded-lg border-2 border-border bg-muted p-0 hover:border-primary"
              >
                <div className="flex aspect-square w-full items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.alt}
                    className="size-full object-cover"
                  />
                </div>
                <span className="line-clamp-1 w-full px-1 py-1 text-[10px] text-muted-foreground">
                  {item.alt || "Untitled"}
                </span>
              </button>
            ))}
          </div>

          {hasNextPage && (
            <div className="mt-4 text-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}

          {isLoading && images.length === 0 && (
            <div className="p-10 text-center text-muted-foreground">
              Loading...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
