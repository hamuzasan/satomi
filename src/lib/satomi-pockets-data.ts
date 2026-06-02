import {
  Coffee,
  Landmark,
  ReceiptText,
  Shield,
  ShoppingBasket,
  WalletCards,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type PocketStatus = "Aman" | "Waspada" | "Hampir Habis" | "Lewat Batas";
export type PocketTone = "cyan" | "amber" | "green" | "purple" | "error";

export type PocketRecord = {
  id: string;
  name: string;
  used: string;
  limit: string;
  remaining: string;
  usedNumber: number;
  limitNumber: number;
  progress: number;
  status: PocketStatus;
  tone: PocketTone;
  icon: LucideIcon;
  description: string;
};

export type PocketTransaction = {
  id: string;
  name: string;
  meta: string;
  amount: string;
  icon: LucideIcon;
};

export const pocketRecords: PocketRecord[] = [
  {
    id: "kebutuhan-harian",
    name: "Kebutuhan Harian",
    used: "Rp785.000",
    limit: "Rp1.250.000",
    remaining: "Rp465.000",
    usedNumber: 785000,
    limitNumber: 1250000,
    progress: 63,
    status: "Aman",
    tone: "cyan",
    icon: ShoppingBasket,
    description: "Makan, transport harian, dan kebutuhan rutin kecil.",
  },
  {
    id: "tagihan",
    name: "Tagihan",
    used: "Rp430.000",
    limit: "Rp600.000",
    remaining: "Rp170.000",
    usedNumber: 430000,
    limitNumber: 600000,
    progress: 72,
    status: "Waspada",
    tone: "amber",
    icon: ReceiptText,
    description: "Internet, listrik, dan kewajiban bulanan.",
  },
  {
    id: "tabungan",
    name: "Tabungan",
    used: "Rp350.000",
    limit: "Rp500.000",
    remaining: "Rp150.000",
    usedNumber: 350000,
    limitNumber: 500000,
    progress: 70,
    status: "Aman",
    tone: "green",
    icon: Landmark,
    description: "Alokasi otomatis untuk simpanan bulanan.",
  },
  {
    id: "self-reward",
    name: "Self-Reward",
    used: "Rp270.000",
    limit: "Rp300.000",
    remaining: "Rp30.000",
    usedNumber: 270000,
    limitNumber: 300000,
    progress: 90,
    status: "Hampir Habis",
    tone: "purple",
    icon: Coffee,
    description: "Hiburan, kopi, langganan, dan hadiah kecil untuk diri sendiri.",
  },
  {
    id: "dana-darurat",
    name: "Dana Darurat",
    used: "Rp150.000",
    limit: "Rp500.000",
    remaining: "Rp350.000",
    usedNumber: 150000,
    limitNumber: 500000,
    progress: 30,
    status: "Aman",
    tone: "cyan",
    icon: Shield,
    description: "Cadangan aman untuk kondisi tidak terduga.",
  },
];

export const pocketOverview = {
  totalAllocation: "Rp3.150.000",
  insight:
    "Pengeluaran harian stabil. Surplus minggu ini sebaiknya dialihkan ke Tabungan atau Dana Darurat.",
};

export const selfRewardTransactions: PocketTransaction[] = [
  {
    id: "starbucks",
    name: "Starbucks Reserve",
    meta: "Sabtu, 14:30 - Kartu Debit",
    amount: "-Rp85.000",
    icon: Coffee,
  },
  {
    id: "cgv",
    name: "CGV Cinemas",
    meta: "Kamis, 19:15 - QRIS",
    amount: "-Rp120.000",
    icon: WalletCards,
  },
  {
    id: "spotify",
    name: "Spotify Premium",
    meta: "Senin, 08:00 - Auto-Debit",
    amount: "-Rp65.000",
    icon: ReceiptText,
  },
];

export function getPocketById(id: string): PocketRecord | undefined {
  return pocketRecords.find((pocket) => pocket.id === id);
}
