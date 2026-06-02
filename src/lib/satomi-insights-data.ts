import {
  Coffee,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Utensils,
  WalletCards,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type InsightTone = "cyan" | "purple" | "green" | "amber" | "error";

export type CategoryInsight = {
  label: string;
  amount: string;
  percent: number;
  tone: InsightTone;
  icon: LucideIcon;
};

export type WeeklyPoint = {
  day: string;
  amount: string;
  height: number;
};

export type NudgeHistoryItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  tone: InsightTone;
  icon: LucideIcon;
};

export type ReinforcementCard = {
  id: string;
  title: string;
  description: string;
  value: string;
  icon: LucideIcon;
};

export const aiInsightRecommendation =
  "Pengeluaran makan naik 18% dibandingkan minggu lalu. Satomi menyarankan batasi pengeluaran non-prioritas selama sisa bulan ini agar target tabungan tetap tercapai.";

export const categoryInsights: CategoryInsight[] = [
  {
    label: "Makanan",
    amount: "Rp575.000",
    percent: 45,
    tone: "cyan",
    icon: Utensils,
  },
  {
    label: "Transportasi",
    amount: "Rp260.000",
    percent: 20,
    tone: "purple",
    icon: WalletCards,
  },
  {
    label: "Self-Reward",
    amount: "Rp270.000",
    percent: 21,
    tone: "amber",
    icon: Coffee,
  },
  {
    label: "Tagihan",
    amount: "Rp180.000",
    percent: 14,
    tone: "green",
    icon: Zap,
  },
];

export const weeklySpendingTrend: WeeklyPoint[] = [
  { day: "Sen", amount: "Rp85k", height: 32 },
  { day: "Sel", amount: "Rp120k", height: 44 },
  { day: "Rab", amount: "Rp95k", height: 38 },
  { day: "Kam", amount: "Rp140k", height: 50 },
  { day: "Jum", amount: "Rp230k", height: 78 },
  { day: "Sab", amount: "Rp190k", height: 64 },
  { day: "Min", amount: "Rp260k", height: 88 },
];

export const nudgeHistory: NudgeHistoryItem[] = [
  {
    id: "self-reward",
    title: "Self-Reward hampir habis",
    description: "Sisa budget Rp150.000 untuk bulan ini.",
    time: "2 hari lalu",
    tone: "error",
    icon: TrendingUp,
  },
  {
    id: "kopi",
    title: "Kurangi kopi minggu ini",
    description: "Pengeluaran kopi sudah melebihi rata-rata mingguan.",
    time: "4 hari lalu",
    tone: "cyan",
    icon: Lightbulb,
  },
  {
    id: "tabungan",
    title: "Surplus bisa dialihkan",
    description: "Ada ruang Rp220.000 untuk mempercepat Dana Jepang.",
    time: "6 hari lalu",
    tone: "green",
    icon: Sparkles,
  },
];

export const positiveReinforcements: ReinforcementCard[] = [
  {
    id: "tagihan",
    title: "Tagihan lebih tertib",
    description: "Satu langganan sudah dibayar tepat waktu bulan ini.",
    value: "1 lunas",
    icon: ShieldCheck,
  },
  {
    id: "transport",
    title: "Transport stabil",
    description: "Biaya transport turun dibanding pekan lalu.",
    value: "-8%",
    icon: TrendingDown,
  },
];
