import {
  AlertCircle,
  Bell,
  CalendarClock,
  CheckCircle2,
  LogIn,
  Plus,
  type LucideIcon,
} from "lucide-react";

export type NotificationTodo = {
  id: string;
  title: string;
  completed: boolean;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  priority: string;
};

export type AppNotification = {
  id: string;
  title: string;
  description: string;
  time: string;
  tone: "default" | "success" | "warning" | "danger";
  icon: LucideIcon;
};

const DAY_MS = 24 * 60 * 60 * 1000;

export function buildNotifications(todos: NotificationTodo[], displayName: string) {
  const now = Date.now();
  const notifications: AppNotification[] = [
    {
      id: "session",
      title: "Zalogowano do TaskFlow",
      description: `Witaj ${displayName}. Twoje zadania są filtrowane tylko dla tego konta.`,
      time: "teraz",
      tone: "success",
      icon: LogIn,
    },
  ];

  for (const todo of todos) {
    const dueTime = todo.due_date ? new Date(todo.due_date).getTime() : null;

    if (!todo.completed && dueTime && dueTime < now) {
      notifications.push({
        id: `overdue-${todo.id}`,
        title: "Zadanie po terminie",
        description: todo.title,
        time: relativeTime(dueTime),
        tone: "danger",
        icon: AlertCircle,
      });
      continue;
    }

    if (!todo.completed && dueTime && dueTime <= now + DAY_MS) {
      notifications.push({
        id: `due-${todo.id}`,
        title: "Deadline już blisko",
        description: todo.title,
        time: relativeTime(dueTime),
        tone: "warning",
        icon: CalendarClock,
      });
      continue;
    }

    if (todo.completed && Date.now() - new Date(todo.updated_at).getTime() < DAY_MS) {
      notifications.push({
        id: `done-${todo.id}`,
        title: "Zadanie ukończone",
        description: todo.title,
        time: relativeTime(new Date(todo.updated_at).getTime()),
        tone: "success",
        icon: CheckCircle2,
      });
      continue;
    }

    if (Date.now() - new Date(todo.created_at).getTime() < DAY_MS) {
      notifications.push({
        id: `created-${todo.id}`,
        title: "Dodano nowe zadanie",
        description: todo.title,
        time: relativeTime(new Date(todo.created_at).getTime()),
        tone: "default",
        icon: Plus,
      });
    }
  }

  if (notifications.length === 1) {
    notifications.push({
      id: "empty",
      title: "Brak pilnych alertów",
      description: "Dodaj zadanie z terminem, aby zobaczyć alerty deadline.",
      time: "dzisiaj",
      tone: "default",
      icon: Bell,
    });
  }

  return notifications.slice(0, 8);
}

export function notificationToneClass(tone: AppNotification["tone"]) {
  if (tone === "success") return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  if (tone === "warning") return "bg-amber-500/10 text-amber-700 dark:text-amber-300";
  if (tone === "danger") return "bg-destructive/10 text-destructive";
  return "bg-primary/10 text-primary";
}

function relativeTime(timestamp: number) {
  const diff = timestamp - Date.now();
  const abs = Math.abs(diff);
  const rtf = new Intl.RelativeTimeFormat("pl", { numeric: "auto" });

  if (abs < 60 * 60 * 1000) return rtf.format(Math.round(diff / (60 * 1000)), "minute");
  if (abs < DAY_MS) return rtf.format(Math.round(diff / (60 * 60 * 1000)), "hour");
  return rtf.format(Math.round(diff / DAY_MS), "day");
}
