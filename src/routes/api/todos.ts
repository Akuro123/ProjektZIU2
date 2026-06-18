import { createFileRoute } from "@tanstack/react-router";
import { getSupabaseRequestContext } from "@/integrations/supabase/request-client.server";
import {
  TODO_FIELDS,
  createTodoSchema,
  databaseError,
  jsonError,
  jsonOk,
  listTodosQuerySchema,
  sanitizeSearchTerm,
  validationError,
} from "@/lib/todos-api";

export const Route = createFileRoute("/api/todos")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const context = await getSupabaseRequestContext(request);
        if (context instanceof Response) return context;

        const url = new URL(request.url);
        const parsed = listTodosQuerySchema.safeParse({
          q: url.searchParams.get("q") ?? "",
          filter: url.searchParams.get("filter") ?? "All",
          category: url.searchParams.get("category") ?? "all",
          limit: url.searchParams.get("limit") ?? undefined,
          offset: url.searchParams.get("offset") ?? undefined,
        });

        if (!parsed.success) return validationError(parsed.error);

        const { q, filter, category, limit, offset } = parsed.data;

        let query = context.supabase
          .from("todos")
          .select(TODO_FIELDS, { count: "exact" })
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1);

        if (filter === "Active") query = query.eq("completed", false);
        else if (filter === "Completed") query = query.eq("completed", true);
        else if (filter === "High Priority") query = query.eq("priority", "high");

        if (category !== "all") {
          query = query.eq("category", category);
        }

        const safe = sanitizeSearchTerm(q);
        if (safe) {
          query = query.or(`title.ilike.%${safe}%,description.ilike.%${safe}%`);
        }

        const { data, error, count } = await query;
        if (error) {
          return databaseError(error, "Could not fetch todos");
        }

        return jsonOk({
          data: data ?? [],
          pagination: {
            limit,
            offset,
            total: count ?? 0,
            hasMore: offset + limit < (count ?? 0),
          },
        });
      },
      POST: async ({ request }) => {
        const context = await getSupabaseRequestContext(request);
        if (context instanceof Response) return context;

        const body = await request.json().catch(() => ({}));
        const parsed = createTodoSchema.safeParse(body);
        if (!parsed.success) return validationError(parsed.error);

        const { data, error } = await context.supabase
          .from("todos")
          .insert({ ...parsed.data, user_id: context.user.id })
          .select(TODO_FIELDS)
          .single();
        if (error) {
          return databaseError(error, "Could not create todo");
        }
        return jsonOk(data, { status: 201 });
      },
    },
  },
});
