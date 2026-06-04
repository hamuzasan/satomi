import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { formatCurrency, buildPocketUsageMap } from "@/src/lib/satomi-finance";
import type { PocketRow, TransactionRow } from "@/src/lib/supabase/finance";
import type { Database } from "@/src/lib/supabase/types";

export const chatExtractRequestSchema = z.object({
  message: z.string().trim().min(1, "Pesan wajib diisi.").max(500, "Pesan terlalu panjang."),
});

export const extractionNudgeSchema = z.object({
  title: z.string(),
  budget: z.string(),
  usedBefore: z.string(),
  currentTransaction: z.string(),
  estimatedTotal: z.string(),
  overBy: z.string(),
  note: z.string().nullable().optional(),
});

export const extractionPreviewSchema = z.object({
  amount: z.number().positive().nullable(),
  type: z.enum(["income", "expense"]).nullable(),
  category: z.string().trim().nullable(),
  pocketSuggestion: z.string().trim().nullable(),
  description: z.string().trim().nullable(),
  date: z.string().trim().nullable(),
  confidence: z.number().min(0).max(1).nullable(),
  needsClarification: z.boolean(),
  clarificationQuestion: z.string().trim().nullable(),
  nudge: extractionNudgeSchema.nullable(),
});

export type TransactionExtractionPreview = z.infer<typeof extractionPreviewSchema>;

const extractionPreviewInputSchema = z.object({
  amount: z.number().positive().nullish(),
  type: z.enum(["income", "expense"]).nullish(),
  category: z.string().trim().nullish(),
  pocketSuggestion: z.string().trim().nullish(),
  description: z.string().trim().nullish(),
  date: z.string().trim().nullish(),
  confidence: z.number().min(0).max(1).nullish(),
  needsClarification: z.boolean().nullish(),
  clarificationQuestion: z.string().trim().nullish(),
  nudge: extractionNudgeSchema.nullish(),
});

type ExtractionContext = {
  pocketNames: string[];
  commonCategories: string[];
};

const CATEGORY_RULES: Array<{ pattern: RegExp; category: string }> = [
  { pattern: /ayam|geprek|makan|bakso|nasi|resto|warung|mie|sarapan|lunch|dinner/i, category: "Makanan" },
  { pattern: /kopi|cafe|skincare|bioskop|game|spotify|nongkrong|reward|jajan/i, category: "Self-Reward" },
  { pattern: /gojek|grab|krl|transport|bensin|parkir|tol/i, category: "Transport" },
  { pattern: /internet|wifi|listrik|air|tagihan|pln|pulsa|paket data/i, category: "Tagihan" },
  { pattern: /gaji|freelance|salary|bonus|insentif|komisi/i, category: "Pemasukan" },
  { pattern: /tabung|saving|dana darurat/i, category: "Tabungan" },
];

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findAmount(message: string) {
  const normalized = normalizeText(message);
  const patterns: Array<[RegExp, (value: number) => number]> = [
    [/\b(\d+(?:[.,]\d+)?)\s*juta\b/i, (value) => value * 1_000_000],
    [/\b(\d+(?:[.,]\d+)?)\s*(?:ribu|rb|k)\b/i, (value) => value * 1_000],
    [/\b(\d{4,})\b/i, (value) => value],
  ];

  for (const [pattern, mapper] of patterns) {
    const match = normalized.match(pattern);
    if (!match?.[1]) continue;

    const parsed = Number.parseFloat(match[1].replace(",", "."));
    if (Number.isFinite(parsed) && parsed > 0) {
      return Math.round(mapper(parsed));
    }
  }

  return null;
}

function inferType(message: string): "income" | "expense" | null {
  const normalized = normalizeText(message);

  if (/\b(gaji|salary|bonus|pemasukan|masuk|dibayar|dibayarin|dapat|dapet|transfer masuk|freelance|komisi|insentif)\b/i.test(normalized)) {
    return "income";
  }

  if (/\b(keluar|bayar|beli|buat|top up|isi|belanja|langganan|transfer ke)\b/i.test(normalized)) {
    return "expense";
  }

  return null;
}

