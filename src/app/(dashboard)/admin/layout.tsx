export const metadata = {
  title: `Admin Dashboard | ${process.env.WEBSITE_NAME}`,
  description:
    "Manage products, customers, orders, and store analytics.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen bg-background">
      {children}
    </div>
  );
}