"use client";

import type { ComponentType, ReactNode } from "react";
import type {
  FieldProps,
  NumberField,
  SelectField,
  TextField,
  TextareaField,
} from "@puckeditor/core";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const controlClassName =
  "!rounded-lg !border-input !bg-background !text-foreground h-8 w-full min-w-0 border px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40";

interface LabelProps {
  children?: ReactNode;
  icon?: ReactNode;
  label: string;
  el?: "label" | "div";
  readOnly?: boolean;
  className?: string;
}

type PuckFieldProps<F, ValueType> = FieldProps<F, ValueType> & {
  name: string;
  label?: string;
  labelIcon?: ReactNode;
  Label?: ComponentType<LabelProps>;
};

export function EditorTextField({
  field,
  name,
  onChange,
  readOnly,
  value,
  label,
  labelIcon,
  Label,
}: PuckFieldProps<TextField, string>) {
  const input = (
    <Input
      className={controlClassName}
      disabled={readOnly}
      name={name}
      placeholder={field.placeholder}
      value={value ?? ""}
      onChange={(event) => onChange(event.currentTarget.value)}
    />
  );

  if (Label && label) {
    return (
      <Label label={label} icon={labelIcon} readOnly={readOnly}>
        {input}
      </Label>
    );
  }

  return input;
}

export function EditorNumberField({
  field,
  name,
  onChange,
  readOnly,
  value,
  label,
  labelIcon,
  Label,
}: PuckFieldProps<NumberField, number | undefined>) {
  const input = (
    <Input
      className={controlClassName}
      disabled={readOnly}
      max={field.max}
      min={field.min}
      name={name}
      placeholder={field.placeholder}
      step={field.step}
      type="number"
      value={value ?? ""}
      onChange={(event) => {
        const nextValue = event.currentTarget.value;

        if (nextValue === "") {
          onChange(undefined);
          return;
        }

        if (!event.currentTarget.validity.valid) {
          return;
        }

        const parsedValue = Number(nextValue);

        if (Number.isFinite(parsedValue)) {
          onChange(parsedValue);
        }
      }}
    />
  );

  if (Label && label) {
    return (
      <Label label={label} icon={labelIcon} readOnly={readOnly}>
        {input}
      </Label>
    );
  }

  return input;
}

export function EditorTextareaField({
  field,
  name,
  onChange,
  readOnly,
  value,
  label,
  labelIcon,
  Label,
}: PuckFieldProps<TextareaField, string>) {
  const input = (
    <textarea
      className={cn(controlClassName, "min-h-24 resize-y py-2")}
      disabled={readOnly}
      name={name}
      placeholder={field.placeholder}
      value={value ?? ""}
      onChange={(event) => onChange(event.currentTarget.value)}
    />
  );

  if (Label && label) {
    return (
      <Label label={label} icon={labelIcon} readOnly={readOnly}>
        {input}
      </Label>
    );
  }

  return input;
}

export function EditorSelectField({
  field,
  name,
  onChange,
  readOnly,
  value,
  label,
  labelIcon,
  Label,
}: PuckFieldProps<SelectField, SelectField["options"][number]["value"]>) {
  const selectedIndex = field.options.findIndex((option) =>
    Object.is(option.value, value),
  );
  const selectedValue = selectedIndex === -1 ? "" : String(selectedIndex);

  const select = (
    <div className="relative">
      <select
        className={cn(
          controlClassName,
          "appearance-none pr-8 text-foreground disabled:text-muted-foreground",
        )}
        disabled={readOnly}
        name={name}
        value={selectedValue}
        onChange={(event) => {
          if (event.currentTarget.value === "") {
            return;
          }

          const option = field.options[Number(event.currentTarget.value)];
          if (option) onChange(option.value);
        }}
      >
        <option disabled value="">
          Select an option
        </option>
        {field.options.map((option, index) => (
          <option key={`${name}-${index}`} value={String(index)}>
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );

  if (Label && label) {
    return (
      <Label label={label} icon={labelIcon} readOnly={readOnly}>
        {select}
      </Label>
    );
  }

  return select;
}
