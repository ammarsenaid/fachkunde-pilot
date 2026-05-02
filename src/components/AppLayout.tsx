import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { GraduationCap, Menu, X, LogOut, User as UserIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { useState } from "react";
import { navigationItems as baseNav } from "@/data/mock";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, profile, isAdmin, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Hide Admin entry for non-admins
  const navigationItems = baseNav.filter((i) => i.href !== "/admin" || isAdmin);

  const initials = (profile?.display_name || user?.email || "U")
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth", { replace: true });
  };

  // Bottom mobile nav: keep top 5
  const mobileNav = navigationItems.slice(0, 5);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="hidden flex-col leading-tight sm:flex">
              <span className="text-sm font-bold text-foreground">Fachkunde</span>
              <span className="text-[11px] text-muted-foreground">Taxi & Mietwagen</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navigationItems.map((item) => {
              const Icon = (Icons as any)[item.icon];
              const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-accent-blue-soft text-accent-blue"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full p-1 transition hover:bg-secondary" aria-label="Konto">
                  <Avatar className="h-8 w-8">
                    {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt={profile.display_name ?? ""} />}
                    <AvatarFallback className="bg-accent-blue text-xs font-semibold text-primary-foreground">{initials}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col">
                  <span className="text-sm font-semibold">{profile?.display_name ?? "Lernender"}</span>
                  <span className="truncate text-xs font-normal text-muted-foreground">{user?.email}</span>
                  {isAdmin && <span className="mt-1 w-fit rounded-md bg-accent-blue-soft px-1.5 py-0.5 text-[10px] font-semibold text-accent-blue">Admin</span>}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                  <UserIcon className="mr-2 h-4 w-4" /> Mein Profil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Abmelden
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menü">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="border-t border-border bg-card lg:hidden animate-fade-in">
            <nav className="container-page grid grid-cols-2 gap-2 py-4">
              {navigationItems.map((item) => {
                const Icon = (Icons as any)[item.icon];
                const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium",
                      active ? "bg-accent-blue-soft text-accent-blue" : "text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 pb-24 lg:pb-12">
        <Outlet />
      </main>

      {/* Bottom mobile nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background/95 backdrop-blur-md lg:hidden">
        <div className="grid grid-cols-5">
          {mobileNav.map((item) => {
            const Icon = (Icons as any)[item.icon];
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium",
                  active ? "text-accent-blue" : "text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
