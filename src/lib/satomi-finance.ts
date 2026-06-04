import {
  BanknoteArrowDown,
  CircleAlert,
  Coffee,
  Landmark,
  ReceiptText,
  Shield,
  ShoppingBasket,
  TrainFront,
  Trophy,
  Utensils,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import type { DashboardTone } from "@/src/lib/satomi-dashboard-data";
import type { PocketRecord, PocketStatus, PocketTone } from "@/src/lib/satomi-pockets-data";
import type { TransactionRecord } from "@/src/lib/satomi-transactions-data";
import type { Tables } from "@/src/lib/supabase/types";

type PocketRow = Tables<"pockets">;
type TransactionRow = Tables<"transactions">;

const currencyFormatter = new Intl.NumberFormat("id-ID");
const timeFormatter = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
});
const dateLabelFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
});

const pocketIconMap: Record<string, LucideIcon> = {
  coffee: Coffee,
  landmark: Landmark,
  receipt: ReceiptText,
  shield: Shield,
  shopping: ShoppingBasket,
  trophy: Trophy,
  wallet: WalletCards,
};

export function formatCurrency(amount: number) {
  const normalized = Number.isFinite(amount) ? Math.round(amount) : 0;
  return `Rp${currencyFormatter.format(Math.abs(normalized))}`;
}

export function formatSignedCurrency(amount: number) {
  const sign = amount < 0 ? "-" : amount > 0 ? "+" : "";
  return `${sign}${formatCurrency(amount)}`;
}

export function formatCompactDateLabel(dateValue: string) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return "Tanpa tanggal";
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTarget = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round(
    (startOfToday.getTime() - startOfTarget.getTime()) / 86400000,
  );

  if (diffDays === 0) {
    return "Hari Ini";
  }

  if (diffDays === 1) {
    return "Kemarin";
  }

  return dateLabelFormatter.format(date);
}

export function formatTimeLabel(dateValue: string) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return "--:--";
  }

  return timeFormatter.format(date);
}

export function getTransactionSignedAmount(transaction: TransactionRow) {
  return transaction.type === "income" ? transaction.amount : -transaction.amount;
}

export function mapTransactionCategoryIcon(category: string, type: TransactionRow["type"]) {
  const normalized = category.toLowerCase();

  if (type === "income") return BanknoteArrowDown;
  if (normalized.includes("makan")) return Utensils;
  if (normalized.includes("kopi") || normalized.includes("reward")) return Coffee;
  if (normalized.includes("transport")) return TrainFront;
  if (normalized.includes("tagihan")) return ReceiptText;

  return WalletCards;
}

export function mapPocketIcon(iconName: string, type: string) {
  if (pocketIconMap[iconName]) {
    return pocketIconMap[iconName];
  }

  if (type === "saving") return Landmark;
  if (type === "bill") return ReceiptText;
  if (type === "emergency") return Shield;
  if (type === "income") return BanknoteArrowDown;

  return WalletCards;
}

export function getPocketStatus(progress: number): PocketStatus {
  if (progress > 100) return "Lewat Batas";
  if (progress >= 85) return "Hampir Habis";
  if (progress >= 70) return "Waspada";
  return "Aman";
}

export function getPocketTone(
  progress: number,
  type: string,
  color: string,
): PocketTone {
  const normalizedColor = color.toLowerCase();

  if (normalizedColor.includes("amber") || normalizedColor.includes("yellow")) {
    return "amber";
  }

  if (normalizedColor.includes("green")) {
    return "green";
  }

  if (normalizedColor.includes("purple") || normalizedColor.includes("violet")) {
    return "purple";
  }

  if (progress > 100) return "error";
  if (type === "saving" || type === "emergency" || type === "income") return "green";
  if (progress >= 85) return "purple";
  if (progress >= 70) return "amber";
  return "cyan";
}

