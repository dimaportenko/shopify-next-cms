"use client";

import type { Data } from "@puckeditor/core";
import { usePuck } from "@cms/_lib/use-puck";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface PublishButtonProps {
  onPublish: (data: Data) => Promise<void>;
}

export function PublishButton({ onPublish }: PublishButtonProps) {
  const data = usePuck((state) => state.appState.data);
  const [publishing, setPublishing] = useState(false);

  const handleClick = async () => {
    setPublishing(true);
    try {
      await onPublish(data);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <Button disabled={publishing} onClick={handleClick}>
      {publishing && <Loader2 className="size-4 animate-spin" />}
      {publishing ? "Publishing..." : "Publish"}
    </Button>
  );
}
