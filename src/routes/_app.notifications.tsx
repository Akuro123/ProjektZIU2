import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bell, CheckCircle2, Clock, ListChecks } from "lucide-react";
import { getAuthHeaders, readApiError } from "@/lib/auth-api";
import {
  buildNotifications,
  notificationToneClass,
  type NotificationTodo,
} from "@/lib/notifications";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/notifications")({
  component: NotificationsPage,
  head: () => ({
    meta: [
      { title: "TaskFlow - Notifications" },
      { name: "description", content: "Powiadomienia o zadaniach, logowaniu i deadline'ach." },
    ],
  }),
});

function NotificationsPage() {
  const { profile, user } = useAuth();
  const { data: todos = [], isLoading } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: fetchNotificationTodos,
    enabled: !!user,
    refetchInterval: 60_000,
  });
  const notifications = buildNotifications(todos, profile.displayName);
  const urgent = notifications.filter(
    (notification) => notification.tone === "danger" || notification.tone === "warning",
  );
  const activity = notifications.filter(
    (notification) => notification.tone !== "danger" && notification.tone !== "warning",
  );
  const completedCount = todos.filter((todo) => todo.completed).length;
  const overdueCount = todos.filter(isOverdue).length;
  const dueSoonCount = todos.filter(isDueSoon).length;

  return (
    <div className="px-4 py-6 sm:px-6 md:py-8 lg:px-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
        <p className="mt-2 text-muted-foreground">
          Alerty o logowaniu, nowych zadaniach, deadline'ach i zadaniach po terminie.
        </p>
      </header>

      <section className="mb-6 grid gap-3 sm:grid-cols-3">
        <Metric icon={Bell} label="Pilne" value={urgent.length} />
        <Metric icon={Clock} label="Deadline blisko" value={dueSoonCount} />
        <Metric icon={CheckCircle2} label="Ukończone" value={completedCount} />
      </section>

      {isLoading ? (
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
          Ładowanie powiadomień...
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Oś aktywności</h2>
              <span className="text-sm text-muted-foreground">{notifications.length} alertów</span>
            </div>

            {notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <article
                  key={notification.id}
                  className="flex gap-4 rounded-lg border border-border bg-card p-4 shadow-[var(--shadow-sm)]"
                >
                  <div
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg",
                      notificationToneClass(notification.tone),
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-medium text-foreground">{notification.title}</h3>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {notification.time}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{notification.description}</p>
                  </div>
                </article>
              );
            })}
          </section>

          <aside className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Stan zadań</h2>
            <SummaryItem label="Po terminie" value={overdueCount} tone="danger" />
            <SummaryItem label="Deadline w 24h" value={dueSoonCount} tone="warning" />
            <SummaryItem label="Aktywne" value={todos.filter((todo) => !todo.completed).length} />
            <SummaryItem label="Ukończone" value={completedCount} tone="success" />
          </aside>
        </div>
      )}
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ListChecks;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-[var(--shadow-sm)]">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function SummaryItem({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "success" | "warning" | "danger";
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <span
        className={cn(
          "rounded-md px-2 py-1 text-sm font-semibold",
          tone === "success" && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
          tone === "warning" && "bg-amber-500/10 text-amber-700 dark:text-amber-300",
          tone === "danger" && "bg-destructive/10 text-destructive",
          tone === "default" && "bg-muted text-muted-foreground",
        )}
      >
        {value}
      </span>
    </div>
  );
}

async function fetchNotificationTodos(): Promise<NotificationTodo[]> {
  const response = await fetch("/api/todos?limit=100", {
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(await readApiError(response, "Nie udało się pobrać powiadomień"));
  }

  const payload = (await response.json()) as { data?: NotificationTodo[] } | NotificationTodo[];
  return Array.isArray(payload) ? payload : (payload.data ?? []);
}

function isOverdue(todo: NotificationTodo) {
  return !!todo.due_date && !todo.completed && new Date(todo.due_date).getTime() < Date.now();
}

function isDueSoon(todo: NotificationTodo) {
  if (!todo.due_date || todo.completed || isOverdue(todo)) return false;
  const due = new Date(todo.due_date).getTime();
  return due <= Date.now() + 24 * 60 * 60 * 1000;
}
