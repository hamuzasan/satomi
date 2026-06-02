import {
  Bolt,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  Headphones,
  Router,
  WalletCards,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type BillStatus = "Belum dibayar" | "Sudah dibayar" | "Terjadwal";
export type BillTone = "cyan" | "purple" | "green" | "amber" | "error";

export type BillRecord = {
  id: string;
  name: string;
  amount: string;
  dueDate: string;
  dueLabel: string;
  status: BillStatus;
  source: string;
  tone: BillTone;
  icon: LucideIcon;
};

export const billRecords: BillRecord[] = [
  {
    id: "internet-rumah",
    name: "Internet rumah",
    amount: "Rp250.000",
    dueDate: "5 Okt",
    dueLabel: "Jatuh tempo 3 hari lagi",
    status: "Belum dibayar",
    source: "Pocket Tagihan",
    tone: "error",
    icon: Router,
  },
  {
    id: "listrik",
    name: "Listrik",
    amount: "Rp180.000",
    dueDate: "10 Okt",
    dueLabel: "Terjadwal 8 hari lagi",
    status: "Terjadwal",
    source: "Pocket Tagihan",
    tone: "amber",
    icon: Bolt,
  },
  {
    id: "spotify",
    name: "Spotify",
    amount: "Rp55.000",
    dueDate: "1 Okt",
    dueLabel: "Sudah dibayar bulan ini",
    status: "Sudah dibayar",
    source: "Pocket Self-Reward",
    tone: "green",
    icon: Headphones,
  },
  {
    id: "cicilan-alat",
    name: "Cicilan alat",
    amount: "Rp300.000",
    dueDate: "15 Okt",
    dueLabel: "Jatuh tempo 13 hari lagi",
    status: "Belum dibayar",
    source: "Pocket Utama",
    tone: "purple",
    icon: CreditCard,
  },
];

export const billSummary = [
  {
    label: "Total tagihan",
    value: "Rp785.000",
    detail: "Bulan ini",
    tone: "cyan" as const,
    icon: WalletCards,
  },
  {
    label: "Sudah dibayar",
    value: "Rp55.000",
    detail: "1 tagihan",
    tone: "green" as const,
    icon: CheckCircle2,
  },
  {
    label: "Belum dibayar",
    value: "Rp550.000",
    detail: "2 tagihan",
    tone: "error" as const,
    icon: CalendarClock,
  },
  {
    label: "Terjadwal",
    value: "Rp180.000",
    detail: "1 tagihan",
    tone: "amber" as const,
    icon: CalendarClock,
  },
];

export const billInsight =
  "Tagihan internet rumah jatuh tempo 3 hari lagi. Pocket Tagihan masih cukup, sebaiknya bayar sebelum tanggal 5 agar arus kas tetap rapi.";
