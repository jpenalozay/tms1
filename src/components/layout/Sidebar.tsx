import { Map, Package, Truck, Settings, AlertTriangle, FileText, Bell, LayoutDashboard, Route } from "lucide-react";
import { cn } from "../../lib/utils";
import { useTMSStore } from "../../store/useStore";
import { translations } from "../../i18n";

export const Sidebar = ({ collapsed }: { collapsed: boolean }) => {
  const language = useTMSStore(s => s.language);
  const t = translations[language];
  const activeView = useTMSStore(s => s.activeView);
  const setActiveView = useTMSStore(s => s.setActiveView);

  const menus = [
    { id: 'dashboard', name: 'Resumen', icon: LayoutDashboard },
    { id: 'orders', name: 'Órdenes', icon: Package },
    { id: 'planner', name: 'Rutas', icon: Route },
    { id: 'map', name: 'Mapa', icon: Map },
    { id: 'fleet', name: 'Flota', icon: Truck },
    { id: 'incidents', name: 'Incidencias', icon: AlertTriangle, badge: 7 },
    { id: 'reports', name: 'Reportes', icon: FileText },
    { id: 'alerts', name: 'Alertas', icon: Bell },
    { id: 'settings', name: 'Configuración', icon: Settings },
  ];

  return (
    <aside className={cn(
      "h-full border-r border-slate-200 dark:border-slate-800 bg-[#070b14] dark:bg-[#070b14] transition-all duration-300 flex flex-col items-center py-6",
      collapsed ? "w-16" : "w-[240px]"
    )}>
      <div className="w-8 h-8 bg-brand-emerald rounded-lg mb-8 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
        <span className="text-slate-900 font-bold tracking-tighter self-center">O</span>
      </div>

      <nav className="flex-1 w-full px-3 flex flex-col gap-1.5 overflow-y-auto no-scrollbar">
        {menus.map((m) => {
          const isActive = activeView === m.id || (activeView === 'planner' && m.id === 'planner') || (activeView === 'dashboard' && m.id === 'dashboard');
          return (
            <button
              key={m.id}
              onClick={() => {
                if (m.id === 'dashboard' || m.id === 'planner') {
                  setActiveView(m.id);
                }
              }}
              className={cn(
                "w-full flex items-center p-2.5 rounded-xl transition-all relative group",
                isActive 
                  ? "bg-slate-800/80 text-brand-emerald border-l-[3px] border-l-brand-emerald rounded-l-md" 
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border-l-[3px] border-l-transparent",
                collapsed ? "justify-center" : "justify-start gap-3 px-4"
              )}
              title={collapsed ? m.name : undefined}
            >
              <m.icon size={18} className="shrink-0" />
              {!collapsed && <span className="font-medium text-sm flex-1 text-left">{m.name}</span>}
              {!collapsed && m.badge && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                  {m.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto px-3 w-full shrink-0 pt-4">
        <button
          className={cn(
            "w-full flex items-center p-2.5 rounded-xl transition-all text-slate-400 hover:text-slate-100 hover:bg-slate-800/50",
            collapsed ? "justify-center" : "justify-start gap-3 px-4"
          )}
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand-purple to-brand-emerald shrink-0" />
          {!collapsed && <div className="flex-1 text-xs font-medium truncate text-left text-slate-300">Colapsar</div>}
        </button>
      </div>
    </aside>
  );
};
