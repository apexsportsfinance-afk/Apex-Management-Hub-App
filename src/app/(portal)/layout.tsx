import { 
  Home,
  Trophy,
  Activity,
  CreditCard,
  User,
  Settings
} from "lucide-react";
import Link from "next/link";

export default function ParentPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#07090D] flex flex-col">
      {/* Consumer-grade Header */}
      <nav className="h-16 border-b border-white/5 px-6 flex items-center justify-between bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center font-black text-white italic">A</div>
          <span className="font-black text-white tracking-tighter uppercase text-xs">Moments Portal</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-black text-slate-500 uppercase tracking-widest">
           Family Account
        </div>
      </nav>

      <main className="flex-1 p-6 max-w-5xl mx-auto w-full">
        {children}
      </main>

      {/* Modern Bottom Tab Bar */}
      <nav className="h-20 border-t border-white/5 bg-black/80 backdrop-blur-2xl sticky bottom-0 z-50 flex items-center justify-around px-8 pb-4">
        {[
          { label: 'Moments', icon: Home, href: '/moments' },
          { label: 'Events', icon: Trophy, href: '/moments?tab=competitions' },
          { label: 'Progress', icon: Activity, href: '/moments?tab=progress' },
          { label: 'Billing', icon: CreditCard, href: '/moments?tab=billing' },
          { label: 'Profile', icon: User, href: '/moments/profile' },
        ].map((item, i) => (
          <Link key={i} href={item.href} className="flex flex-col items-center gap-1 group">
            <item.icon size={22} className="text-slate-500 group-hover:text-rose-500 transition-all transform group-active:scale-95" />
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-tight group-hover:text-rose-500 transition-colors">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
