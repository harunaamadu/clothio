import ScrollToTopButton from "@/components/layout/ScrollToTopButton";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Header />
      <main className="flex-1 w-full">{children}</main>
      <ScrollToTopButton />
      <Footer />
    </div>
  );
}
