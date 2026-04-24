import Link from "next/link";
import { SearchIcon } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";

export default function NotFound() {
  return (
    <Empty className="layout min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
      {/* Large 404 */}
      <EmptyContent className="relative">
        <span className="font-display text-[140px] sm:text-[200px] font-bold text-stone-100 leading-none select-none">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="space-y-1">
            <EmptyHeader>
              <EmptyTitle className="font-heading text-xl sm:text-2xl font-bold text-[#1a1a2e]">
                Page Not Found
              </EmptyTitle>
            </EmptyHeader>
            <EmptyDescription>
              The page you're looking for doesn't exist or has been moved.
            </EmptyDescription>
          </div>
        </div>
      </EmptyContent>

      <InputGroup className="sm:w-2/4">
        <InputGroupInput placeholder="Try searching for pages..." />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <Kbd>/</Kbd>
        </InputGroupAddon>
      </InputGroup>

      <EmptyContent className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="bg-stone-800 hover:bg-primary text-white font-semibold text-sm px-6 py-3 transition-colors"
        >
          Go Home
        </Link>

        <Link
          href="/products"
          className="font-semibold text-sm hover:text-primary hover:underline px-6 py-3 transition-colors"
        >
          Browse Products
        </Link>

        <EmptyDescription className="mt-12">
          Need help?{" "}
          <Link
            href="/customer-support"
            className="font-medium text-sm hover:text-primary hover:underline transition-colors"
          >
            Contact support
          </Link>
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  );
}
