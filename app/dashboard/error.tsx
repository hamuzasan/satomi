"use client";

import { StatePanel } from "@/src/components/satomi";

export default function DashboardError() {
  return (
    <StatePanel
      tone="error"
      title="Ringkasan gagal dimuat"
      description="Coba muat ulang. Data transaksi kamu tetap aman."
      primaryAction={{ label: "Muat ulang", href: "/dashboard" }}
      secondaryAction={{ label: "Buka riwayat", href: "/transactions" }}
    />
  );
}
