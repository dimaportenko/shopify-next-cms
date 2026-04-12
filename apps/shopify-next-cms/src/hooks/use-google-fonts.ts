"use client";

import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import {
  type FontCategory,
  type GoogleFontInfo,
  getCategoryForSlot,
  getFontFamilyValue,
  loadGoogleFont,
} from "@/lib/google-fonts";

export function useGoogleFonts(slot: "font-sans" | "font-serif" | "font-mono") {
  const [search, setSearch] = useState("");
  const categories = useMemo(() => getCategoryForSlot(slot), [slot]);
  const trpc = useTRPC();

  const { data: allFonts = [], isPending } = useQuery(
    trpc.fonts.list.queryOptions(),
  );

  const filteredFonts = useMemo(() => {
    const byCategory = allFonts.filter((font) =>
      categories.includes(font.category as FontCategory),
    );

    if (!search) {
      return byCategory.slice(0, 50);
    }

    const query = search.toLowerCase();

    return byCategory
      .filter((font) => font.family.toLowerCase().includes(query))
      .slice(0, 50);
  }, [allFonts, categories, search]);

  const selectFont = useCallback((font: GoogleFontInfo): string => {
    loadGoogleFont(font.family);
    return getFontFamilyValue(font.family, font.category);
  }, []);

  return {
    fonts: filteredFonts,
    search,
    setSearch,
    loading: isPending,
    selectFont,
  };
}
