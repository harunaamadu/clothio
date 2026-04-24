import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const sizeMap = {
  sm: "w-4 h-4 border-2",
  md: "w-7 h-7 border-2",
  lg: "w-10 h-10 border-[3px]",
};

export function LoadingSpinner({
  size = "md",
  className,
  label,
}: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div
        className={cn(
          "rounded-full border-[#e4e4e7] border-t-[#1a1a2e] animate-spin",
          sizeMap[size]
        )}
        role="status"
        aria-label={label ?? "Loading"}
      />
      {label && (
        <p className="text-xs text-[#71717a] font-medium">{label}</p>
      )}
    </div>
  );
}

// Full-page loading state
export function PageSpinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <LoadingSpinner size="lg" label={label} />
    </div>
  );
}