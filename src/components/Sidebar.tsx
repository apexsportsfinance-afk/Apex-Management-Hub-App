"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  Calendar,
  CreditCard,
  Users,
  UserCheck,
  Building2,
  BarChart3,
  AlertCircle,
  Settings,
  Clock,
  UserPlus,
  Layers,
  FileText,
  ChevronDown,
  TrendingUp,
  Copy,
  RefreshCw,
  Target,
  Heart,
  Award,
  Box,
  Group,
  Shield,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },

  { section: "TIME MANAGEMENT" },
  { label: "Weekly Schedule",    href: "/schedule",          icon: Clock       },
  { label: "Schedule Templates", href: "/schedule/templates",icon: Copy        },
  { label: "Package Schedule",   href: "/schedule/package",  icon: Calendar    },
  { label: "Class Roster",       href: "/classes",           icon: Layers      },

  { section: "BOOKINGS" },
  { label: "All Bookings",      href: "/bookings",          icon: CalendarDays },
  { label: "New Booking",       href: "/bookings/new",      icon: UserPlus    },

  { section: "MANAGEMENT" },
  { label: "Coach Hub",         href: "/coach-hub",         icon: UserCheck   },
  { label: "Progress Logs",     href: "/coach-hub/progress",icon: FileText    },
  { label: "Allocate Athlete",  href: "/allocate",          icon: UserCheck   },
  { label: "Medical Pulse",     href: "/medical",           icon: Heart       },
  { label: "Family CRM",        href: "/crm/family",        icon: Group       },
  { label: "Inventory Hub",      href: "/inventory",         icon: Box         },
  { label: "Athletes",          href: "/athletes",          icon: Users       },
  { label: "Venues",            href: "/venues",            icon: Building2   },

  { section: "FINANCE & EXPIRE" },
  { label: "Payments",          href: "/payments",          icon: CreditCard  },
  { label: "Subscriptions",     href: "/subscriptions",     icon: RefreshCw   },
  { label: "Expiry Alerts",     href: "/expiry",            icon: AlertCircle },

  { section: "REPORTING" },
  { label: "Reports Center",    href: "/reports",            icon: BarChart3  },
  { label: "Marketing ROI",     href: "/marketing",          icon: Target     },

  { section: "AI INTELLIGENCE" },
  { label: "AI Optimizer",      href: "/ai/optimizer",       icon: TrendingUp },
  { label: "Progress Engine",   href: "/ai/progress",        icon: FileText   },

  { section: "PARENT PORTAL" },
  { label: "My Moments",        href: "/moments",            icon: Award      },

  { section: "SETTINGS" },
  { label: "Settings",          href: "/settings",           icon: Settings   },
  { label: "RBAC Setup",        href: "/settings/rbac",      icon: Shield     },
];

export default function Sidebar() {
  // SSR-safe active path detection — avoids the usePathname version mismatch
  const [pathname, setPathname] = useState("/");
  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Link href="/" className="flex items-center gap-3" style={{ textDecoration: "none" }}>
          <div className="sidebar-logo-icon">🏋️</div>
          <div>
            <div className="sidebar-brand">
              Apex <span>Sports</span>
            </div>
            <div style={{ fontSize: "11px", color: "#475569", marginTop: "1px" }}>
              Management Hub
            </div>
          </div>
        </Link>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, i) => {
          if ("section" in item) {
            return (
              <div key={i} className="nav-section-label">
                {item.section}
              </div>
            );
          }
          const Icon = item.icon!;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href!));
          return (
            <Link
              key={item.href}
              href={item.href!}
              onClick={() => setPathname(item.href!)}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <Icon className="nav-icon" size={16} />
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontSize: "11px", color: "#334155", textAlign: "center" }}>
          Apex Sports Hub v2.0
        </div>
      </div>
    </aside>
  );
}
