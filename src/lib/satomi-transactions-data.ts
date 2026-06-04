import {
  BanknoteArrowDown,
  Coffee,
  ReceiptText,
  TrainFront,
  Utensils,
  WalletCards,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type TransactionType = "Masuk" | "Keluar";

export type TransactionRecord = {
  id: string;
  name: string;
  category: string;
  amount: string;
  rawAmount: number;
  type: TransactionType;
  dateGroup: string;
  time: string;
  pocket: string;
  note: string;
  icon: LucideIcon;
};

export const transactionSummary = [
  {
    label: "Total Masuk",
    value: "Rp500.000",
    detail: "1 transaksi",
    tone: "green" as const,
    icon: BanknoteArrowDown,
  },
  {
    label: "Total Keluar",
    value: "Rp358.000",
    detail: "4 transaksi",
    tone: "purple" as const,
    icon: WalletCards,
  },
  {
    label: "Selisih",
    value: "+Rp142.000",
    detail: "Minggu ini",
    tone: "cyan" as const,
    icon: ReceiptText,
  },
  {
    label: "Jumlah Tx",
    value: "5",
    detail: "Dummy data",
    tone: "amber" as const,
    icon: ReceiptText,
  },
];

export const transactionRecords: TransactionRecord[] = [
  {
    id: "ayam-geprek",
    name: "Ayam geprek",
    category: "Makanan",
    amount: "-Rp35.000",
    rawAmount: -35000,
    type: "Keluar",
    dateGroup: "Hari Ini",
    time: "12:30",
    pocket: "Kebutuhan Harian",
    note: "Makan siang",
    icon: Utensils,
  },
  {
    id: "kopi-susu",
    name: "Kopi susu",
    category: "Self-Reward",
    amount: "-Rp28.000",
    rawAmount: -28000,
    type: "Keluar",
    dateGroup: "Hari Ini",
    time: "10:15",
    pocket: "Self-Reward",
    note: "Kopi pagi",
    icon: Coffee,
  },
  {
    id: "gaji-freelance",
    name: "Gaji freelance",
    category: "Pemasukan",
    amount: "+Rp500.000",
    rawAmount: 500000,
    type: "Masuk",
    dateGroup: "Hari Ini",
    time: "09:15",
    pocket: "Utama",
    note: "Pembayaran proyek",
    icon: BanknoteArrowDown,
  },
  {
    id: "internet-rumah",
    name: "Internet rumah",
    category: "Tagihan",
    amount: "-Rp250.000",
    rawAmount: -250000,
    type: "Keluar",
    dateGroup: "Kemarin",
    time: "18:20",
    pocket: "Tagihan",
    note: "Tagihan bulanan",
    icon: ReceiptText,
  },
  {
    id: "krl",
    name: "KRL",
    category: "Transportasi",
    amount: "-Rp15.000",
    rawAmount: -15000,
    type: "Keluar",
    dateGroup: "Kemarin",
    time: "07:40",
    pocket: "Kebutuhan Harian",
    note: "Transport kerja",
    icon: TrainFront,
  },
];

export const dateFilters = ["Bulan Ini", "7 Hari Terakhir", "Hari Ini"];
export const typeFilters = ["Semua Tipe", "Masuk", "Keluar"];
export const categoryFilters = [
  "Semua Kategori",
  "Makanan",
  "Self-Reward",
  "Pemasukan",
  "Tagihan",
  "Transportasi",
];
