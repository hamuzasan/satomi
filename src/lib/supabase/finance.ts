import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert, TablesUpdate } from "./types";

export type TransactionRow = Tables<"transactions">;
export type PocketRow = Tables<"pockets">;
export type GoalRow = Tables<"goals">;
export type BillRow = Tables<"bills">;
type ProfileRow = Tables<"profiles">;

export type TransactionInput = {
  amount: number;
  type: "income" | "expense";
  category: string;
  pocket_id: string | null;
  description: string;
  transaction_date: string;
};

export type PocketInput = {
  name: string;
  type: string;
  budget_limit: number;
  color: string;
  icon: string;
  warning_threshold: number;
};

export type GoalInput = {
  name: string;
  goal_type: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
  strategy: string | null;
};

export type BillInput = {
  name: string;
  amount: number;
  due_date: string;
  frequency: string;
  status: string;
  pocket_id: string | null;
  reminder_days: number | null;
};

export type FinanceSnapshot = {
  userId: string;
  profileName: string | null;
  transactions: TransactionRow[];
  pockets: PocketRow[];
  goals: GoalRow[];
  bills: BillRow[];
};

function normalizeSupabaseError(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export async function getAuthenticatedUserId(
  supabase: SupabaseClient<Database>,
) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error("Sesi kamu bermasalah. Coba masuk lagi.");
  }

  if (!user) {
    throw new Error("Sesi kamu sudah berakhir. Silakan masuk lagi.");
  }

  return user.id;
}

export async function fetchFinanceSnapshot(
  supabase: SupabaseClient<Database>,
): Promise<FinanceSnapshot> {
  const userId = await getAuthenticatedUserId(supabase);

  const [
    { data: transactions, error: transactionsError },
    { data: pockets, error: pocketsError },
    { data: goals, error: goalsError },
    { data: bills, error: billsError },
    { data: profile },
  ] =
    await Promise.all([
      supabase
        .from("transactions")
        .select("*")
        .order("transaction_date", { ascending: false }),
      supabase.from("pockets").select("*").order("created_at", { ascending: true }),
      supabase.from("goals").select("*").order("created_at", { ascending: true }),
      supabase.from("bills").select("*").order("due_date", { ascending: true }),
      supabase.from("profiles").select("name").eq("id", userId).maybeSingle(),
    ]);

  if (transactionsError) {
    throw new Error(
      normalizeSupabaseError(
        transactionsError,
        "Transaksi belum bisa dimuat dari Supabase.",
      ),
    );
  }

  if (pocketsError) {
    throw new Error(
      normalizeSupabaseError(
        pocketsError,
        "Pocket belum bisa dimuat dari Supabase.",
      ),
    );
  }

  if (goalsError) {
    throw new Error(
      normalizeSupabaseError(goalsError, "Goal belum bisa dimuat dari Supabase."),
    );
  }

  if (billsError) {
    throw new Error(
      normalizeSupabaseError(
        billsError,
        "Tagihan belum bisa dimuat dari Supabase.",
      ),
    );
  }

  return {
    userId,
    profileName: (profile as Pick<ProfileRow, "name"> | null)?.name ?? null,
    transactions: transactions ?? [],
    pockets: pockets ?? [],
    goals: goals ?? [],
    bills: bills ?? [],
  };
}

function validateTransactionInput(input: TransactionInput) {
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error("Nominal transaksi harus lebih besar dari nol.");
  }

  if (!input.category.trim()) {
    throw new Error("Kategori transaksi wajib diisi.");
  }

  if (!input.transaction_date) {
    throw new Error("Tanggal transaksi wajib diisi.");
  }
}

function validatePocketInput(input: PocketInput) {
  if (!input.name.trim()) {
    throw new Error("Nama pocket wajib diisi.");
  }

  if (!Number.isFinite(input.budget_limit) || input.budget_limit < 0) {
    throw new Error("Limit pocket harus berupa angka nol atau lebih.");
  }

  if (
    !Number.isFinite(input.warning_threshold) ||
    input.warning_threshold < 0 ||
    input.warning_threshold > 100
  ) {
    throw new Error("Ambang peringatan pocket harus di antara 0 sampai 100.");
  }
}

