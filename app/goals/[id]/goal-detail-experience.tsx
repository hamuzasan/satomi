"use client";

import { ArrowLeft, Pencil, Target } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell, EmptyState, LoadingState } from "@/src/components/satomi";
import { Button } from "@/src/components/ui/button";
import {
  formatFullDate,
  mapGoalRowToRecord,
  type GoalRecord,
} from "@/src/lib/satomi-goals-bills";
import {
  deleteGoal,
  updateGoal,
  type GoalInput,
} from "@/src/lib/supabase/finance";
import { createSupabaseBrowserClient } from "@/src/lib/supabase/client";
import { useFinanceSnapshot } from "@/src/lib/supabase/use-finance-snapshot";
import { cn } from "@/src/lib/utils";
import { GoalDetailPanels, GoalEditorDialog } from "../goals-experience";

export function GoalDetailExperience({ goalId }: { goalId: string }) {
  const router = useRouter();
  const { snapshot, isLoading, error, refresh } = useFinanceSnapshot();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"success" | "error">("success");
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const goal = snapshot?.goals.find((item) => item.id === goalId) ?? null;
  const goalRecord = useMemo<GoalRecord | null>(
    () => (goal ? mapGoalRowToRecord(snapshot?.goals ?? [goal], goal) : null),
    [goal, snapshot?.goals],
  );

  async function handleUpdate(input: GoalInput) {
    if (!goal) return;

    setIsMutating(true);
    setStatusMessage(null);

    try {
      await updateGoal(supabase, goal.id, input);
      await refresh();
      setStatusTone("success");
      setStatusMessage("Goal berhasil diperbarui.");
      setIsModalOpen(false);
    } catch (error) {
      setStatusTone("error");
      setStatusMessage(error instanceof Error ? error.message : "Goal belum berhasil diperbarui.");
    } finally {
      setIsMutating(false);
    }
  }

  async function handleDelete() {
    if (!goal) return;

    setIsMutating(true);
    setStatusMessage(null);

    try {
      await deleteGoal(supabase, goal.id);
      router.replace("/goals");
      router.refresh();
    } catch (error) {
      setStatusTone("error");
      setStatusMessage(error instanceof Error ? error.message : "Goal belum berhasil dihapus.");
    } finally {
      setIsMutating(false);
    }
  }

  if (isLoading) {
    return (
      <AppShell activePath="/goals">
        <LoadingState
          variant="skeleton"
          title="Satomi sedang membuka goal..."
          description="Menyiapkan detail target dari Supabase."
        />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell activePath="/goals">
        <EmptyState
          title="Goal belum bisa dimuat"
          description={error}
          primaryAction={{ label: "Kembali ke Goal", href: "/goals" }}
        />
      </AppShell>
    );
  }

  if (!goal || !goalRecord) {
    return (
      <AppShell activePath="/goals">
        <EmptyState
          title="Goal tidak ditemukan"
          description="Goal ini belum tersedia atau sudah dihapus. Kembali ke daftar tujuan untuk melihat data terbaru."
          primaryAction={{ label: "Lihat Goal", href: "/goals" }}
        />
      </AppShell>
    );
  }

  return (
    <AppShell activePath="/goals">
      {statusMessage ? (
        <div
          className={cn(
            "rounded-2xl border px-4 py-3 text-sm leading-6",
            statusTone === "success"
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
              : "border-rose-400/30 bg-rose-400/10 text-rose-100",
          )}
        >
          {statusMessage}
        </div>
      ) : null}

      <section className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <Link
            href="/goals"
            className="mb-4 inline-flex items-center gap-2 text-sm text-satomi-muted transition hover:text-satomi-cyan"
          >
            <ArrowLeft className="size-4" />
            Kembali ke Tujuan Finansial
          </Link>
          <div className="mb-2 flex items-center gap-2 text-satomi-cyan">
            <Target className="size-5" />
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.24em]">
              Goal Aktif
            </span>
          </div>
          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-normal text-satomi-text md:text-6xl">
            {goalRecord.name}
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-satomi-muted">
            Detail strategi, milestone, dan ritme nabung untuk menjaga target tetap bergerak.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="rounded-2xl border border-satomi-cyan/25 bg-satomi-cyan/10 px-5 py-4 text-satomi-cyan">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em]">
              Target tanggal
            </p>
            <p className="mt-1 font-semibold text-satomi-text">{formatFullDate(goal.target_date)}</p>
          </div>
          <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
            <Pencil className="size-4" />
            Edit Goal
          </Button>
        </div>
      </section>

      <GoalDetailPanels goal={goal} />

      <GoalEditorDialog
        key={goal.id}
        isOpen={isModalOpen}
        mode="edit"
        goal={goal}
        isBusy={isMutating}
        onOpenChange={setIsModalOpen}
        onSubmit={handleUpdate}
        onDelete={handleDelete}
      />
    </AppShell>
  );
}
