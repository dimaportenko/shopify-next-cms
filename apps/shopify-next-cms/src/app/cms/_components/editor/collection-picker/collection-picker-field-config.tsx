import { CollectionPickerField } from "./collection-picker-field";

export function collectionPickerFieldConfig(label = "Collection") {
  return {
    type: "custom" as const,
    label,
    render: ({
      value,
      onChange,
      readOnly,
    }: {
      value: string | undefined;
      onChange: (value: string) => void;
      readOnly?: boolean;
    }) => (
      <CollectionPickerField
        value={value ?? ""}
        onChange={onChange}
        readOnly={readOnly}
      />
    ),
  };
}
