import Reveal from "@/components/animations/reveal";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

interface TitleProps {
  title?: string;
  eyebrow?: string;
  description?: string;
  href?: string;
}

const Title = ({ title, eyebrow, description, href }: TitleProps) => {
  return (
    <div className="mb-6 md:mb-8">
      <Reveal>
        <div className="grid md:grid-cols-[1fr_auto] items-end w-full h-fit">
          <div className="h-auto py-0!">
            <p
              className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-widest text-primary mb-1"
              data-reveal
            >
              <span className="block w-10 h-px bg-primary my-auto" />{" "}
              <span>{eyebrow}</span>
            </p>
            <h1 className="text-4xl font-bold mb-4 capitalize" data-reveal>
              {title || "Title goes here"}
            </h1>
            {description && (
              <div className="text-base" data-reveal>
                {description}
              </div>
            )}
          </div>

          {href && (
            <Link
              className="flex items-center gap-2 hover:underline underline-offset-2"
              href={href}
              data-reveal
            >
              Shop now{" "}
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={15}
                color="currentColor"
                strokeWidth={1.5}
              />
            </Link>
          )}
        </div>
      </Reveal>
    </div>
  );
};

export default Title;
