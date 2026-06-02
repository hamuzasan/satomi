import {
  BadgeDollarSign,
  BellRing,
  CalendarDays,
  Flag,
  Landmark,
  Plane,
  Shield,
  Sparkles,
  TrendingDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type GoalTone = "cyan" | "purple" | "green" | "amber" | "error";
export type GoalStatus = "Goal Utama" | "Aktif" | "Butuh Fokus";

export type GoalRecord = {
  id: string;
  name: string;
  current: string;
  target: string;
  deadline: string;
  requiredSaving: string;
  progress: number;
  strategy: string;
  status: GoalStatus;
  tone: GoalTone;
  icon: LucideIcon;
  description: string;
};

export type GoalMilestone = {
  label: string;
  value: string;
  status: "Selesai" | "Berjalan" | "Menunggu";
};

export type GoalActivity = {
  id: string;
  title: string;
  meta: string;
  amount: string;
  icon: LucideIcon;
};

export const strategyChips = [
  "Save More Tomorrow",
  "50/30/20",
  "Debt Snowball",
  "Loss Aversion Reminder",
];

export const goalRecords: GoalRecord[] = [
  {
    id: "dana-jepang",
    name: "Dana Jepang",
    current: "Rp3.500.000",
    target: "Rp20.000.000",
    deadline: "12 bulan",
    requiredSaving: "Rp45.000/hari",
    progress: 18,
    strategy: "Save More Tomorrow",
    status: "Goal Utama",
    tone: "cyan",
    icon: Plane,
    description: "Target perjalanan Jepang dengan ritme tabungan harian ringan.",
  },
  {
    id: "dana-darurat",
    name: "Dana Darurat",
    current: "Rp4.250.000",
    target: "Rp12.000.000",
    deadline: "8 bulan",
    requiredSaving: "Rp32.000/hari",
    progress: 35,
    strategy: "50/30/20",
    status: "Aktif",
    tone: "green",
    icon: Shield,
    description: "Cadangan aman untuk menjaga cashflow tetap stabil.",
  },
  {
    id: "kurangi-jajan",
    name: "Kurangi Jajan",
    current: "Rp420.000",
    target: "Rp1.500.000",
    deadline: "3 bulan",
    requiredSaving: "Rp17.000/hari",
    progress: 28,
    strategy: "Loss Aversion Reminder",
    status: "Butuh Fokus",
    tone: "amber",
    icon: TrendingDown,
    description: "Mengurangi impuls kecil supaya surplus bulanan naik.",
  },
  {
    id: "lunasi-utang",
    name: "Lunasi Utang",
    current: "Rp1.800.000",
    target: "Rp6.000.000",
    deadline: "6 bulan",
    requiredSaving: "Rp24.000/hari",
    progress: 30,
    strategy: "Debt Snowball",
    status: "Aktif",
    tone: "purple",
    icon: BadgeDollarSign,
    description: "Melunasi cicilan kecil dulu agar momentum terasa cepat.",
  },
];

export const mainGoal = goalRecords[0];

export const satomiGoalRecommendation =
  "Satomi sarankan Dana Jepang tetap jadi prioritas utama. Naikkan setoran otomatis setiap ada pemasukan tambahan, lalu pakai Loss Aversion Reminder saat pocket Self-Reward mulai mendekati limit.";

export const goalMilestones: GoalMilestone[] = [
  { label: "Mulai komitmen", value: "Rp1.000.000", status: "Selesai" },
  { label: "Tiket dan itinerary", value: "Rp5.000.000", status: "Berjalan" },
  { label: "Akomodasi aman", value: "Rp12.000.000", status: "Menunggu" },
  { label: "Dana perjalanan siap", value: "Rp20.000.000", status: "Menunggu" },
];

export const goalActivities: GoalActivity[] = [
  {
    id: "auto-save",
    title: "Auto-save mingguan",
    meta: "Hari ini, 08:00 - Tabungan",
    amount: "+Rp150.000",
    icon: Landmark,
  },
  {
    id: "freelance",
    title: "Dialihkan dari freelance",
    meta: "Kemarin, 21:10 - Pemasukan",
    amount: "+Rp300.000",
    icon: Sparkles,
  },
  {
    id: "reminder",
    title: "Reminder target harian aktif",
    meta: "3 hari lalu - Satomi",
    amount: "Rp45.000/hari",
    icon: BellRing,
  },
];

export const goalFundingSources = [
  { label: "Auto-save", value: "Rp150.000/minggu", icon: CalendarDays },
  { label: "Surplus pocket", value: "Rp220.000/bulan", icon: Flag },
  { label: "Pemasukan freelance", value: "30% otomatis", icon: Sparkles },
];

export function getGoalById(id: string): GoalRecord | undefined {
  return goalRecords.find((goal) => goal.id === id);
}
