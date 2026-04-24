import Reveal from "@/components/animations/reveal";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { Button } from "./button";

interface TitleProps {
  title?: string;
  eyebrow?: string;
  description?: string;

  href?: string;
  label?: string;
  icon?: "arrow" | "bin";

  button?: boolean;
  buttonLabel?: string;
  buttonIcon?: "arrow" | "bin";
  buttonAction?: () => void;
}

const Title = ({
  title,
  eyebrow,
  description,
  href,
  label,
  icon = "arrow",
  button,
  buttonLabel,
  buttonIcon = "arrow",
  buttonAction,
}: TitleProps) => {
  const LinkIcon = icon === "bin" ? Delete02Icon : ArrowRight01Icon;
  const BtnIcon = buttonIcon === "bin" ? Delete02Icon : ArrowRight01Icon;

  return (
    <div className="mb-6 md:mb-8">
      <Reveal stagger={0.4}>
        <div className="grid md:grid-cols-[1fr_auto] items-end gap-4">
          <div>
            {eyebrow && (
              <p
                className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-primary"
                data-reveal
              >
                <span className="my-auto block h-px w-4 bg-primary" />
                <span>{eyebrow}</span>
                <span className="my-auto block h-px w-10 bg-primary" />
              </p>
            )}

            <h1 className="mb-2 text-2xl font-bold capitalize" data-reveal>
              {title || "Title goes here"}
            </h1>

            {description && (
              <p
                className="max-w-2xl text-base text-muted-foreground"
                data-reveal
              >
                {description}
              </p>
            )}
          </div>

          {href ? (
            <Link
              href={href}
              className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary hover:underline underline-offset-2 transition-colors"
              data-reveal
            >
              {label ?? "Shop now"}
              <HugeiconsIcon
                icon={LinkIcon}
                size={15}
                color="currentColor"
                strokeWidth={1.5}
              />
            </Link>
          ) : button ? (
            <div data-reveal>
              <Button
                variant="link"
                type="button"
                onClick={buttonAction}
                className="items-center"
              >
                <HugeiconsIcon
                  icon={BtnIcon}
                  size={15}
                  color="currentColor"
                  strokeWidth={1.5}
                />

                {buttonLabel ?? "View all"}
              </Button>
            </div>
          ) : null}
        </div>
      </Reveal>
    </div>
  );
};

export default Title;