export function getPocketDescription(type: string, name: string) {
  switch (type) {
    case "bill":
      return "Internet, listrik, dan kewajiban bulanan lain yang perlu dijaga ritmenya.";
    case "saving":
      return "Alokasi rutin untuk menabung secara konsisten dari pemasukan yang masuk.";
    case "emergency":
      return "Cadangan aman untuk keadaan mendadak tanpa mengganggu pocket lain.";
    case "income":
      return "Menampung pemasukan yang masuk sebelum dialokasikan ke pocket lain.";
    default:
      if (name.toLowerCase().includes("reward")) {
        return "Hiburan, kopi, dan hadiah kecil untuk diri sendiri.";
      }

      return "Pocket fleksibel untuk pengeluaran harian dan alokasi personal.";
  }
}

export function buildPocketUsageMap(
  transactions: TransactionRow[],
  pockets: Pick<PocketRow, "id" | "type">[],
) {
  const typeByPocketId = new Map(pockets.map((pocket) => [pocket.id, pocket.type]));
  const usage = new Map<string, number>();

  for (const transaction of transactions) {
    if (!transaction.pocket_id) continue;

    const pocketType = typeByPocketId.get(transaction.pocket_id) ?? "spending";
    const previous = usage.get(transaction.pocket_id) ?? 0;
    const amount = transaction.amount;

    if (pocketType === "saving" || pocketType === "emergency" || pocketType === "income") {
      const delta = transaction.type === "income" ? amount : -amount;
      usage.set(transaction.pocket_id, Math.max(previous + delta, 0));
      continue;
    }

    const delta = transaction.type === "expense" ? amount : 0;
    usage.set(transaction.pocket_id, previous + delta);
  }

  return usage;
}

export function mapPocketRowToRecord(
  pocket: PocketRow,
  transactions: TransactionRow[],
): PocketRecord {
  const usageMap = buildPocketUsageMap(transactions, [pocket]);
  const usedNumber = usageMap.get(pocket.id) ?? pocket.current_amount ?? 0;
  const limitNumber = pocket.budget_limit ?? 0;
  const progress = limitNumber > 0 ? Math.round((usedNumber / limitNumber) * 100) : 0;
  const tone = getPocketTone(progress, pocket.type, pocket.color);
  const remainingNumber = Math.max(limitNumber - usedNumber, 0);

  return {
    id: pocket.id,
    name: pocket.name,
    used: formatCurrency(usedNumber),
    limit: formatCurrency(limitNumber),
    remaining: formatCurrency(remainingNumber),
    usedNumber,
    limitNumber,
    progress,
    status: getPocketStatus(progress),
    tone,
    icon: mapPocketIcon(pocket.icon, pocket.type),
    description: getPocketDescription(pocket.type, pocket.name),
  };
}

export function mapTransactionRowToRecord(
  transaction: TransactionRow,
  pocketNameById: Map<string, string>,
): TransactionRecord {
  const signedAmount = getTransactionSignedAmount(transaction);

  return {
    id: transaction.id,
    name: transaction.description || transaction.category,
    category: transaction.category,
    amount: formatSignedCurrency(signedAmount),
    rawAmount: signedAmount,
    type: transaction.type === "income" ? "Masuk" : "Keluar",
    dateGroup: formatCompactDateLabel(transaction.transaction_date),
    time: formatTimeLabel(transaction.transaction_date),
    pocket: transaction.pocket_id
      ? (pocketNameById.get(transaction.pocket_id) ?? "Pocket tidak ditemukan")
      : "Tanpa Pocket",
    note: transaction.description || "Tidak ada catatan tambahan.",
    icon: mapTransactionCategoryIcon(transaction.category, transaction.type),
  };
}

export function buildTransactionSummary(transactions: TransactionRow[]) {
  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const expense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const delta = income - expense;

  return [
    {
      label: "Total Masuk",
      value: formatCurrency(income),
      detail: `${transactions.filter((transaction) => transaction.type === "income").length} transaksi`,
      tone: "green" as const,
      icon: BanknoteArrowDown,
    },
    {
      label: "Total Keluar",
      value: formatCurrency(expense),
      detail: `${transactions.filter((transaction) => transaction.type === "expense").length} transaksi`,
      tone: "purple" as const,
      icon: WalletCards,
    },
    {
      label: "Selisih",
      value: formatSignedCurrency(delta),
      detail: "Periode aktif",
      tone: delta >= 0 ? ("cyan" as const) : ("error" as const),
      icon: ReceiptText,
    },
    {
      label: "Jumlah Tx",
      value: `${transactions.length}`,
      detail: "Data Supabase",
      tone: "amber" as const,
      icon: ReceiptText,
    },
  ];
}

