import {
  Bot,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import {
  buildDashboardRecentTransactions,
  buildDashboardPockets,
  formatCurrency,
  mapPocketRowToRecord,
  mapTransactionCategoryIcon,
} from "@/src/lib/satomi-finance";
import {
  buildDashboardBillsDueSoon,
  buildDashboardGoal,
} from "@/src/lib/satomi-goals-bills";
import type {
  BillRow,
  GoalRow,
  NudgeRow,
  PocketRow,
  TransactionRow,
} from "@/src/lib/supabase/finance";
import type { DashboardTone } from "@/src/lib/satomi-dashboard-data";
import type { InsightTone } from "@/src/lib/satomi-insights-data";

export type CategoryInsightLive = {
  label: string;
  amount: string;
  amountNumber: number;
  percent: number;
  tone: InsightTone;
  icon: LucideIcon;
};

export type WeeklyPointLive = {
  day: string;
  amount: string;
  amountNumber: number;
  height: number;
};

export type NudgeHistoryLive = {
  id: string;
  title: string;
  description: string;
  time: string;
  tone: InsightTone;
  icon: LucideIcon;
};

export type ReinforcementCardLive = {
  id: string;
  title: string;
  description: string;
  value: string;
  icon: LucideIcon;
};

const toneCycle: InsightTone[] = ["cyan", "purple", "amber", "green", "error"];
const weekdayFormatter = new Intl.DateTimeFormat("id-ID", { weekday: "short" });
const relativeDateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
});

function startOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

function isWithinRange(dateValue: string, start: Date, end: Date) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return false;
  return date >= start && date <= end;
}

function sumAmounts(transactions: TransactionRow[]) {
  return transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
}

function getNudgeTone(severity: string): InsightTone {
  switch (severity) {
    case "critical":
      return "error";
    case "warning":
      return "amber";
    case "success":
      return "green";
    default:
      return "cyan";
  }
}

function formatRelativeNudgeDate(dateValue: string) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Waktu tidak tersedia";

  const diffDays = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (diffDays <= 0) return "Hari ini";
  if (diffDays === 1) return "Kemarin";
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return relativeDateFormatter.format(date);
}

export function getCurrentMonthTransactions(transactions: TransactionRow[]) {
  const start = startOfMonth();
  const end = endOfMonth();
  return transactions.filter((transaction) =>
    isWithinRange(transaction.transaction_date, start, end),
  );
}

export function buildDashboardMonthlySummary(
  transactions: TransactionRow[],
  pocketRecords: Array<ReturnType<typeof mapPocketRowToRecord>>,
) {
  const monthTransactions = getCurrentMonthTransactions(transactions);
  const income = sumAmounts(monthTransactions.filter((item) => item.type === "income"));
  const expense = sumAmounts(monthTransactions.filter((item) => item.type === "expense"));
  const budgetLeft = income - expense;
  const riskyPockets = pocketRecords.filter((pocket) => pocket.progress >= 70).length;

  return [
    {
      label: "Total Pemasukan",
      value: formatCurrency(income),
      detail: "Bulan ini",
      tone: "green" as DashboardTone,
      icon: TrendingUp,
    },
    {
      label: "Total Pengeluaran",
      value: formatCurrency(expense),
      detail: "Bulan ini",
      tone: "purple" as DashboardTone,
      icon: TrendingDown,
    },
    {
      label: "Sisa Budget",
      value: budgetLeft >= 0 ? formatCurrency(budgetLeft) : `-${formatCurrency(Math.abs(budgetLeft))}`,
      detail: budgetLeft >= 0 ? "Masih aman" : "Perlu perhatian",
      tone: budgetLeft >= 0 ? ("cyan" as DashboardTone) : ("error" as DashboardTone),
      icon: Bot,
    },
    {
      label: "Pocket Berisiko",
      value: `${riskyPockets} Pocket`,
      detail: riskyPockets > 0 ? "Butuh perhatian" : "Masih stabil",
      tone: riskyPockets > 0 ? ("error" as DashboardTone) : ("green" as DashboardTone),
      icon: Lightbulb,
    },
  ];
}

