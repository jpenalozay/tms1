import { Bell, Menu, Search, Settings, ChevronDown } from "lucide-react";
import { useTMSStore } from "../../store/useStore";

export const Topbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const activeView = useTMSStore(s => s.activeView);
  const viewTitle = activeView === 'planner' ? 'Planificador de Rutas (VRP)' : 'Centro de Control Logístico';

  return (
    <header className="h-[60px] w-full border-b border-slate-800 bg-[#070b14] flex items-center justify-between px-6 shrink-0 z-10 relative">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-100 transition-colors">
          <Menu size={20} />
        </button>
        <h1 className="text-base font-semibold tracking-tight text-white flex gap-3 items-center">
          O-Logic TMS 
          <span className="w-px h-4 bg-slate-700"></span>
          <span className="font-normal text-slate-400">{viewTitle}</span>
        </h1>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative hidden md:flex items-center">
          <Search size={14} className="absolute left-3 text-slate-500" />
          <input 
            type="text" 
            placeholder="Buscar órdenes, rutas, vehículos..."
            className="bg-[#0f172a] border border-slate-800 text-sm rounded-lg pl-9 pr-12 py-1.5 focus:outline-none focus:border-brand-emerald w-[300px] text-slate-200 transition-colors placeholder:text-slate-500"
          />
          <div className="absolute right-2 flex gap-1">
            <kbd className="bg-slate-800 border border-slate-700 text-slate-400 rounded px-1.5 py-0.5 text-[10px] font-mono">⌘K</kbd>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Status Badge */}
          <div className="flex items-center gap-2 bg-[#0f172a] border border-slate-800 rounded-full px-3 py-1.5 text-xs text-slate-300 font-medium cursor-pointer hover:bg-slate-800/80 transition-colors">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
            En Línea
            <ChevronDown size={14} className="text-slate-500 ml-1" />
          </div>

          <div className="w-px h-5 bg-slate-800"></div>

          {/* Hexagon icon seen in mockup */}
          <button className="text-slate-400 hover:text-slate-200 transition-colors">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
             </svg>
          </button>

          <button className="relative text-slate-400 hover:text-slate-200 transition-colors">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border-2 border-[#070b14]">
              12
            </span>
          </button>
          
          <button className="text-slate-400 hover:text-slate-200 transition-colors">
            <Settings size={20} />
          </button>

          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white border border-slate-600 ml-2">
            AD
          </div>
        </div>
      </div>
    </header>
  );
};
