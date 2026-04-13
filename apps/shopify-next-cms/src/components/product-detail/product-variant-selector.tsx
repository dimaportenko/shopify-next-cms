import * as React from "react";
import { cn } from "@/lib/utils";
import type {
  ProductDto,
  ProductOptionDto,
  VariantDto,
} from "@/lib/shopify/types";

function buildVariantMap(
  variants: VariantDto[] | undefined,
): Map<string, VariantDto> {
  const map = new Map<string, VariantDto>();
  if (!variants) return map;
  for (const v of variants) {
    const key = v.selectedOptions
      .map((o) => `${o.name}:${o.value}`)
      .sort()
      .join("|");
    map.set(key, v);
  }
  return map;
}

function lookupVariant(
  variantMap: Map<string, VariantDto>,
  selectedOptions: Record<string, string>,
): VariantDto | undefined {
  const key = Object.entries(selectedOptions)
    .map(([name, value]) => `${name}:${value}`)
    .sort()
    .join("|");
  return variantMap.get(key);
}

interface ProductVariantSelectorProps {
  option: ProductOptionDto;
  product: ProductDto;
  selectedOptions: Record<string, string>;
  onOptionChange: (optionName: string, value: string) => void;
}

export function ProductVariantSelector({
  option,
  product,
  selectedOptions,
  onOptionChange,
}: ProductVariantSelectorProps) {
  const variantMap = React.useMemo(
    () => buildVariantMap(product.variants),
    [product.variants],
  );

  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-sm font-semibold">
        {option.name}
        {selectedOptions[option.name] && (
          <span className="font-normal text-muted-foreground">
            {" "}
            : {selectedOptions[option.name]}
          </span>
        )}
      </h4>
      <div className="flex flex-wrap gap-2">
        {option.values.map((value) => {
          const isSelected = selectedOptions[option.name] === value;
          const testOptions = {
            ...selectedOptions,
            [option.name]: value,
          };
          const matchingVariant = lookupVariant(variantMap, testOptions);
          const isUnavailable =
            matchingVariant && !matchingVariant.availableForSale;

          return (
            <button
              key={value}
              type="button"
              onClick={() => onOptionChange(option.name, value)}
              className={cn(
                "rounded-lg border px-4 py-2 text-sm font-medium transition-all",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:bg-muted",
                isUnavailable && !isSelected && "opacity-50",
              )}
            >
              {value}
            </button>
          );
        })}
      </div>
    </div>
  );
}