function inferCategory(message: string, fallbackType: "income" | "expense" | null) {
  for (const rule of CATEGORY_RULES) {
    if (rule.pattern.test(message)) {
      return rule.category;
    }
  }

  if (fallbackType === "income") {
    return "Pemasukan";
  }

  return "Lainnya";
}

function inferDescription(message: string, category: string) {
  const lower = normalizeText(message);
  const cues = ["buat", "untuk", "beli", "bayar", "dari", "gaji", "bonus", "freelance"];

  for (const cue of cues) {
    const index = lower.indexOf(`${cue} `);
    if (index >= 0) {
      const description = lower.slice(index + cue.length).trim();
      if (description) {
        return description
          .replace(/\b(\d+(?:[.,]\d+)?\s*(?:ribu|rb|k|juta)?)\b/gi, "")
          .replace(/\s+/g, " ")
          .trim();
      }
    }
  }

  return category === "Pemasukan" ? "Pemasukan baru" : category;
}

function inferDateKeyword(message: string) {
  const normalized = normalizeText(message);
  if (/\bkemarin\b/i.test(normalized)) return "yesterday";
  if (/\b(hari ini|tadi|barusan|pagi ini|siang ini|malam ini)\b/i.test(normalized)) {
    return "today";
  }
  return "today";
}

function suggestPocket(category: string, type: "income" | "expense" | null, pockets: string[]) {
  const normalizedPockets = pockets.map((pocket) => ({
    source: pocket,
    normalized: normalizeText(pocket),
  }));

  const matches =
    category === "Tagihan"
      ? ["tagihan", "bill"]
      : category === "Self-Reward"
        ? ["reward", "hiburan", "self"]
        : category === "Makanan" || category === "Transport"
          ? ["harian", "utama", "kebutuhan", "spending"]
          : type === "income"
            ? ["pemasukan", "income"]
            : ["tabungan", "saving"];

  for (const match of matches) {
    const found = normalizedPockets.find((pocket) => pocket.normalized.includes(match));
    if (found) return found.source;
  }

  return pockets[0] ?? null;
}

function inferConfidence({
  amount,
  type,
  category,
  pocketSuggestion,
}: {
  amount: number | null;
  type: "income" | "expense" | null;
  category: string | null;
  pocketSuggestion: string | null;
}) {
  let score = 0.35;
  if (amount) score += 0.3;
  if (type) score += 0.18;
  if (category) score += 0.1;
  if (pocketSuggestion) score += 0.05;
  return Math.min(0.98, Number(score.toFixed(2)));
}

export function buildTransactionExtractionPrompt({
  message,
  context,
}: {
  message: string;
  context: ExtractionContext;
}) {
  return [
    "Kamu adalah extractor transaksi untuk aplikasi keuangan SATOMI.",
    "Pahami Bahasa Indonesia santai dan bentuk nominal seperti 35 ribu, 35k, 150rb, 2 juta.",
    "Balas dengan JSON saja, tanpa markdown.",
    "Jangan mengarang nominal. Jika nominal belum jelas, set needsClarification=true dan isi clarificationQuestion.",
    "Jika transaksi tampak pemasukan, set type=income. Jika pengeluaran, set type=expense.",
    "Selalu kembalikan semua key ini walau nilainya null: amount, type, category, pocketSuggestion, description, date, confidence, needsClarification, clarificationQuestion, nudge.",
    "Gunakan salah satu kategori yang masuk akal. Kategori historis pengguna:",
    context.commonCategories.length > 0 ? context.commonCategories.join(", ") : "Makanan, Transport, Tagihan, Self-Reward, Pemasukan, Lainnya",
    "Sarankan pocket berdasarkan daftar pocket pengguna ini:",
    context.pocketNames.length > 0 ? context.pocketNames.join(", ") : "Belum ada pocket",
    "Gunakan date='today' atau 'yesterday' bila cocok.",
    "Bila tidak perlu nudge, set nudge=null.",
    `Pesan pengguna: ${message}`,
  ].join("\n");
}