function validateGoalInput(input: GoalInput) {
  if (!input.name.trim()) {
    throw new Error("Nama goal wajib diisi.");
  }

  if (!Number.isFinite(input.target_amount) || input.target_amount <= 0) {
    throw new Error("Target goal harus lebih besar dari nol.");
  }

  if (!Number.isFinite(input.current_amount) || input.current_amount < 0) {
    throw new Error("Dana terkumpul goal tidak boleh negatif.");
  }

  if (input.current_amount > input.target_amount) {
    throw new Error("Dana terkumpul tidak boleh melebihi target goal.");
  }
}

function validateBillInput(input: BillInput) {
  if (!input.name.trim()) {
    throw new Error("Nama tagihan wajib diisi.");
  }

  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error("Nominal tagihan harus lebih besar dari nol.");
  }

  if (!input.due_date) {
    throw new Error("Tanggal jatuh tempo wajib diisi.");
  }

  if (
    input.reminder_days !== null &&
    (!Number.isFinite(input.reminder_days) || input.reminder_days < 0)
  ) {
    throw new Error("Pengingat tagihan harus berupa angka nol atau lebih.");
  }
}

export async function createTransaction(
  supabase: SupabaseClient<Database>,
  input: TransactionInput,
) {
  validateTransactionInput(input);
  const userId = await getAuthenticatedUserId(supabase);

  const payload: TablesInsert<"transactions"> = {
    user_id: userId,
    amount: input.amount,
    type: input.type,
    category: input.category.trim(),
    pocket_id: input.pocket_id,
    description: input.description.trim(),
    transaction_date: input.transaction_date,
    source: "manual",
  };

  const { data, error } = await supabase
    .from("transactions")
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(
      normalizeSupabaseError(error, "Transaksi baru belum berhasil disimpan."),
    );
  }

  return data;
}

export async function updateTransaction(
  supabase: SupabaseClient<Database>,
  id: string,
  input: TransactionInput,
) {
  validateTransactionInput(input);
  const userId = await getAuthenticatedUserId(supabase);

  const payload: TablesUpdate<"transactions"> = {
    amount: input.amount,
    type: input.type,
    category: input.category.trim(),
    pocket_id: input.pocket_id,
    description: input.description.trim(),
    transaction_date: input.transaction_date,
    source: "manual",
  };

  const { data, error } = await supabase
    .from("transactions")
    .update(payload)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    throw new Error(
      normalizeSupabaseError(error, "Perubahan transaksi belum berhasil disimpan."),
    );
  }

  return data;
}

export async function deleteTransaction(
  supabase: SupabaseClient<Database>,
  id: string,
) {
  const userId = await getAuthenticatedUserId(supabase);
  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new Error(
      normalizeSupabaseError(error, "Transaksi belum berhasil dihapus."),
    );
  }
}

export async function createPocket(
  supabase: SupabaseClient<Database>,
  input: PocketInput,
) {
  validatePocketInput(input);
  const userId = await getAuthenticatedUserId(supabase);

  const payload: TablesInsert<"pockets"> = {
    user_id: userId,
    name: input.name.trim(),
    type: input.type,
    budget_limit: input.budget_limit,
    current_amount: 0,
    color: input.color,
    icon: input.icon,
    warning_threshold: input.warning_threshold,
  };

  const { data, error } = await supabase.from("pockets").insert(payload).select().single();

  if (error) {
    throw new Error(
      normalizeSupabaseError(error, "Pocket baru belum berhasil disimpan."),
    );
  }

  return data;
}

export async function updatePocket(
  supabase: SupabaseClient<Database>,
  id: string,
  input: PocketInput,
) {
  validatePocketInput(input);
  const userId = await getAuthenticatedUserId(supabase);

  const payload: TablesUpdate<"pockets"> = {
    name: input.name.trim(),
    type: input.type,
    budget_limit: input.budget_limit,
    color: input.color,
    icon: input.icon,
    warning_threshold: input.warning_threshold,
  };

  const { data, error } = await supabase
    .from("pockets")
    .update(payload)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    throw new Error(
      normalizeSupabaseError(error, "Perubahan pocket belum berhasil disimpan."),
    );
  }

  return data;
}