export function buildPocketOverview(pockets: PocketRecord[]) {
  const totalAllocation = pockets.reduce((sum, pocket) => sum + pocket.limitNumber, 0);
  const atRisk = pockets.filter((pocket) => pocket.progress >= 70).length;

  return {
    totalAllocation: formatCurrency(totalAllocation),
    insight:
      pockets.length === 0
        ? "Belum ada pocket aktif. Tambahkan pocket pertama agar Satomi bisa memberi alokasi dan insight."
        : atRisk > 0
          ? `${atRisk} pocket mulai butuh perhatian. Pertimbangkan rapikan limit atau pindahkan prioritas pengeluaran.`
          : "Struktur pocket kamu masih rapi. Satomi melihat alokasi bulan ini relatif sehat.",
  };
}

export function buildDashboardSummary(
  transactions: TransactionRow[],
  pockets: PocketRecord[],
) {
  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const expense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const budgetLeft = Math.max(income - expense, 0);
  const riskyPockets = pockets.filter((pocket) => pocket.progress >= 70).length;

  return [
    {
      label: "Total Pemasukan",
      value: formatCurrency(income),
      detail: "Data aktif",
      tone: "green" as DashboardTone,
      icon: BanknoteArrowDown,
    },
    {
      label: "Total Pengeluaran",
      value: formatCurrency(expense),
      detail: "Data aktif",
      tone: "purple" as DashboardTone,
      icon: WalletCards,
    },
    {
      label: "Sisa Budget",
      value: formatCurrency(budgetLeft),
      detail: budgetLeft > 0 ? "Masih aman" : "Perlu perhatian",
      tone: budgetLeft > 0 ? ("cyan" as DashboardTone) : ("error" as DashboardTone),
      icon: WalletCards,
    },
    {
      label: "Pocket Berisiko",
      value: `${riskyPockets} Pocket`,
      detail: riskyPockets > 0 ? "Butuh perhatian" : "Masih stabil",
      tone: riskyPockets > 0 ? ("error" as DashboardTone) : ("green" as DashboardTone),
      icon: CircleAlert,
    },
  ];
}

export function buildDashboardPockets(pockets: PocketRecord[]) {
  return pockets.slice(0, 5).map((pocket) => ({
    name: pocket.name,
    amount: pocket.used,
    limit: pocket.limit,
    progress: pocket.progress,
    tone: pocket.tone as DashboardTone,
    icon: pocket.icon,
  }));
}

export function buildDashboardRecentTransactions(
  transactions: TransactionRow[],
  pocketNameById: Map<string, string>,
) {
  return transactions.slice(0, 5).map((transaction) => ({
    name: transaction.description || transaction.category,
    amount: formatSignedCurrency(getTransactionSignedAmount(transaction)),
    meta: transaction.pocket_id
      ? (pocketNameById.get(transaction.pocket_id) ?? transaction.category)
      : transaction.category,
    type: transaction.type === "income" ? ("income" as const) : ("expense" as const),
    icon: mapTransactionCategoryIcon(transaction.category, transaction.type),
  }));
}

export function buildPocketNudge(pockets: PocketRecord[]) {
  const riskyPocket = [...pockets].sort((left, right) => right.progress - left.progress)[0];

  if (!riskyPocket || riskyPocket.progress < 70) {
    return "Ritme pocket kamu masih sehat. Satomi belum melihat tanda pengeluaran yang mengkhawatirkan.";
  }

  return `Pocket ${riskyPocket.name} kamu sudah ${riskyPocket.progress}% terpakai. Kalau ada pengeluaran tambahan dalam kategori ini, limit bulan ini bisa cepat menipis.`;
}
