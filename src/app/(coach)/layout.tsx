import { 
  Users, 
  Calendar, 
  Target, 
  Settings,
  LogOut,
  Bell
} from "lucide-react";
import Link from "next/link";

export default function CoachPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#07090D] flex flex-col">
      {/* Mobile-first Top Nav */}
      <nav className="h-16 border-b border-white/5 px-6 flex items-center justify-between bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-white italic">A</div>
          <span className="font-black text-white tracking-tighter uppercase text-xs">Coach Hub</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-slate-400 hover:text-white transition-colors"><Bell size={18} /></button>
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/40" />
        </div>
      </nav>

      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* Bottom Nav for Mobile / Operation-first on Desktop */}
      <nav className="h-20 border-t border-white/5 bg-black/60 backdrop-blur-xl sticky bottom-0 z-50 flex items-center justify-around px-6">
        {[
          { label: 'Sessions', icon: Calendar, href: '/coach-hub' },
          { label: 'Team', icon: Users, href: '/coach-hub?tab=registers' },
          { label: 'Planner', icon: Target, href: '/coach-hub?tab=aiplanner' },
          { label: 'Settings', icon: Settings, href: '/coach-hub?tab=settings' },
        ].map((item, i) => (
          <Link key={i} href={item.href} className="flex flex-col items-center gap-1 group">
            <item.icon size={20} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-indigo-400">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