export async function deletePocketIfSafe(
  supabase: SupabaseClient<Database>,
  id: string,
) {
  const userId = await getAuthenticatedUserId(supabase);

  const { count, error: countError } = await supabase
    .from("transactions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("pocket_id", id);

  if (countError) {
    throw new Error(
      normalizeSupabaseError(
        countError,
        "Keterkaitan transaksi pocket belum bisa diperiksa.",
      ),
    );
  }

  if ((count ?? 0) > 0) {
    throw new Error(
      "Pocket ini masih dipakai oleh transaksi aktif. Lepaskan transaksi terkait dulu sebelum menghapus pocket.",
    );
  }

  const { error } = await supabase
    .from("pockets")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new Error(
      normalizeSupabaseError(error, "Pocket belum berhasil dihapus."),
    );
  }
}

export async function createGoal(
  supabase: SupabaseClient<Database>,
  input: GoalInput,
) {
  validateGoalInput(input);
  const userId = await getAuthenticatedUserId(supabase);

  const payload: TablesInsert<"goals"> = {
    user_id: userId,
    name: input.name.trim(),
    goal_type: input.goal_type,
    target_amount: input.target_amount,
    current_amount: input.current_amount,
    target_date: input.target_date,
    strategy: input.strategy?.trim() || null,
  };

  const { data, error } = await supabase.from("goals").insert(payload).select().single();

  if (error) {
    throw new Error(normalizeSupabaseError(error, "Goal baru belum berhasil disimpan."));
  }

  return data;
}

export async function updateGoal(
  supabase: SupabaseClient<Database>,
  id: string,
  input: GoalInput,
) {
  validateGoalInput(input);
  const userId = await getAuthenticatedUserId(supabase);

  const payload: TablesUpdate<"goals"> = {
    name: input.name.trim(),
    goal_type: input.goal_type,
    target_amount: input.target_amount,
    current_amount: input.current_amount,
    target_date: input.target_date,
    strategy: input.strategy?.trim() || null,
  };

  const { data, error } = await supabase
    .from("goals")
    .update(payload)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    throw new Error(
      normalizeSupabaseError(error, "Perubahan goal belum berhasil disimpan."),
    );
  }

  return data;
}

export async function deleteGoal(
  supabase: SupabaseClient<Database>,
  id: string,
) {
  const userId = await getAuthenticatedUserId(supabase);
  const { error } = await supabase.from("goals").delete().eq("id", id).eq("user_id", userId);

  if (error) {
    throw new Error(normalizeSupabaseError(error, "Goal belum berhasil dihapus."));
  }
}

export async function createBill(
  supabase: SupabaseClient<Database>,
  input: BillInput,
) {
  validateBillInput(input);
  const userId = await getAuthenticatedUserId(supabase);

  const payload: TablesInsert<"bills"> = {
    user_id: userId,
    name: input.name.trim(),
    amount: input.amount,
    due_date: input.due_date,
    frequency: input.frequency,
    status: input.status,
    pocket_id: input.pocket_id,
    reminder_days: input.reminder_days,
  };

  const { data, error } = await supabase.from("bills").insert(payload).select().single();

  if (error) {
    throw new Error(
      normalizeSupabaseError(error, "Tagihan baru belum berhasil disimpan."),
    );
  }

  return data;
}

export async function updateBill(
  supabase: SupabaseClient<Database>,
  id: string,
  input: BillInput,
) {
  validateBillInput(input);
  const userId = await getAuthenticatedUserId(supabase);

  const payload: TablesUpdate<"bills"> = {
    name: input.name.trim(),
    amount: input.amount,
    due_date: input.due_date,
    frequency: input.frequency,
    status: input.status,
    pocket_id: input.pocket_id,
    reminder_days: input.reminder_days,
  };

  const { data, error } = await supabase
    .from("bills")
    .update(payload)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    throw new Error(
      normalizeSupabaseError(error, "Perubahan tagihan belum berhasil disimpan."),
    );
  }

  return data;
}

export async function markBillAsPaid(
  supabase: SupabaseClient<Database>,
  id: string,
) {
  const userId = await getAuthenticatedUserId(supabase);
  const { data, error } = await supabase
    .from("bills")
    .update({ status: "paid" })
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    throw new Error(
      normalizeSupabaseError(error, "Status tagihan belum berhasil diperbarui."),
    );
  }

  return data;
}

export async function deleteBill(
  supabase: SupabaseClient<Database>,
  id: string,
) {
  const userId = await getAuthenticatedUserId(supabase);
  const { error } = await supabase.from("bills").delete().eq("id", id).eq("user_id", userId);

  if (error) {
    throw new Error(normalizeSupabaseError(error, "Tagihan belum berhasil dihapus."));
  }
}
