import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  CheckSquare,
  Bell,
  User,
  HelpCircle,
  Sparkles,
  Search,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { getAuthHeaders, readApiError } from "@/lib/auth-api";
import {
  buildNotifications,
  notificationToneClass,
  type NotificationTodo,
} from "@/lib/notifications";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

const menu = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Tasks", path: "/", icon: CheckSquare },
  { name: "Notifications", path: "/notifications", icon: Bell },
  { name: "Profile", path: "/profile", icon: User },
  { name: "About / UX", path: "/about", icon: Sparkles },
  { name: "Help", path: "/help", icon: HelpCircle },
];

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const urlSearch = useSearch({ strict: false }) as { q?: string };
  const { user, loading, profile } = useAuth();
  const [searchValue, setSearchValue] = useState(urlSearch.q ?? "");
  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [dark, setDark] = useState(false);

  const { data: notificationTodos = [] } = useQuery({
    queryKey: ["notification-todos", user?.id],
    queryFn: fetchNotificationTodos,
    enabled: !!user,
    refetchInterval: 60_000,
  });
  const notifications = buildNotifications(notificationTodos, profile.displayName);
  const unreadCount = Math.min(
    notifications.filter(
      (notification) => notification.tone === "warning" || notification.tone === "danger",
    ).length,
    9,
  );

  useEffect(() => {
    if (!loading && !user) {
      navigate({
        to: "/login",
        search: { redirect: location.href },
        replace: true,
      });
    }
  }, [loading, location.href, navigate, user]);

  // Sync local input when URL q changes externally (e.g. back/forward)
  useEffect(() => {
    setSearchValue(urlSearch.q ?? "");
  }, [urlSearch.q]);

  // Debounced push to URL → triggers React Query refetch via search params
  useEffect(() => {
    const t = setTimeout(() => {
      const current = urlSearch.q ?? "";
      if (searchValue === current) return;
      navigate({
        to: "/",
        search: (prev: Record<string, unknown>) => ({
          ...prev,
          q: searchValue || undefined,
        }),
      });
    }, 250);
    return () => clearTimeout(t);
  }, [searchValue, urlSearch.q, navigate]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    setNotificationsOpen(false);
  }, [location.pathname]);

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Wylogowano");
    navigate({ to: "/login", replace: true });
  }

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center">
          <div
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg shadow-sm"
            style={{ background: "var(--gradient-brand)" }}
          >
            <CheckSquare className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">Ładowanie konta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <a href="#main" className="skip-link">
        Przejdź do treści głównej
      </a>
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px]">
        <aside
          className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex"
          aria-label="Panel boczny"
        >
          <Brand />
          <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Główna nawigacja">
            {menu.map((item) => (
              <NavItem key={item.name} item={item} active={location.pathname === item.path} />
            ))}
          </nav>
          <div className="border-t border-sidebar-border p-3">
            <button
              type="button"
              onClick={() => setDark((d) => !d)}
              aria-pressed={dark}
              aria-label={dark ? "Przełącz na tryb jasny" : "Przełącz na tryb ciemny"}
              className="flex min-h-[44px] w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sidebar-foreground transition-all hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {dark ? (
                <Sun className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Moon className="h-5 w-5" aria-hidden="true" />
              )}
              <span className="text-sm font-medium">{dark ? "Light Mode" : "Dark Mode"}</span>
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex h-11 w-11 items-center justify-center rounded-lg transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
                aria-label="Otwórz menu"
                aria-expanded={open}
                aria-controls="mobile-nav"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
              <form role="search" className="w-full max-w-md" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="task-search" className="visually-hidden">
                  Szukaj zadań
                </label>
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="task-search"
                    type="search"
                    placeholder="Search tasks..."
                    className="h-10 pl-9"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </div>
              </form>
            </div>
            <div className="relative ml-3 flex shrink-0 items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setNotificationsOpen((value) => !value)}
                className="relative flex h-11 w-11 items-center justify-center rounded-lg transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={`Powiadomienia (${unreadCount} pilne)`}
                aria-expanded={notificationsOpen}
                aria-controls="notifications-menu"
              >
                <Bell className="h-5 w-5 text-foreground" aria-hidden="true" />
                {unreadCount > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-none text-destructive-foreground ring-2 ring-card"
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    id="notifications-menu"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute right-20 top-14 z-40 w-[min(24rem,calc(100vw-2rem))] rounded-lg border border-border bg-card p-2 shadow-[var(--shadow-lg)]"
                  >
                    <div className="flex items-center justify-between px-2 py-2">
                      <p className="text-sm font-semibold text-foreground">Powiadomienia</p>
                      <Link
                        to="/notifications"
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        Zobacz wszystko
                      </Link>
                    </div>
                    <div className="max-h-80 overflow-auto">
                      {notifications.slice(0, 5).map((notification) => {
                        const Icon = notification.icon;
                        return (
                          <div
                            key={notification.id}
                            className="flex gap-3 rounded-md px-2 py-3 hover:bg-accent"
                          >
                            <div
                              className={cn(
                                "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
                                notificationToneClass(notification.tone),
                              )}
                            >
                              <Icon className="h-4 w-4" aria-hidden="true" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <p className="truncate text-sm font-medium text-foreground">
                                  {notification.title}
                                </p>
                                <span className="shrink-0 text-xs text-muted-foreground">
                                  {notification.time}
                                </span>
                              </div>
                              <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                                {notification.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <Link
                to="/profile"
                aria-label={`Profil użytkownika ${profile.displayName}`}
                className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white shadow-sm"
                style={{ background: "var(--gradient-brand)" }}
              >
                {profile.initials}
              </Link>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                aria-label="Wyloguj"
              >
                <LogOut className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>
          </header>

          <main
            id="main"
            tabIndex={-1}
            className="min-h-[100dvh] flex-1 overflow-auto outline-none"
          >
            <Outlet />
          </main>
        </div>

        <AnimatePresence>
          {open && (
            <div
              className="fixed inset-0 z-50 lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Menu nawigacji"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                aria-hidden="true"
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              />
              <motion.aside
                id="mobile-nav"
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", damping: 28, stiffness: 260 }}
                className="absolute left-0 top-0 flex h-full w-[min(82vw,20rem)] flex-col border-r border-sidebar-border bg-sidebar shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-sidebar-border p-5">
                  <Brand />
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex h-11 w-11 items-center justify-center rounded-lg text-sidebar-foreground transition-colors hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Zamknij menu"
                    autoFocus
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
                <nav className="flex flex-1 flex-col gap-1 p-3">
                  {menu.map((item) => (
                    <NavItem
                      key={item.name}
                      item={item}
                      active={location.pathname === item.path}
                      onClick={() => setOpen(false)}
                    />
                  ))}
                </nav>
              </motion.aside>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3 border-b border-sidebar-border p-5">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-lg shadow-sm"
        style={{ background: "var(--gradient-brand)" }}
      >
        <CheckSquare className="h-5 w-5 text-white" />
      </div>
      <span className="text-lg font-bold text-sidebar-foreground">TaskFlow</span>
    </div>
  );
}

async function fetchNotificationTodos(): Promise<NotificationTodo[]> {
  const response = await fetch("/api/todos?limit=50", {
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(await readApiError(response, "Nie udało się pobrać powiadomień"));
  }

  const payload = (await response.json()) as { data?: NotificationTodo[] } | NotificationTodo[];
  return Array.isArray(payload) ? payload : (payload.data ?? []);
}

function NavItem({
  item,
  active,
  onClick,
}: {
  item: (typeof menu)[number];
  active: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      to={item.path}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
          : "text-sidebar-foreground hover:bg-sidebar-accent",
      )}
    >
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span className="text-sm font-medium">{item.name}</span>
    </Link>
  );
}
