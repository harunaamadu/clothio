import { Empty, EmptyContent } from "@/components/ui/empty";
import { cn } from "@/lib/utils";

const ringBase =
  "absolute w-44 aspect-square rounded-full border-transparent";

const rings = [
  "border-b-8 border-b-primary animate-ring-1",
  "border-r-8 border-r-primary brightness-125 animate-ring-2",
  "border-t-8 border-t-primary brightness-150 animate-ring-3",
];

export default function Loading() {
  return (
    <Empty className="min-h-screen w-full flex items-center justify-center">
      <EmptyContent className="relative flex items-center justify-center w-full h-full">
        {rings.map((ring, index) => (
          <div key={index} className={cn(ringBase, ring)} />
        ))}

        <p className="text-xs font-medium text-primary animate-pulse">
          Loading…
        </p>
      </EmptyContent>
    </Empty>
  );
}