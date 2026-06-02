import { AppShell, LoadingState } from "@/src/components/satomi";

export default function DashboardLoading() {
  return (
    <AppShell activePath="/dashboard">
      <LoadingState variant="skeleton" />
    </AppShell>
  );
}
