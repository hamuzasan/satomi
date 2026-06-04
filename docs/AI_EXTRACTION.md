# SATOMI AI Extraction

Last updated: 2026-06-04

## Scope

Phase 18 introduces preview-first AI transaction extraction for chat.

Current implementation covers:

- `POST /api/chat/extract`
- strict request validation
- strict response validation
- Bahasa Indonesia casual-message understanding
- chat preview rendering
- clarification flow when the amount is missing
- optional pocket-threshold nudge pre-check
- explicit user confirmation before saving

This phase does **not** auto-save extraction results.

## Trust Boundary

SATOMI still treats AI output as untrusted.

Current safety rules:

- AI never writes directly to `transactions`
- extraction route only returns a preview
- server validates the JSON before returning it
- chat UI still requires the user to click `Simpan`
- final save happens through the existing authenticated transaction create flow

## API Route

Implemented route:

- `app/api/chat/extract/route.ts`

Note:

The repository uses root-level `app/`, not `src/app/`, so the API route is placed there to match the actual Next.js App Router structure.

## Request Shape

```json
{
  "message": "Tadi keluar 35 ribu buat ayam geprek"
}
```

## Response Shape

Successful preview:

```json
{
  "amount": 35000,
  "type": "expense",
  "category": "Makanan",
  "pocketSuggestion": "Kebutuhan Harian",
  "description": "ayam geprek",
  "date": "today",
  "confidence": 0.94,
  "needsClarification": false,
  "clarificationQuestion": null,
  "nudge": null
}
```

Clarification case:

```json
{
  "amount": null,
  "type": "expense",
  "category": "Lainnya",
  "pocketSuggestion": "Kebutuhan Harian",
  "description": "lainnya",
  "date": "today",
  "confidence": 0.28,
  "needsClarification": true,
  "clarificationQuestion": "Nominalnya berapa?",
  "nudge": null
}
```

## Validation

Current validation uses `zod`.

Server-side checks include:

- request `message` must be present
- `amount` must be positive if present
- `type` must be `income` or `expense` if present
- `confidence` must be between `0` and `1`
- `category` must be a string when present
- route never writes a confirmed transaction during extraction

## Prompt Builder

Implemented helper:

- `src/lib/ai/transaction-extraction.ts`

The prompt builder currently tells the model to:

- understand casual Bahasa Indonesia
- detect forms like `35 ribu`, `35k`, `150rb`, `2 juta`
- infer `income` vs `expense`
- suggest category
- suggest pocket from the user's actual pockets
- return strict JSON only

## Provider Behavior

Current environment variables:

- `AI_PROVIDER`
- `AI_API_KEY`
- `AI_MODEL`

Supported behavior now:

- `AI_PROVIDER=openai`: uses server-side OpenAI Responses API call
- `AI_PROVIDER=gemini`: uses server-side Google Gemini `generateContent` call with JSON response mode
- `AI_PROVIDER=mock`: uses safe local mock extraction
- no provider configured:
  - in development: safe mock extraction is used
  - outside development: route returns a configuration error

Recommended production examples:

- `AI_PROVIDER=gemini`
- `AI_MODEL=gemini-2.5-flash`

or:

- `AI_PROVIDER=openai`
- `AI_MODEL=gpt-4o-mini`

No secrets are hardcoded in the repository.

## Mock Behavior

The safe mock path is heuristic, not a real model.

It can currently infer:

- amount
- likely type
- likely category
- likely description
- simple pocket suggestion
- `today` / `yesterday`

It exists so local development remains testable before production AI env is ready.

## Pocket Nudge Pre-check

Before returning the preview, the route checks whether the suggested pocket would cross its warning threshold.

Current logic:

- reads current-month transactions
- derives pocket usage using existing pocket logic
- projects the new transaction into the suggested pocket
- returns a `nudge` object if projected usage crosses the pocket warning threshold

This is still advisory only. It does not block saving.

## Extraction Logging

Current behavior is best-effort only.

If possible, the route attempts to insert into:

- `ai_extractions`

Current log shape includes:

- `raw_input`
- validated preview JSON
- confidence
- status `pending` or `proposed`

If logging fails, extraction still returns the preview successfully. This keeps the preview flow usable while the logging path remains non-critical.

## Chat UI Behavior

Current `/chat` flow:

1. user sends a message
2. frontend calls `/api/chat/extract`
3. SATOMI shows either:
   - clarification question
   - transaction preview
   - nudge warning card
4. user must still click `Simpan`
5. only then does the app create a real transaction using `source = chat`

## Known Limits

- no multi-turn model memory beyond the frontend combining clarification replies with the previous ambiguous message
- extraction save still happens client-side after confirmation, not through a dedicated confirm route
- provider support is intentionally narrow
- category and pocket suggestion are still lightweight heuristics even when AI is unavailable
- no real AI extraction analytics dashboard yet

## Recommended Next Step

After Phase 18, the safest next step is:

1. create a dedicated confirm-save route for AI preview confirmation
2. add stronger server-side normalization for categories and dates
3. modernize the remaining older finance editors
