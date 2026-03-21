"use client";

import { usePuck } from "@puckeditor/core";
import type { Data } from "@puckeditor/core";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface PublishButtonProps {
  onPublish: (data: Data) => Promise<void>;
}

export function PublishButton({ onPublish }: PublishButtonProps) {
  const { appState } = usePuck();
  const [publishing, setPublishing] = useState(false);

  const handleClick = async () => {
    setPublishing(true);
    try {
      await onPublish(appState.data);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <Button size="sm" disabled={publishing} onClick={handleClick}>
      {publishing && <Loader2 className="size-4 animate-spin" />}
      {publishing ? "Publishing..." : "Publish"}
    </Button>
  );
}
