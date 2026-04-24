import Reveal from "@/components/animations/reveal";
import { cn } from "@/lib/utils";

interface TitleProps {
  title: string;
  fontSize?: string;
}

const SimpleTitle = ({ title, fontSize = "xl" }: TitleProps) => {
  return (
    <div className="mb-3 md:mb-6">
      <Reveal>
        <h1
          className={cn(
            `text-${fontSize}`,
            "font-semibold uppercase tracking-widest text-stone-600 dark:text-stone-300 mb-3"
          )}
          data-reveal
        >
          {title || "Title goes here"}
        </h1>
      </Reveal>
    </div>
  );
};

export default SimpleTitle;