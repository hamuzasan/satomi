import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  CircleAlert,
  Landmark,
  ReceiptText,
  Shield,
  ShoppingBasket,
  Trophy,
  WalletCards,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type DashboardTone = "cyan" | "purple" | "green" | "amber" | "error";

export type DashboardSummary = {
  label: string;
  value: string;
  detail: string;
  tone: DashboardTone;
  icon: LucideIcon;
};

export type DashboardPocket = {
  name: string;
  amount: string;
  limit: string;
  progress: number;
  tone: DashboardTone;
  icon: LucideIcon;
};

export type DashboardTransaction = {
  name: string;
  amount: string;
  meta: string;
  type: "income" | "expense";
  icon: LucideIcon;
};

export type DashboardBill = {
  name: string;
  amount: string;
  due: string;
};

export const dashboardSummary: DashboardSummary[] = [
  {
    label: "Total Pemasukan",
    value: "Rp2.500.000",
    detail: "Bulan ini",
    tone: "green",
    icon: BanknoteArrowDown,
  },
  {
    label: "Total Pengeluaran",
    value: "Rp1.275.000",
    detail: "Bulan ini",
    tone: "purple",
    icon: BanknoteArrowUp,
  },
  {
    label: "Sisa Budget",
    value: "Rp1.225.000",
    detail: "Masih aman",
    tone: "cyan",
    icon: WalletCards,
  },
  {
    label: "Pocket Berisiko",
    value: "2 Pocket",
    detail: "Butuh perhatian",
    tone: "error",
    icon: CircleAlert,
  },
];

export const dashboardPockets: DashboardPocket[] = [
  {
    name: "Kebutuhan Harian",
    amount: "Rp785.000",
    limit: "Rp1.250.000",
    progress: 63,
    tone: "cyan",
    icon: ShoppingBasket,
  },
  {
    name: "Tagihan",
    amount: "Rp430.000",
    limit: "Rp600.000",
    progress: 72,
    tone: "amber",
    icon: ReceiptText,
  },
  {
    name: "Tabungan",
    amount: "Rp350.000",
    limit: "Rp500.000",
    progress: 70,
    tone: "green",
    icon: Landmark,
  },
  {
    name: "Self-Reward",
    amount: "Rp270.000",
    limit: "Rp300.000",
    progress: 90,
    tone: "purple",
    icon: Trophy,
  },
  {
    name: "Dana Darurat",
    amount: "Rp150.000",
    limit: "Rp500.000",
    progress: 30,
    tone: "cyan",
    icon: Shield,
  },
];

export const recentTransactions: DashboardTransaction[] = [
  {
    name: "Ayam geprek",
    amount: "- Rp35.000",
    meta: "Makanan",
    type: "expense",
    icon: ShoppingBasket,
  },
  {
    name: "Kopi susu",
    amount: "- Rp28.000",
    meta: "Self-Reward",
    type: "expense",
    icon: Trophy,
  },
  {
    name: "Gaji freelance",
    amount: "+Rp500.000",
    meta: "Pemasukan",
    type: "income",
    icon: BanknoteArrowDown,
  },
  {
    name: "Internet rumah",
    amount: "- Rp250.000",
    meta: "Tagihan",
    type: "expense",
    icon: ReceiptText,
  },
  {
    name: "KRL",
    amount: "- Rp15.000",
    meta: "Transportasi",
    type: "expense",
    icon: WalletCards,
  },
];

export const dashboardGoal = {
  name: "Dana Jepang",
  amount: "Rp3.500.000",
  target: "Rp20.000.000",
  progress: 17.5,
};

export const billsDueSoon: DashboardBill[] = [
  {
    name: "Internet rumah",
    amount: "Rp250.000",
    due: "Jatuh tempo 3 hari lagi",
  },
  {
    name: "Listrik",
    amount: "Rp180.000",
    due: "Jatuh tempo 8 hari lagi",
  },
];
