import { MediaPickerField } from "./media-picker-field";

export function mediaPickerFieldConfig(label = "Image") {
  return {
    type: "custom" as const,
    label,
    render: ({
      value,
      onChange,
      readOnly,
    }: {
      value: string;
      onChange: (value: string) => void;
      readOnly?: boolean;
    }) => (
      <MediaPickerField value={value} onChange={onChange} readOnly={readOnly} />
    ),
  };
}
