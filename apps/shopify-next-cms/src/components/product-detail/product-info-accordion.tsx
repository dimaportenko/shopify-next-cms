import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface ProductInfoAccordionProps {
  description: string;
}

export function ProductInfoAccordion({
  description,
}: ProductInfoAccordionProps) {
  return (
    <Accordion defaultValue={["product-details"]}>
      <AccordionItem value="product-details">
        <AccordionTrigger>Product Details</AccordionTrigger>
        <AccordionContent>
          <p className="text-muted-foreground">
            {description || "No description available."}
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="specifications">
        <AccordionTrigger>Specifications</AccordionTrigger>
        <AccordionContent>
          <p className="text-muted-foreground">
            Please refer to the product listing for full specifications.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="warranty">
        <AccordionTrigger>Warranty</AccordionTrigger>
        <AccordionContent>
          <p className="text-muted-foreground">
            Standard manufacturer warranty applies.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