export function buildMockTransactionExtraction({
  message,
  context,
}: {
  message: string;
  context: ExtractionContext;
}): TransactionExtractionPreview {
  const amount = findAmount(message);
  const type = inferType(message);
  const category = inferCategory(message, type);
  const pocketSuggestion = suggestPocket(category, type, context.pocketNames);
  const description = inferDescription(message, category);
  const date = inferDateKeyword(message);

  if (!amount) {
    return {
      amount: null,
      type,
      category,
      pocketSuggestion,
      description,
      date,
      confidence: 0.28,
      needsClarification: true,
      clarificationQuestion: "Nominalnya berapa?",
      nudge: null,
    };
  }

  return {
    amount,
    type: type ?? "expense",
    category,
    pocketSuggestion,
    description,
    date,
    confidence: inferConfidence({ amount, type: type ?? "expense", category, pocketSuggestion }),
    needsClarification: false,
    clarificationQuestion: null,
    nudge: null,
  };
}

async function callOpenAiExtraction({
  apiKey,
  model,
  prompt,
}: {
  apiKey: string;
  model: string;
  prompt: string;
}) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: "Ekstrak transaksi ke JSON yang sangat ketat." }],
        },
        {
          role: "user",
          content: [{ type: "input_text", text: prompt }],
        },
      ],
      text: {
        format: {
          type: "json_object",
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error("AI provider belum bisa merespons sekarang.");
  }

  const payload = (await response.json()) as { output_text?: string };
  if (!payload.output_text) {
    throw new Error("AI provider tidak mengembalikan JSON yang bisa dibaca.");
  }

  return payload.output_text;
}

async function callGeminiExtraction({
  apiKey,
  model,
  prompt,
}: {
  apiKey: string;
  model: string;
  prompt: string;
}) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: "Ekstrak transaksi ke JSON yang sangat ketat." }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    throw new Error("AI provider belum bisa merespons sekarang.");
  }

  const payload = (await response.json()) as {
    candidates?: Array<{
      content?: {
        parts?: Array<{
          text?: string;
        }>;
      };
    }>;
  };

  const text =
    payload.candidates
      ?.flatMap((candidate) => candidate.content?.parts ?? [])
      .map((part) => part.text?.trim())
      .filter((part): part is string => Boolean(part))
      .join("\n") ?? "";

  if (!text) {
    throw new Error("AI provider tidak mengembalikan JSON yang bisa dibaca.");
  }

  return text;
}

function parseTransactionExtractionPreview(raw: unknown) {
  const parsed = extractionPreviewInputSchema.parse(raw);
  const normalizedBase = {
    amount: parsed.amount ?? null,
    type: parsed.type ?? null,
    category: parsed.category ?? null,
    pocketSuggestion: parsed.pocketSuggestion ?? null,
    description: parsed.description ?? null,
    date: parsed.date ?? null,
  };
  const needsClarification = parsed.needsClarification ?? normalizedBase.amount === null;
  const confidence =
    parsed.confidence ??
    inferConfidence({
      amount: normalizedBase.amount,
      type: normalizedBase.type,
      category: normalizedBase.category,
      pocketSuggestion: normalizedBase.pocketSuggestion,
    });

  return extractionPreviewSchema.parse({
    ...normalizedBase,
    confidence,
    needsClarification,
    clarificationQuestion:
      parsed.clarificationQuestion ?? (needsClarification ? "Nominalnya berapa?" : null),
    nudge: parsed.nudge ?? null,
  });
}

export async function requestTransactionExtraction({
  message,
  context,
}: {
  message: string;
  context: ExtractionContext;
}) {
  const provider = process.env.AI_PROVIDER?.trim().toLowerCase();
  const apiKey = process.env.AI_API_KEY?.trim();
  const configuredModel = process.env.AI_MODEL?.trim();
  const prompt = buildTransactionExtractionPrompt({ message, context });

  if (!provider || !apiKey) {
    if (process.env.NODE_ENV === "development") {
      return buildMockTransactionExtraction({ message, context });
    }

    throw new Error("AI provider belum dikonfigurasi untuk environment ini.");
  }

  if (provider === "mock") {
    return buildMockTransactionExtraction({ message, context });
  }

  if (provider === "openai") {
    const raw = await callOpenAiExtraction({
      apiKey,
      model: configuredModel || "gpt-4o-mini",
      prompt,
    });
    const parsed = JSON.parse(raw) as unknown;
    return parseTransactionExtractionPreview(parsed);
  }

  if (provider === "gemini" || provider === "google" || provider === "google-ai") {
    const raw = await callGeminiExtraction({
      apiKey,
      model: configuredModel || "gemini-2.5-flash",
      prompt,
    });
    const parsed = JSON.parse(raw) as unknown;
    return parseTransactionExtractionPreview(parsed);
  }

  throw new Error(`AI provider '${provider}' belum didukung.`);
}

