// This layout is intentionally minimal — the sidebar and topbar
// are provided by the root layout (src/app/layout.tsx).
export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
