"use client";

import { GripVertical } from "lucide-react";

interface EditorDrawerItemProps {
  name: string;
}

export function EditorDrawerItem({ name }: EditorDrawerItemProps) {
  return (
    <div className="cms-drawer-item-card flex min-h-11 items-center justify-between px-3.5">
      <span className="truncate text-[0.95rem] font-medium text-foreground">
        {name}
      </span>

      <span className="cms-drawer-item-icon text-muted-foreground">
        <GripVertical className="size-4" />
      </span>
    </div>
  );
}
