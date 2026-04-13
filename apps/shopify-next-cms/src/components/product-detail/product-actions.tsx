"use client";

import * as React from "react";
import { Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductActionsProps {
  isAvailable: boolean;
  onlineStoreUrl: string | null;
}

export function ProductActions({
  isAvailable,
  onlineStoreUrl,
}: ProductActionsProps) {
  const [quantity, setQuantity] = React.useState(1);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center rounded-lg border border-border">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Decrease quantity"
          disabled={quantity <= 1}
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
        >
          <Minus className="size-4" />
        </Button>
        <span className="w-10 text-center text-sm tabular-nums">
          {quantity}
        </span>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Increase quantity"
          onClick={() => setQuantity((q) => q + 1)}
        >
          <Plus className="size-4" />
        </Button>
      </div>

      {onlineStoreUrl ? (
        <Button
          render={<a href={onlineStoreUrl} target="_blank" rel="noreferrer" />}
          nativeButton={false}
          size="lg"
          className="flex-1"
        >
          <ShoppingBag className="size-4" />
          Buy Now
        </Button>
      ) : (
        <Button size="lg" className="flex-1" disabled={!isAvailable}>
          <ShoppingBag className="size-4" />
          {isAvailable ? "Buy Now" : "Unavailable"}
        </Button>
      )}

      <Button variant="outline" size="icon-lg" aria-label="Add to wishlist">
        <Heart className="size-4" />
      </Button>
    </div>
  );
}
