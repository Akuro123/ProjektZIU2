import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  SlidersHorizontal,
  Grid3x3,
  List,
  Check,
  Clock,
  AlertCircle,
  Loader2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { getAuthHeaders, readApiError } from "@/lib/auth-api";
import { cn } from "@/lib/utils";

type Todo = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: "low" | "medium" | "high";
  category: Category;
  due_date: string | null;
  created_at: string;
  updated_at: string;
};

const API = "/api/todos";
const TODO_PAGE_SIZE = 50;

type TodosResponse = {
  data: Todo[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
    hasMore: boolean;
  };
};

const CATEGORIES = ["personal", "work", "shopping", "health", "learning", "other"] as const;
type Category = (typeof CATEGORIES)[number];
const CATEGORY_FILTERS = ["all", ...CATEGORIES] as const;
type CategoryFilter = (typeof CATEGORY_FILTERS)[number];
const STATUS_FILTERS = ["All", "Active", "Completed", "High Priority"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

const CATEGORY_LABEL: Record<Category, string> = {
  personal: "Personal",
  work: "Work",
  shopping: "Shopping",
  health: "Health",
  learning: "Learning",
  other: "Other",
};

const CATEGORY_STYLE: Record<Category, string> = {
  personal: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:text-indigo-300",
  work: "bg-sky-500/10 text-sky-700 border-sky-500/20 dark:text-sky-300",
  shopping: "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-300",
  health: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-300",
  learning: "bg-violet-500/10 text-violet-700 border-violet-500/20 dark:text-violet-300",
  other: "bg-muted text-muted-foreground border-border",
};

async function fetchTodos(params: {
  q: string;
  category: CategoryFilter;
  filter: StatusFilter;
}): Promise<Todo[]> {
  const qs = new URLSearchParams();
  if (params.q) qs.set("q", params.q);
  if (params.category !== "all") qs.set("category", params.category);
  if (params.filter !== "All") qs.set("filter", params.filter);
  qs.set("limit", String(TODO_PAGE_SIZE));
  const r = await fetch(`${API}${qs.toString() ? `?${qs}` : ""}`, {
    headers: await getAuthHeaders(),
  });
  if (!r.ok) throw new Error(await readApiError(r, "Nie udało się pobrać zadań"));
  const payload = (await r.json()) as TodosResponse | Todo[];
  return Array.isArray(payload) ? payload : payload.data;
}

export const Route = createFileRoute("/_app/")({
  component: Dashboard,
  validateSearch: (s: Record<string, unknown>) => ({
    q: typeof s.q === "string" ? s.q.slice(0, 200) : "",
    filter: (STATUS_FILTERS as readonly string[]).includes(s.filter as string)
      ? (s.filter as StatusFilter)
      : ("All" as StatusFilter),
    category: (CATEGORY_FILTERS as readonly string[]).includes(s.category as string)
      ? (s.category as CategoryFilter)
      : ("all" as CategoryFilter),
  }),
  head: () => ({
    meta: [
      { title: "TaskFlow — My Tasks" },
      { name: "description", content: "Zarządzaj swoimi zadaniami z TaskFlow." },
    ],
  }),
});

function Dashboard() {
  const qc = useQueryClient();
  const { q, category, filter } = Route.useSearch();
  const navigate = useNavigate({ from: "/" });
  const { user } = useAuth();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [addOpen, setAddOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const {
    data: todos = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["todos", user?.id, { q, category, filter }],
    queryFn: () => fetchTodos({ q, category, filter }),
    enabled: !!user,
    placeholderData: (prev) => prev,
  });

  const update = useMutation({
    mutationFn: async ({ id, ...rest }: Partial<Todo> & { id: string }) => {
      const r = await fetch(`${API}/${id}`, {
        method: "PATCH",
        headers: await getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(rest),
      });
      if (!r.ok) throw new Error(await readApiError(r, "Update failed"));
      return r.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["todos"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const r = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: await getAuthHeaders(),
      });
      if (!r.ok) throw new Error(await readApiError(r, "Delete failed"));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Zadanie usunięte");
    },
  });

  const filtered = todos;
  const activeFilterCount = Number(filter !== "All");

  return (
    <section className="relative min-h-full">
      <div className="px-4 py-6 sm:px-6 md:py-8 lg:px-8 xl:px-12">
        <header className="mb-6 md:mb-8">
          <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">My Tasks</h1>
          <p className="mt-2 text-muted-foreground">Manage and track your daily tasks</p>
        </header>

        <section aria-label="Filtry i akcje" className="mb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="Filtruj według kategorii">
              {CATEGORY_FILTERS.map((f) => (
                <motion.button
                  key={f}
                  type="button"
                  onClick={() => {
                    setFiltersOpen(false);
                    navigate({
                      search: (prev: {
                        q: string;
                        category: CategoryFilter;
                        filter: StatusFilter;
                      }) => ({
                        ...prev,
                        category: f,
                      }),
                    });
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  aria-pressed={category === f}
                  className={cn(
                    "min-h-[44px] shrink-0 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    category === f
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "border border-border bg-card text-foreground hover:bg-accent",
                  )}
                >
                  {f === "all" ? "All" : CATEGORY_LABEL[f as Category]}
                </motion.button>
              ))}
            </nav>
            <div className="flex gap-2 md:ml-auto">
              <button
                type="button"
                onClick={() => setView(view === "grid" ? "list" : "grid")}
                aria-pressed={view === "grid"}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-border transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={`Switch to ${view === "grid" ? "list" : "grid"} view`}
              >
                {view === "grid" ? (
                  <List className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                ) : (
                  <Grid3x3 className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                )}
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setFiltersOpen((value) => !value)}
                  aria-expanded={filtersOpen}
                  aria-controls="task-filters-menu"
                  className={cn(
                    "flex h-11 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    filter !== "All" ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                  {activeFilterCount ? `${activeFilterCount} active` : "Filters"}
                </button>

                {filtersOpen && (
                  <div
                    id="task-filters-menu"
                    className="absolute right-0 top-12 z-30 w-64 rounded-lg border border-border bg-card p-3 shadow-[var(--shadow-lg)]"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground">Filtr zadań</p>
                      {filter !== "All" && (
                        <button
                          type="button"
                          onClick={() =>
                            navigate({
                              search: (prev: {
                                q: string;
                                category: CategoryFilter;
                                filter: StatusFilter;
                              }) => ({
                                ...prev,
                                filter: "All",
                              }),
                            })
                          }
                          className="text-xs font-medium text-primary hover:underline"
                        >
                          Wyczyść
                        </button>
                      )}
                    </div>
                    <div className="space-y-1">
                      {STATUS_FILTERS.map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => {
                            navigate({
                              search: (prev: {
                                q: string;
                                category: CategoryFilter;
                                filter: StatusFilter;
                              }) => ({
                                ...prev,
                                filter: f,
                              }),
                            });
                            setFiltersOpen(false);
                          }}
                          aria-pressed={filter === f}
                          className={cn(
                            "flex min-h-10 w-full items-center justify-between rounded-md px-3 text-left text-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            filter === f
                              ? "bg-primary/10 font-medium text-primary"
                              : "text-foreground",
                          )}
                        >
                          <span>{f}</span>
                          {filter === f && <Check className="h-4 w-4" aria-hidden="true" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <div role="status" aria-live="polite" className="visually-hidden">
          {isLoading
            ? "Pobieram zadania"
            : `Znaleziono ${filtered.length} zadań. Filtr statusu: ${filter}, kategoria: ${category}`}
        </div>

        {isLoading && (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-16 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Pobieram zadania z API…
          </div>
        )}
        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
            {(error as Error).message}
          </div>
        )}
        {!isLoading && filtered.length === 0 && !error && (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-16 text-center">
            <p className="text-sm text-muted-foreground">
              Brak zadań. Kliknij <strong>Add Task</strong>, aby dodać pierwsze.
            </p>
          </div>
        )}

        <section
          aria-label="Lista zadań"
          className={view === "grid" ? "grid gap-4" : "flex flex-col gap-3"}
          style={
            view === "grid"
              ? { gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))" }
              : undefined
          }
        >
          {filtered.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <TaskCard
                task={task}
                onToggle={() => update.mutate({ id: task.id, completed: !task.completed })}
                onDelete={() => remove.mutate(task.id)}
              />
            </motion.div>
          ))}
        </section>
      </div>

      {/* FAB */}
      <motion.div className="fixed bottom-6 right-6 z-10 md:bottom-8 md:right-8">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          type="button"
          onClick={() => setAddOpen(true)}
          className="flex h-14 items-center justify-center rounded-full px-5 font-medium text-primary-foreground transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:rounded-lg"
          style={{ background: "var(--gradient-brand)", boxShadow: "var(--shadow-xl)" }}
          aria-label="Dodaj nowe zadanie"
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
          <span className="ml-2 hidden md:inline">Add Task</span>
        </motion.button>
      </motion.div>

      <AddTaskDialog open={addOpen} onOpenChange={setAddOpen} />
    </section>
  );
}

function TaskCard({
  task,
  onToggle,
  onDelete,
}: {
  task: Todo;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const overdue = task.due_date && !task.completed && new Date(task.due_date) < new Date();
  const priorityClass = {
    high: "text-priority-high bg-priority-high-bg border-priority-high/20",
    medium: "text-priority-medium bg-priority-medium-bg border-priority-medium/20",
    low: "text-priority-low bg-priority-low-bg border-priority-low/20",
  }[task.priority];

  return (
    <motion.article
      whileHover={{ y: -2, boxShadow: "var(--shadow-md)" }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group overflow-hidden rounded-xl border border-border bg-card transition-all",
        overdue && "border-destructive/30 bg-destructive/5",
      )}
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      <div className="w-full overflow-hidden bg-muted" style={{ aspectRatio: "16/9" }}>
        <img
          src={`https://picsum.photos/seed/task-${task.id}/640/360`}
          width={640}
          height={360}
          alt=""
          decoding="async"
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onToggle}
            className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={task.completed ? "Oznacz jako aktywne" : "Oznacz jako ukończone"}
            aria-pressed={task.completed}
          >
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded border-2 transition-all",
                task.completed
                  ? "border-primary bg-primary"
                  : "border-muted-foreground hover:border-primary",
              )}
            >
              {task.completed && (
                <Check
                  className="h-4 w-4 text-primary-foreground"
                  strokeWidth={3}
                  aria-hidden="true"
                />
              )}
            </motion.div>
          </button>
          <div className="min-w-0 flex-1">
            <h3
              className={cn(
                "mb-2 text-base font-semibold leading-snug text-card-foreground sm:text-lg",
                task.completed && "text-muted-foreground line-through",
              )}
            >
              {task.title}
            </h3>
            {task.description && (
              <p
                className={cn(
                  "mb-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground",
                  task.completed && "line-through",
                )}
              >
                {task.description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold",
                  CATEGORY_STYLE[task.category] ?? CATEGORY_STYLE.other,
                )}
              >
                <span className="visually-hidden">Kategoria: </span>
                {CATEGORY_LABEL[task.category] ?? task.category}
              </span>
              {task.due_date && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium",
                    overdue
                      ? "bg-destructive/10 text-destructive"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="visually-hidden">Termin: </span>
                  {new Date(task.due_date).toLocaleDateString("pl-PL", {
                    month: "short",
                    day: "numeric",
                  })}
                  {overdue && <span className="visually-hidden"> (po terminie)</span>}
                </span>
              )}
              <span
                className={cn(
                  "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold uppercase",
                  priorityClass,
                )}
              >
                <span className="visually-hidden">Priorytet: </span>
                {task.priority}
              </span>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            {overdue && (
              <AlertCircle className="h-5 w-5 text-destructive" aria-label="Zadanie po terminie" />
            )}
            <button
              type="button"
              onClick={onDelete}
              className="flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive focus-visible:bg-destructive/10 focus-visible:text-destructive focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100"
              aria-label={`Usuń zadanie: ${task.title}`}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: "Tytuł musi mieć co najmniej 3 znaki" })
    .max(200, { message: "Tytuł może mieć maks. 200 znaków" }),
  description: z
    .string()
    .trim()
    .max(1000, { message: "Opis może mieć maks. 1000 znaków" })
    .optional()
    .or(z.literal("")),
  priority: z.enum(["low", "medium", "high"]),
  category: z.enum(CATEGORIES),
  due_date: z
    .string()
    .optional()
    .refine((v) => !v || !Number.isNaN(new Date(v).getTime()), { message: "Nieprawidłowa data" }),
});

