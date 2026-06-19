import { createFileRoute } from "@tanstack/react-router";
import { getSupabaseRequestContext } from "@/integrations/supabase/request-client.server";
import {
  TODO_FIELDS,
  databaseError,
  jsonError,
  jsonOk,
  todoIdSchema,
  updateTodoSchema,
  validationError,
} from "@/lib/todos-api";

export const Route = createFileRoute("/api/todos/$id")({
  server: {
    handlers: {
      PATCH: async ({ request, params }) => {
        const context = await getSupabaseRequestContext(request);
        if (context instanceof Response) return context;

        const id = todoIdSchema.safeParse(params.id);
        if (!id.success) return jsonError(400, "VALIDATION_ERROR", "Invalid todo id");

        const body = await request.json().catch(() => ({}));
        const parsed = updateTodoSchema.safeParse(body);
        if (!parsed.success) return validationError(parsed.error);

        const { data, error } = await context.supabase
          .from("todos")
          .update(parsed.data)
          .eq("id", id.data)
          .select(TODO_FIELDS)
          .maybeSingle();
        if (error) {
          return databaseError(error, "Could not update todo");
        }
        if (!data) return jsonError(404, "NOT_FOUND", "Todo not found");

        return jsonOk(data);
      },
      DELETE: async ({ request, params }) => {
        const context = await getSupabaseRequestContext(request);
        if (context instanceof Response) return context;

        const id = todoIdSchema.safeParse(params.id);
        if (!id.success) return jsonError(400, "VALIDATION_ERROR", "Invalid todo id");

        const { data, error } = await context.supabase
          .from("todos")
          .delete()
          .eq("id", id.data)
          .select("id")
          .maybeSingle();
        if (error) {
          return databaseError(error, "Could not delete todo");
        }
        if (!data) return jsonError(404, "NOT_FOUND", "Todo not found");

        return new Response(null, {
          status: 204,
          headers: {
            "Cache-Control": "no-store",
          },
        });
      },
    },
  },
});
