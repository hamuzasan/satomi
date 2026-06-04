import {
  BadgeDollarSign,
  BellRing,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Flag,
  Headphones,
  Landmark,
  Plane,
  Router,
  Shield,
  Sparkles,
  TrendingDown,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import { formatCurrency } from "@/src/lib/satomi-finance";
import type { DashboardTone } from "@/src/lib/satomi-dashboard-data";
import type { BillRow, GoalRow, PocketRow } from "@/src/lib/supabase/finance";

export type GoalTone = "cyan" | "purple" | "green" | "amber" | "error";
export type GoalStatus = "Goal Utama" | "Aktif" | "Butuh Fokus";
export type BillTone = "cyan" | "purple" | "green" | "amber" | "error";
export type BillStatus = "Belum dibayar" | "Sudah dibayar" | "Terjadwal" | "Diarsipkan";

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

export type GoalMilestone = {
  label: string;
  value: string;
  status: "Selesai" | "Berjalan" | "Menunggu";
};

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
});

const goalTypeIconMap: Record<string, LucideIcon> = {
  travel: Plane,
  emergency: Shield,
  debt: BadgeDollarSign,
  saving: Landmark,
  spending_control: TrendingDown,
  custom: Flag,
};

const billNameIconMap: Array<[RegExp, LucideIcon]> = [
  [/internet|wifi/i, Router],
  [/spotify|music|netflix/i, Headphones],
  [/cicilan|kartu|cc/i, CreditCard],
  [/listrik|air|pln/i, CalendarClock],
];

const goalTypeDescription: Record<string, string> = {
  travel: "Target perjalanan besar dengan ritme nabung bertahap yang tetap realistis.",
  emergency: "Cadangan aman untuk menjaga cashflow saat situasi mendadak datang.",
  debt: "Target pelunasan bertahap agar beban cicilan cepat turun dan momentum tetap terasa.",
  saving: "Tabungan jangka menengah yang dibangun dengan disiplin alokasi dari pemasukan aktif.",
  spending_control:
    "Goal pengendalian kebiasaan belanja supaya surplus bulanan terus naik secara konsisten.",
  custom: "Target finansial fleksibel yang bisa kamu sesuaikan dengan prioritas pribadi.",
};

export const strategyChips = [
  "Save More Tomorrow",
  "50/30/20",
  "Debt Snowball",
  "Loss Aversion Reminder",
];

export const goalTypeOptions = [
  { value: "travel", label: "Perjalanan" },
  { value: "emergency", label: "Dana Darurat" },
  { value: "debt", label: "Lunasi Utang" },
  { value: "saving", label: "Tabungan" },
  { value: "spending_control", label: "Kontrol Belanja" },
  { value: "custom", label: "Custom" },
];

export const billFrequencyOptions = [
  { value: "monthly", label: "Bulanan" },
  { value: "weekly", label: "Mingguan" },
  { value: "yearly", label: "Tahunan" },
  { value: "one_time", label: "Sekali" },
  { value: "custom", label: "Custom" },
];

export const billStatusOptions = [
  { value: "unpaid", label: "Belum dibayar" },
  { value: "scheduled", label: "Terjadwal" },
  { value: "paid", label: "Sudah dibayar" },
  { value: "archived", label: "Diarsipkan" },
];

export function formatGoalDeadline(targetDate: string | null) {
  if (!targetDate) {
    return "Tanpa deadline";
  }

  const target = new Date(targetDate);
  if (Number.isNaN(target.getTime())) {
    return "Tanpa deadline";
  }

  const now = new Date();
  const diffDays = Math.ceil((target.getTime() - now.getTime()) / 86400000);

  if (diffDays <= 0) {
    return "Jatuh tempo hari ini";
  }

  if (diffDays < 30) {
    return `${diffDays} hari lagi`;
  }

  const months = Math.max(1, Math.round(diffDays / 30));
  return `${months} bulan lagi`;
}

export function calculateGoalProgress(goal: Pick<GoalRow, "current_amount" | "target_amount">) {
  if (goal.target_amount <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100)));
}

export function calculateGoalRequiredSaving(goal: Pick<GoalRow, "current_amount" | "target_amount" | "target_date">) {
  const remaining = Math.max(goal.target_amount - goal.current_amount, 0);
  if (remaining <= 0) {
    return "Target tercapai";
  }

  if (!goal.target_date) {
    return `${formatCurrency(remaining)} tersisa`;
  }

  const targetDate = new Date(goal.target_date);
  if (Number.isNaN(targetDate.getTime())) {
    return `${formatCurrency(remaining)} tersisa`;
  }

  const diffDays = Math.max(1, Math.ceil((targetDate.getTime() - Date.now()) / 86400000));
  const daily = Math.ceil(remaining / diffDays);
  return `${formatCurrency(daily)}/hari`;
}