export function buildDashboardViewModel({
  transactions,
  pockets,
  goals,
  bills,
}: {
  transactions: TransactionRow[];
  pockets: PocketRow[];
  goals: GoalRow[];
  bills: BillRow[];
}) {
  const pocketRecords = pockets.map((pocket) => mapPocketRowToRecord(pocket, transactions));
  const summary = buildDashboardMonthlySummary(transactions, pocketRecords);
  const pocketCards = buildDashboardPockets(pocketRecords);
  const pocketNameById = new Map(pockets.map((pocket) => [pocket.id, pocket.name]));
  const recentTransactions = buildDashboardRecentTransactions(transactions, pocketNameById);
  const dashboardGoal = buildDashboardGoal(goals);
  const billsDueSoon = buildDashboardBillsDueSoon(bills, pockets);
  return {
    summary,
    pocketRecords,
    pocketCards,
    recentTransactions,
    dashboardGoal,
    billsDueSoon,
    pocketNameById,
  };
}

export function buildCategoryInsights(transactions: TransactionRow[]) {
  const expenses = getCurrentMonthTransactions(transactions).filter(
    (transaction) => transaction.type === "expense",
  );
  const totalExpense = sumAmounts(expenses);
  const totals = new Map<string, number>();

  for (const transaction of expenses) {
    const key = transaction.category.trim() || "Tanpa kategori";
    totals.set(key, (totals.get(key) ?? 0) + transaction.amount);
  }

  return [...totals.entries()]
    .sort((left, right) => right[1] - left[1])
    .map(([label, amount], index) => ({
      label,
      amount: formatCurrency(amount),
      amountNumber: amount,
      percent: totalExpense > 0 ? Math.max(1, Math.round((amount / totalExpense) * 100)) : 0,
      tone: toneCycle[index % toneCycle.length],
      icon: mapTransactionCategoryIcon(label, "expense"),
    }));
}

export function buildWeeklySpendingTrend(transactions: TransactionRow[]) {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    return date;
  });

  const expenseByDay = new Map<string, number>();

  for (const transaction of transactions) {
    if (transaction.type !== "expense") continue;
    const date = new Date(transaction.transaction_date);
    if (Number.isNaN(date.getTime())) continue;
    const key = date.toISOString().slice(0, 10);
    expenseByDay.set(key, (expenseByDay.get(key) ?? 0) + transaction.amount);
  }

  const points = days.map((date) => {
    const key = date.toISOString().slice(0, 10);
    const amountNumber = expenseByDay.get(key) ?? 0;
    return {
      day: weekdayFormatter.format(date),
      amount: formatCurrency(amountNumber),
      amountNumber,
      height: 0,
    };
  });

  const max = Math.max(...points.map((point) => point.amountNumber), 0);

  return points.map((point) => ({
    ...point,
    height: max > 0 ? Math.max(16, Math.round((point.amountNumber / max) * 100)) : 16,
  }));
}

export function buildWeeklyComparison(transactions: TransactionRow[]) {
  const today = new Date();
  const startThisWeek = new Date(today);
  startThisWeek.setDate(today.getDate() - 6);
  startThisWeek.setHours(0, 0, 0, 0);

  const startLastWeek = new Date(startThisWeek);
  startLastWeek.setDate(startThisWeek.getDate() - 7);
  const endLastWeek = new Date(startThisWeek);
  endLastWeek.setMilliseconds(-1);

  const thisWeek = transactions.filter(
    (transaction) =>
      transaction.type === "expense" &&
      isWithinRange(transaction.transaction_date, startThisWeek, today),
  );
  const lastWeek = transactions.filter(
    (transaction) =>
      transaction.type === "expense" &&
      isWithinRange(transaction.transaction_date, startLastWeek, endLastWeek),
  );

  const thisWeekTotal = sumAmounts(thisWeek);
  const lastWeekTotal = sumAmounts(lastWeek);
  const delta = thisWeekTotal - lastWeekTotal;
  const percent = lastWeekTotal > 0 ? Math.round((delta / lastWeekTotal) * 100) : thisWeekTotal > 0 ? 100 : 0;

  return {
    thisWeekTotal,
    lastWeekTotal,
    delta,
    percent,
    isUp: delta >= 0,
    summary:
      lastWeekTotal === 0 && thisWeekTotal === 0
        ? "Belum ada pengeluaran yang cukup untuk dibandingkan."
        : delta > 0
          ? "Pengeluaran total kamu meningkat dibanding minggu lalu."
          : delta < 0
            ? "Pengeluaran total kamu menurun dibanding minggu lalu."
            : "Pengeluaran total kamu stabil dibanding minggu lalu.",
  };
}

