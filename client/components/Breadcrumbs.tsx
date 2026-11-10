import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { Crumb } from "@/lib/schema";
import { cn } from "@/lib/utils";

interface BreadcrumbsProps {
  /** Home first, current page last. Pair with breadcrumbSchema(crumbs). */
  crumbs: Crumb[];
  className?: string;
  /** Use on dark hero backgrounds. */
  inverted?: boolean;
}

export default function Breadcrumbs({ crumbs, className, inverted = false }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol
        className={cn(
          "flex flex-wrap items-center gap-1 text-sm",
          inverted ? "text-gray-300" : "text-gray-500",
        )}
      >
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-1">
              {index > 0 && <ChevronRight className="h-4 w-4" aria-hidden="true" />}
              {isLast ? (
                <span aria-current="page" className={inverted ? "text-white" : "text-secondary"}>
                  {crumb.name}
                </span>
              ) : (
                <Link to={crumb.path} className="hover:text-primary hover:underline">
                  {crumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
