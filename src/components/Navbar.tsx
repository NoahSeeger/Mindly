"use client";

import { Home, PlusCircle, BookOpen, Settings, Archive } from "lucide-react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: PlusCircle, label: "New Entry", href: "/daily_entry" },
  { icon: BookOpen, label: "Templates", href: "/templates" },
  { icon: Archive, label: "History", href: "/History" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function BottomNavbar() {
  const pathname = useLocation().pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="container mx-auto px-4">
        <ul className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-16 text-muted-foreground transition-colors",
                  pathname === item.href && "text-primary"
                )}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
