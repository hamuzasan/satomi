"use client";

import { StatePanel } from "@/src/components/satomi";

export default function Error() {
  return (
    <StatePanel
      tone="error"
      title="Halaman gagal dimuat"
      description="Coba muat ulang. Data transaksi kamu tetap aman."
      primaryAction={{ label: "Muat ulang", href: "/dashboard" }}
      secondaryAction={{ label: "Buka riwayat", href: "/transactions" }}
    />
  );
}
