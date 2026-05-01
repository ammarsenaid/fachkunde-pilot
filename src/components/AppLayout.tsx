import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { GraduationCap, Menu, X } from "lucide-react";
import * as Icons from "lucide-react";
import { useState } from "react";
import { navigationItems } from "@/data/mock";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function AppLayout() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

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
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Anmelden</Button>
            <Button size="sm" className="hidden sm:inline-flex bg-primary hover:bg-primary-hover">Registrieren</Button>
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
