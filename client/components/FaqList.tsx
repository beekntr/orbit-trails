import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/lib/schema";
import { cn } from "@/lib/utils";

interface FaqListProps {
  items: FaqItem[];
  className?: string;
  /** Open the first answer by default. */
  openFirst?: boolean;
}

/**
 * FAQ accordion built on native <details>.
 *
 * Unlike a JS accordion (Radix unmounts closed panels), every answer stays in
 * the HTML, so search engines and answer engines can read and quote it. Works
 * without JavaScript and is keyboard accessible out of the box.
 * Pair it with faqSchema(items) in the page's <Seo jsonLd>.
 */
export default function FaqList({ items, className, openFirst = false }: FaqListProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item, index) => (
        <details
          key={item.question}
          open={openFirst && index === 0}
          className="group rounded-lg border border-gray-200 bg-white shadow-sm open:shadow-md"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 text-left [&::-webkit-details-marker]:hidden">
            <h3 className="text-base font-semibold text-secondary group-hover:text-primary md:text-lg">
              {item.question}
            </h3>
            <ChevronDown
              className="h-5 w-5 shrink-0 text-gray-500 transition-transform duration-200 group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <p className="px-6 pb-5 text-base leading-relaxed text-gray-600">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