function findPocketBySuggestion(suggestion: string | null, pockets: PocketRow[]) {
  if (!suggestion) return null;
  const normalizedSuggestion = normalizeText(suggestion);
  return (
    pockets.find((pocket) => normalizeText(pocket.name) === normalizedSuggestion) ??
    pockets.find((pocket) => normalizeText(pocket.name).includes(normalizedSuggestion)) ??
    null
  );
}

function getProjectedPocketUsage({
  pocket,
  currentUsed,
  amount,
  type,
}: {
  pocket: PocketRow;
  currentUsed: number;
  amount: number;
  type: "income" | "expense";
}) {
  if (pocket.type === "saving" || pocket.type === "emergency" || pocket.type === "income") {
    return type === "income" ? currentUsed + amount : Math.max(currentUsed - amount, 0);
  }

  return type === "expense" ? currentUsed + amount : Math.max(currentUsed - amount, 0);
}

export function buildPocketThresholdNudge({
  extraction,
  pockets,
  transactions,
}: {
  extraction: TransactionExtractionPreview;
  pockets: PocketRow[];
  transactions: TransactionRow[];
}) {
  if (
    extraction.needsClarification ||
    !extraction.amount ||
    !extraction.type ||
    extraction.type !== "expense"
  ) {
    return null;
  }

  const pocket = findPocketBySuggestion(extraction.pocketSuggestion, pockets);
  if (!pocket) return null;

  const usageMap = buildPocketUsageMap(transactions, [pocket]);
  const usedBefore = usageMap.get(pocket.id) ?? pocket.current_amount ?? 0;
  const estimatedTotal = getProjectedPocketUsage({
    pocket,
    currentUsed: usedBefore,
    amount: extraction.amount,
    type: extraction.type,
  });
  const budget = pocket.budget_limit ?? 0;
  const projectedProgress = budget > 0 ? Math.round((estimatedTotal / budget) * 100) : 0;

  if (projectedProgress < pocket.warning_threshold) {
    return null;
  }

  const overByAmount = Math.max(estimatedTotal - budget, 0);
  const title =
    projectedProgress > 100
      ? `Pocket ${pocket.name} kamu akan melewati batas bulan ini.`
      : `Pocket ${pocket.name} kamu akan melewati ambang peringatan.`;

  return extractionNudgeSchema.parse({
    title,
    budget: formatCurrency(budget),
    usedBefore: formatCurrency(usedBefore),
    currentTransaction: formatCurrency(extraction.amount),
    estimatedTotal: formatCurrency(estimatedTotal),
    overBy:
      overByAmount > 0
        ? formatCurrency(overByAmount)
        : `${Math.max(projectedProgress - pocket.warning_threshold, 0)}% dari ambang`,
    note:
      overByAmount > 0
        ? "Kalau transaksi ini tetap disimpan, pocket akan benar-benar melewati limit bulanannya."
        : `Progress pocket diproyeksikan menjadi ${projectedProgress}% dan melewati ambang ${pocket.warning_threshold}%.`,
  });
}

export function normalizeExtractionPreview(preview: TransactionExtractionPreview) {
  if (preview.needsClarification && !preview.clarificationQuestion) {
    return {
      ...preview,
      clarificationQuestion: "Nominalnya berapa?",
    };
  }

  return preview;
}

export async function logExtractionPreview({
  supabase,
  userId,
  message,
  preview,
}: {
  supabase: SupabaseClient<Database>;
  userId: string;
  message: string;
  preview: TransactionExtractionPreview;
}) {
  try {
    const result = await supabase.from("ai_extractions").insert({
      user_id: userId,
      raw_input: message,
      extracted_json: preview,
      confidence: preview.confidence ?? 0,
      status: preview.needsClarification ? "pending" : "proposed",
    });

    const error = result && "error" in result ? result.error : null;
    if (error) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
