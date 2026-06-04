import { NextResponse } from "next/server";
import {
  buildPocketThresholdNudge,
  chatExtractRequestSchema,
  logExtractionPreview,
  normalizeExtractionPreview,
  requestTransactionExtraction,
} from "@/src/lib/ai/transaction-extraction";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { getAuthenticatedUserId } from "@/src/lib/supabase/finance";

function jsonHeaders() {
  return {
    "Cache-Control": "no-store",
  };
}

function errorResponse(status: number, code: string, message: string, details?: unknown) {
  return NextResponse.json(
    {
      error: {
        code,
        message,
        details: details ?? null,
      },
    },
    {
      status,
      headers: jsonHeaders(),
    },
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = chatExtractRequestSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(400, "VALIDATION_ERROR", "Data tidak valid.", parsed.error.flatten());
    }

    const supabase = await createSupabaseServerClient();
    const userId = await getAuthenticatedUserId(supabase);

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [{ data: pockets, error: pocketsError }, { data: transactions, error: transactionsError }] =
      await Promise.all([
        supabase.from("pockets").select("*").order("created_at", { ascending: true }),
        supabase
          .from("transactions")
          .select("*")
          .gte("transaction_date", monthStart.toISOString())
          .order("transaction_date", { ascending: false }),
      ]);

    if (pocketsError || transactionsError) {
      return errorResponse(
        500,
        "SNAPSHOT_ERROR",
        "Konteks transaksi belum bisa dimuat untuk proses ekstraksi.",
      );
    }

    const commonCategories = Array.from(
      new Set((transactions ?? []).map((transaction) => transaction.category).filter(Boolean)),
    ).slice(0, 8);

    const preview = normalizeExtractionPreview(
      await requestTransactionExtraction({
        message: parsed.data.message,
        context: {
          pocketNames: (pockets ?? []).map((pocket) => pocket.name),
          commonCategories,
        },
      }),
    );

    const nudge = buildPocketThresholdNudge({
      extraction: preview,
      pockets: pockets ?? [],
      transactions: transactions ?? [],
    });

    const finalPreview = {
      ...preview,
      nudge,
    };

    const logStored = await logExtractionPreview({
      supabase,
      userId,
      message: parsed.data.message,
      preview: finalPreview,
    });

    return NextResponse.json(
      {
        ...finalPreview,
        logStored,
      },
      {
        headers: jsonHeaders(),
      },
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("Sesi")) {
        return errorResponse(401, "UNAUTHORIZED", error.message);
      }

      return errorResponse(500, "EXTRACTION_ERROR", error.message);
    }

    return errorResponse(
      500,
      "UNKNOWN_ERROR",
      "Ekstraksi transaksi belum bisa dijalankan sekarang.",
    );
  }
}