export function mapGoalTone(goal: GoalRow, progress: number): GoalTone {
  if (goal.goal_type === "emergency") return "green";
  if (goal.goal_type === "debt") return "purple";
  if (goal.goal_type === "spending_control") return "amber";
  if (progress >= 100) return "green";
  if (progress >= 70) return "cyan";
  return "cyan";
}

export function mapGoalStatus(goals: GoalRow[], goal: GoalRow, progress: number): GoalStatus {
  const sorted = [...goals].sort((left, right) => right.target_amount - left.target_amount);
  if (sorted[0]?.id === goal.id) return "Goal Utama";
  if (progress < 25) return "Butuh Fokus";
  return "Aktif";
}

export function mapGoalRowToRecord(goals: GoalRow[], goal: GoalRow): GoalRecord {
  const progress = calculateGoalProgress(goal);
  return {
    id: goal.id,
    name: goal.name,
    current: formatCurrency(goal.current_amount),
    target: formatCurrency(goal.target_amount),
    deadline: formatGoalDeadline(goal.target_date),
    requiredSaving: calculateGoalRequiredSaving(goal),
    progress,
    strategy: goal.strategy?.trim() || "Save More Tomorrow",
    status: mapGoalStatus(goals, goal, progress),
    tone: mapGoalTone(goal, progress),
    icon: goalTypeIconMap[goal.goal_type] ?? Flag,
    description:
      goalTypeDescription[goal.goal_type] ?? goalTypeDescription.custom,
  };
}

export function buildGoalMilestones(goal: GoalRow): GoalMilestone[] {
  const checkpoints = [25, 50, 75, 100];
  const progress = calculateGoalProgress(goal);

  return checkpoints.map((checkpoint) => {
    const amount = Math.round((goal.target_amount * checkpoint) / 100);
    let status: GoalMilestone["status"] = "Menunggu";
    if (progress >= checkpoint) status = "Selesai";
    else if (progress >= checkpoint - 25) status = "Berjalan";

    return {
      label: checkpoint === 100 ? "Target akhir" : `Checkpoint ${checkpoint}%`,
      value: formatCurrency(amount),
      status,
    };
  });
}

export function buildGoalFundingSources(goal: GoalRow) {
  const remaining = Math.max(goal.target_amount - goal.current_amount, 0);
  return [
    { label: "Setoran rutin", value: calculateGoalRequiredSaving(goal), icon: CalendarDays },
    { label: "Surplus bulanan", value: formatCurrency(Math.ceil(remaining / 4 || 0)), icon: Flag },
    { label: "Momentum tambahan", value: goal.strategy?.trim() || "Save More Tomorrow", icon: Sparkles },
  ];
}

export function buildGoalActivities(goal: GoalRow) {
  const progress = calculateGoalProgress(goal);
  return [
    {
      id: `${goal.id}-current`,
      title: "Dana terkumpul terbaru",
      meta: `${progress}% dari target aktif`,
      amount: formatCurrency(goal.current_amount),
      icon: Landmark,
    },
    {
      id: `${goal.id}-remaining`,
      title: "Sisa dana yang dibutuhkan",
      meta: formatGoalDeadline(goal.target_date),
      amount: formatCurrency(Math.max(goal.target_amount - goal.current_amount, 0)),
      icon: BellRing,
    },
    {
      id: `${goal.id}-strategy`,
      title: "Strategi aktif",
      meta: "Satomi membaca pola ini sebagai fokus utama",
      amount: goal.strategy?.trim() || "Save More Tomorrow",
      icon: Sparkles,
    },
  ];
}

export function formatBillDateLabel(dateValue: string) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return "Tanpa tanggal";
  }

  return shortDateFormatter.format(date);
}

export function formatBillDueLabel(dateValue: string, status: BillRow["status"]) {
  if (status === "paid") {
    return "Sudah dibayar";
  }

  if (status === "archived") {
    return "Sudah diarsipkan";
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return "Tanggal belum valid";
  }

  const diffDays = Math.ceil((date.getTime() - Date.now()) / 86400000);

  if (diffDays <= 0) {
    return "Jatuh tempo hari ini";
  }

  if (status === "scheduled") {
    return `Terjadwal ${diffDays} hari lagi`;
  }

  return `Jatuh tempo ${diffDays} hari lagi`;
}

export function mapBillStatus(status: BillRow["status"]): BillStatus {
  switch (status) {
    case "paid":
      return "Sudah dibayar";
    case "scheduled":
      return "Terjadwal";
    case "archived":
      return "Diarsipkan";
    default:
      return "Belum dibayar";
  }
}

