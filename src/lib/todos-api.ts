import { z } from "zod";

export const TODO_FIELDS =
  "id,title,description,completed,priority,category,due_date,created_at,updated_at";

export const CATEGORIES = ["personal", "work", "shopping", "health", "learning", "other"] as const;
export const PRIORITIES = ["low", "medium", "high"] as const;

const createDueDateSchema = z
  .string()
  .trim()
  .nullable()
  .optional()
  .transform((value, ctx) => {
    if (!value) return null;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid due_date" });
      return z.NEVER;
    }

    return date.toISOString();
  });

const updateDueDateSchema = z
  .string()
  .trim()
  .nullable()
  .optional()
  .transform((value, ctx) => {
    if (value === undefined) return undefined;
    if (!value) return null;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid due_date" });
      return z.NEVER;
    }

    return date.toISOString();
  });

export const listTodosQuerySchema = z.object({
  q: z.string().trim().max(200).catch(""),
  filter: z.enum(["All", "Active", "Completed", "High Priority"]).catch("All"),
  category: z.enum(["all", ...CATEGORIES]).catch("all"),
  limit: z.coerce.number().int().min(1).max(100).catch(50),
  offset: z.coerce.number().int().min(0).catch(0),
});

export const createTodoSchema = z.object({
  title: z.string().trim().min(1, "Title required").max(200, "Title required (max 200)"),
  description: z
    .string()
    .trim()
    .max(2000, "Description max 2000")
    .nullable()
    .optional()
    .transform((value) => value || null),
  priority: z.enum(PRIORITIES).catch("medium"),
  category: z.enum(CATEGORIES).catch("personal"),
  due_date: createDueDateSchema,
});

export const updateTodoSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title required")
      .max(200, "Title required (max 200)")
      .optional(),
    description: z
      .string()
      .trim()
      .max(2000, "Description max 2000")
      .nullable()
      .optional()
      .transform((value) => (value === undefined ? undefined : value || null)),
    completed: z.boolean().optional(),
    priority: z.enum(PRIORITIES).optional(),
    category: z.enum(CATEGORIES).optional(),
    due_date: updateDueDateSchema,
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, { message: "Nothing to update" });

export const todoIdSchema = z.string().uuid();

export function sanitizeSearchTerm(value: string) {
  return value
    .replace(/[%,()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function validationError(error: z.ZodError) {
  return jsonError(400, "VALIDATION_ERROR", error.issues[0]?.message ?? "Invalid request");
}

export function databaseError(error: unknown, fallbackMessage: string) {
  const message = getErrorMessage(error);

  console.error("[todos:database]", error);

  if (isConnectionError(message)) {
    return jsonError(
      503,
      "DATABASE_CONNECTION_ERROR",
      "Nie można połączyć się z Supabase. Sprawdź SUPABASE_URL/VITE_SUPABASE_URL w pliku .env oraz czy projekt Supabase jest aktywny.",
    );
  }

  if (isMissingTodosTable(message)) {
    return jsonError(
      500,
      "DATABASE_SCHEMA_ERROR",
      "Brakuje tabeli public.todos w Supabase. Uruchom SQL z pliku supabase/setup-todos.sql w Supabase SQL Editor.",
    );
  }

  return jsonError(500, "DATABASE_ERROR", fallbackMessage);
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object") {
    const values = ["message", "details", "hint", "code"]
      .map((key) => (error as Record<string, unknown>)[key])
      .filter((value): value is string => typeof value === "string");

    return values.join(" ");
  }

  return String(error);
}

function isConnectionError(message: string) {
  return /fetch failed|getaddrinfo|ENOTFOUND|ECONNREFUSED|ETIMEDOUT|EAI_AGAIN/i.test(message);
}

function isMissingTodosTable(message: string) {
  return /PGRST205|public\.todos|Could not find the table/i.test(message);
}

export function jsonError(status: number, code: string, message: string) {
  return Response.json(
    { error: message, code },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

export function jsonOk(data: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Cache-Control", "no-store");

  return Response.json(data, {
    ...init,
    headers,
  });
}