type TaskForm = z.infer<typeof taskSchema>;

function AddTaskDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const qc = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TaskForm>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      category: "personal",
      due_date: "",
    },
    mode: "onBlur",
  });

  const priority = watch("priority");
  const categoryValue = watch("category");

  const create = useMutation({
    mutationFn: async (values: TaskForm) => {
      const r = await fetch(API, {
        method: "POST",
        headers: await getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          title: values.title.trim(),
          description: values.description?.trim() || null,
          priority: values.priority,
          category: values.category,
          due_date: values.due_date || null,
        }),
      });
      if (!r.ok) throw new Error(await readApiError(r, "Błąd serwera"));
      return r.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Zadanie dodane");
      reset();
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const submitting = isSubmitting || create.isPending;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
          <DialogDescription>Dodaj nowe zadanie do swojej listy.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit((v) => create.mutate(v))} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "title-err" : undefined}
              {...register("title")}
            />
            {errors.title && (
              <p id="title-err" role="alert" className="text-xs font-medium text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="desc">Description</Label>
            <Textarea
              id="desc"
              rows={3}
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? "desc-err" : undefined}
              {...register("description")}
            />
            {errors.description && (
              <p id="desc-err" role="alert" className="text-xs font-medium text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="category">Category</Label>
            <Select
              value={categoryValue}
              onValueChange={(v) => setValue("category", v as Category, { shouldValidate: true })}
            >
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {CATEGORY_LABEL[c]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={priority}
                onValueChange={(v) =>
                  setValue("priority", v as TaskForm["priority"], { shouldValidate: true })
                }
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="due">Due date</Label>
              <Input
                id="due"
                type="date"
                aria-invalid={!!errors.due_date}
                aria-describedby={errors.due_date ? "due-err" : undefined}
                {...register("due_date")}
              />
              {errors.due_date && (
                <p id="due-err" role="alert" className="text-xs font-medium text-destructive">
                  {errors.due_date.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="gap-2">
              {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              Add Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
