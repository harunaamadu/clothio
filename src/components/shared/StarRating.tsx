import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "xs" | "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

const sizeMap = {
  xs: "w-3 h-3",
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

export function StarRating({
  rating,
  max = 5,
  size = "sm",
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.floor(rating);
        const partial = !filled && i < rating;
        return (
          <button
            key={i}
            type={interactive ? "button" : undefined}
            onClick={() => interactive && onChange?.(i + 1)}
            className={cn(
              "relative",
              interactive && "cursor-pointer hover:scale-110 transition-transform",
              !interactive && "cursor-default"
            )}
            aria-label={interactive ? `Rate ${i + 1} star${i !== 0 ? "s" : ""}` : undefined}
          >
            <Star
              className={cn(
                sizeMap[size],
                filled
                  ? "fill-[#f5a623] text-[#f5a623]"
                  : partial
                    ? "fill-[#f5a623]/50 text-[#f5a623]"
                    : "fill-transparent text-[#d4d4d8]"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}