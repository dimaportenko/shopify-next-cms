"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

interface CmsThemeContextValue {
  editorTheme: Theme;
  previewTheme: Theme;
  toggleEditorTheme: () => void;
  togglePreviewTheme: () => void;
  setEditorTheme: (theme: Theme) => void;
  setPreviewTheme: (theme: Theme) => void;
}

const CmsThemeContext = createContext<CmsThemeContextValue | null>(null);

const EDITOR_THEME_KEY = "cms-editor-theme";
const PREVIEW_THEME_KEY = "cms-preview-theme";

function getStoredTheme(key: string, fallback: Theme): Theme {
  if (typeof window === "undefined") return fallback;
  const stored = localStorage.getItem(key);
  if (stored === "light" || stored === "dark") return stored;
  return fallback;
}

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function useStoredTheme(key: string, fallback: Theme): Theme {
  return useSyncExternalStore(
    subscribeToStorage,
    () => getStoredTheme(key, fallback),
    () => fallback,
  );
}

export function CmsThemeProvider({ children }: { children: ReactNode }) {
  const storedEditorTheme = useStoredTheme(EDITOR_THEME_KEY, "light");
  const storedPreviewTheme = useStoredTheme(PREVIEW_THEME_KEY, "light");
  const [editorTheme, setEditorThemeState] = useState<Theme>(storedEditorTheme);
  const [previewTheme, setPreviewThemeState] =
    useState<Theme>(storedPreviewTheme);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Sync from external store after hydration
  useEffect(() => {
    setEditorThemeState(storedEditorTheme);
  }, [storedEditorTheme]);

  useEffect(() => {
    setPreviewThemeState(storedPreviewTheme);
  }, [storedPreviewTheme]);

  const setEditorTheme = useCallback((theme: Theme) => {
    setEditorThemeState(theme);
    localStorage.setItem(EDITOR_THEME_KEY, theme);
  }, []);

  const setPreviewTheme = useCallback((theme: Theme) => {
    setPreviewThemeState(theme);
    localStorage.setItem(PREVIEW_THEME_KEY, theme);
  }, []);

  const toggleEditorTheme = useCallback(() => {
    setEditorThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem(EDITOR_THEME_KEY, next);
      return next;
    });
  }, []);

  const togglePreviewTheme = useCallback(() => {
    setPreviewThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem(PREVIEW_THEME_KEY, next);
      return next;
    });
  }, []);

  // Sync preview theme to Puck iframe
  useEffect(() => {
    if (!mounted) return;

    const syncIframe = () => {
      const iframes = document.querySelectorAll<HTMLIFrameElement>(
        ".cms-editor-root iframe",
      );
      iframes.forEach((iframe) => {
        try {
          const iframeDoc = iframe.contentDocument;
          if (!iframeDoc) return;
          const html = iframeDoc.documentElement;
          html.classList.toggle("dark", previewTheme === "dark");
        } catch {
          // cross-origin iframe, skip
        }
      });
    };

    // Sync immediately and observe for new iframes (debounced)
    syncIframe();
    let timer: ReturnType<typeof setTimeout>;
    const observer = new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(syncIframe, 200);
    });
    const root = document.querySelector(".cms-editor-root");
    if (root) {
      observer.observe(root, { childList: true, subtree: true });
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [previewTheme, mounted]);

  const value = useMemo(
    () => ({
      editorTheme,
      previewTheme,
      toggleEditorTheme,
      togglePreviewTheme,
      setEditorTheme,
      setPreviewTheme,
    }),
    [
      editorTheme,
      previewTheme,
      toggleEditorTheme,
      togglePreviewTheme,
      setEditorTheme,
      setPreviewTheme,
    ],
  );

  return (
    <CmsThemeContext.Provider value={value}>
      {children}
    </CmsThemeContext.Provider>
  );
}

export function useCmsTheme(): CmsThemeContextValue {
  const ctx = useContext(CmsThemeContext);
  if (!ctx) {
    throw new Error("useCmsTheme must be used within a CmsThemeProvider");
  }
  return ctx;
}