export function mapBillTone(bill: BillRow): BillTone {
  if (bill.status === "paid") return "green";
  if (bill.status === "scheduled") return "amber";

  const dueDate = new Date(bill.due_date);
  const diffDays = Math.ceil((dueDate.getTime() - Date.now()) / 86400000);

  if (diffDays <= 3) return "error";
  if (diffDays <= 10) return "purple";
  return "cyan";
}

export function mapBillIcon(name: string) {
  return billNameIconMap.find(([pattern]) => pattern.test(name))?.[1] ?? WalletCards;
}

export function mapBillRowToRecord(
  bill: BillRow,
  pocketNameById: Map<string, string>,
): BillRecord {
  const tone = mapBillTone(bill);
  return {
    id: bill.id,
    name: bill.name,
    amount: formatCurrency(bill.amount),
    dueDate: formatBillDateLabel(bill.due_date),
    dueLabel: formatBillDueLabel(bill.due_date, bill.status),
    status: mapBillStatus(bill.status),
    source: bill.pocket_id
      ? (pocketNameById.get(bill.pocket_id) ?? "Pocket tidak ditemukan")
      : "Tanpa Pocket",
    tone,
    icon: mapBillIcon(bill.name),
  };
}

export function buildBillSummary(bills: BillRow[]) {
  const total = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const paid = bills.filter((bill) => bill.status === "paid");
  const unpaid = bills.filter((bill) => bill.status === "unpaid");
  const scheduled = bills.filter((bill) => bill.status === "scheduled");

  return [
    {
      label: "Total tagihan",
      value: formatCurrency(total),
      detail: "Data aktif",
      tone: "cyan" as const,
      icon: WalletCards,
    },
    {
      label: "Sudah dibayar",
      value: formatCurrency(paid.reduce((sum, bill) => sum + bill.amount, 0)),
      detail: `${paid.length} tagihan`,
      tone: "green" as const,
      icon: CheckCircle2,
    },
    {
      label: "Belum dibayar",
      value: formatCurrency(unpaid.reduce((sum, bill) => sum + bill.amount, 0)),
      detail: `${unpaid.length} tagihan`,
      tone: "error" as const,
      icon: CalendarClock,
    },
    {
      label: "Terjadwal",
      value: formatCurrency(scheduled.reduce((sum, bill) => sum + bill.amount, 0)),
      detail: `${scheduled.length} tagihan`,
      tone: "amber" as const,
      icon: CalendarClock,
    },
  ];
}

export function buildBillInsight(bills: BillRow[], pockets: PocketRow[]) {
  const pocketNameById = new Map(pockets.map((pocket) => [pocket.id, pocket.name]));
  const dueSoon = [...bills]
    .filter((bill) => bill.status === "unpaid" || bill.status === "scheduled")
    .sort((left, right) => left.due_date.localeCompare(right.due_date))[0];

  if (!dueSoon) {
    return "Belum ada tagihan aktif. Tambahkan tagihan rutin agar Satomi bisa menjaga ritme pembayaranmu.";
  }

  const source = dueSoon.pocket_id
    ? (pocketNameById.get(dueSoon.pocket_id) ?? "pocket terkait")
    : "alokasi umum";

  return `${dueSoon.name} menjadi tagihan terdekatmu. Satomi sarankan cek ${source} sebelum ${formatBillDateLabel(dueSoon.due_date)} agar cashflow tetap rapi.`;
}

export function buildDashboardGoal(goals: GoalRow[]) {
  const goal = [...goals].sort((left, right) => right.target_amount - left.target_amount)[0];

  if (!goal) {
    return null;
  }

  return {
    name: goal.name,
    amount: formatCurrency(goal.current_amount),
    target: formatCurrency(goal.target_amount),
    progress: calculateGoalProgress(goal),
  };
}

export function buildDashboardBillsDueSoon(
  bills: BillRow[],
  pockets: PocketRow[],
) {
  const pocketNameById = new Map(pockets.map((pocket) => [pocket.id, pocket.name]));
  return bills
    .filter((bill) => bill.status === "unpaid" || bill.status === "scheduled")
    .sort((left, right) => left.due_date.localeCompare(right.due_date))
    .slice(0, 3)
    .map((bill) => ({
      name: bill.name,
      amount: formatCurrency(bill.amount),
      due: `${formatBillDueLabel(bill.due_date, bill.status)}${
        bill.pocket_id ? ` - ${pocketNameById.get(bill.pocket_id) ?? "Tanpa Pocket"}` : ""
      }`,
    }));
}

export function getDashboardGoalTone(progress: number): DashboardTone {
  if (progress >= 100) return "green";
  if (progress >= 60) return "cyan";
  if (progress >= 30) return "amber";
  return "purple";
}

export function formatFullDate(dateValue: string | null) {
  if (!dateValue) return "Tanpa tanggal";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Tanpa tanggal";
  return dateFormatter.format(date);
}