export function buildAiInsightRecommendation(
  categoryInsights: CategoryInsightLive[],
  weeklyComparison: ReturnType<typeof buildWeeklyComparison>,
  activeGoal: ReturnType<typeof buildDashboardGoal>,
) {
  if (categoryInsights.length === 0) {
    return "Belum ada cukup transaksi untuk dibaca. Setelah kamu mencatat beberapa pengeluaran, Satomi akan mulai memberi insight yang lebih personal.";
  }

  const topCategory = categoryInsights[0];
  const goalText = activeGoal ? ` agar target ${activeGoal.name} tetap bergerak` : "";

  if (weeklyComparison.delta > 0) {
    return `Pengeluaran ${topCategory.label.toLowerCase()} jadi porsi terbesar bulan ini (${topCategory.percent}%). Satomi menyarankan rem sedikit kategori ini selama beberapa hari ke depan${goalText}.`;
  }

  return `Pengeluaran ${topCategory.label.toLowerCase()} masih jadi kategori terbesar, tapi ritmenya lebih terjaga minggu ini. Pertahankan pola ini${goalText}.`;
}

export function buildPositiveReinforcements({
  goals,
  bills,
  pockets,
}: {
  goals: GoalRow[];
  bills: BillRow[];
  pockets: Array<ReturnType<typeof mapPocketRowToRecord>>;
}) {
  const items: ReinforcementCardLive[] = [];
  const paidBills = bills.filter((bill) => bill.status === "paid");
  const healthyPockets = pockets.filter((pocket) => pocket.progress < 70);
  const progressingGoal = [...goals].sort((left, right) => right.current_amount - left.current_amount)[0];

  if (paidBills.length > 0) {
    items.push({
      id: "paid-bills",
      title: "Tagihan lebih tertib",
      description: `${paidBills.length} tagihan sudah ditandai lunas di bulan ini.`,
      value: `${paidBills.length} lunas`,
      icon: ShieldCheck,
    });
  }

  if (healthyPockets.length > 0) {
    items.push({
      id: "healthy-pockets",
      title: "Pocket masih sehat",
      description: `${healthyPockets.length} pocket masih berada di bawah ambang waspada.`,
      value: `${healthyPockets.length} aman`,
      icon: TrendingDown,
    });
  }

  if (progressingGoal) {
    items.push({
      id: "goal-progress",
      title: "Goal terus bergerak",
      description: `${progressingGoal.name} sudah mengumpulkan ${formatCurrency(progressingGoal.current_amount)} dari target aktifnya.`,
      value: formatCurrency(progressingGoal.current_amount),
      icon: Sparkles,
    });
  }

  return items.slice(0, 3);
}

export function buildNudgeHistory(nudges: NudgeRow[]) {
  return nudges.slice(0, 6).map((nudge) => ({
    id: nudge.id,
    title: nudge.title,
    description: nudge.message,
    time: formatRelativeNudgeDate(nudge.created_at),
    tone: getNudgeTone(nudge.severity),
    icon:
      nudge.severity === "critical"
        ? TrendingUp
        : nudge.severity === "warning"
          ? Lightbulb
          : nudge.severity === "success"
            ? Sparkles
            : Bot,
  }));
}

export function buildInsightsViewModel({
  transactions,
  pockets,
  goals,
  bills,
  nudges,
}: {
  transactions: TransactionRow[];
  pockets: PocketRow[];
  goals: GoalRow[];
  bills: BillRow[];
  nudges: NudgeRow[];
}) {
  const categoryInsights = buildCategoryInsights(transactions);
  const weeklyTrend = buildWeeklySpendingTrend(transactions);
  const weeklyComparison = buildWeeklyComparison(transactions);
  const pocketRecords = pockets.map((pocket) => mapPocketRowToRecord(pocket, transactions));
  const positiveReinforcements = buildPositiveReinforcements({
    goals,
    bills,
    pockets: pocketRecords,
  });
  const nudgeHistory = buildNudgeHistory(nudges);
  const activeGoal = buildDashboardGoal(goals);
  const aiInsightRecommendation = buildAiInsightRecommendation(
    categoryInsights,
    weeklyComparison,
    activeGoal,
  );
  const topSpendingCategories = categoryInsights.slice(0, 3);

  return {
    categoryInsights,
    weeklyTrend,
    weeklyComparison,
    positiveReinforcements,
    nudgeHistory,
    aiInsightRecommendation,
    topSpendingCategories,
    hasEnoughData:
      categoryInsights.length > 0 || nudges.length > 0 || transactions.length > 0,
  };
}
