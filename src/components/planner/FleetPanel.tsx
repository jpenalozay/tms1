import { useState } from "react";
import { useTMSStore } from "../../store/useStore";
import { Truck, ChevronDown, Plus, Box, Scale } from "lucide-react";
import { cn } from "../../lib/utils";

export const FleetPanel = () => {
  const vehicles = useTMSStore(s => s.vehicles);
  const routes = useTMSStore(s => s.routes);
  const orders = useTMSStore(s => s.orders);

  const [expandedVehicleId, setExpandedVehicleId] = useState<string | null>(null);

  return (
    <div className="w-full h-full bg-[#0b1120] rounded-xl flex flex-col overflow-hidden shadow-2xl relative">
      
      {/* Header */}
      <div className="p-5 pb-4 shrink-0 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight mb-1">Flota y Capacidad</h2>
          <p className="text-slate-400 text-sm">Selecciona los vehículos disponibles para la optimización</p>
        </div>
        <button className="text-[#3b82f6] text-xs font-medium hover:text-blue-400 whitespace-nowrap pt-1">
          Ver resumen
        </button>
      </div>

      {/* Fleet List */}
      <div className="flex-1 overflow-y-auto px-5 pb-5 custom-scrollbar flex flex-col gap-3">
        {vehicles.map(v => {
          const vRoute = routes.find(r => r.vehicleId === v.id);
          const isExpanded = expandedVehicleId === v.id;
          
          // Calculate load
          const routeOrders = orders.filter(o => o.routeId === vRoute?.id);
          const totalWeight = routeOrders.reduce((sum, o) => sum + o.weightKg, 0);
          const totalVolume = routeOrders.reduce((sum, o) => sum + o.volumeM3, 0);
          
          const weightPct = Math.min(100, Math.round((totalWeight / v.maxWeightKg) * 100));
          const volPct = Math.min(100, Math.round((totalVolume / v.maxVolumeM3) * 100));

          return (
            <div key={v.id} className="rounded-xl bg-[#111827] border border-slate-800 transition-colors overflow-hidden shrink-0">
               {/* Vehicle Header */}
               <div 
                  className="p-4 flex items-center justify-between cursor-pointer" 
                  onClick={() => setExpandedVehicleId(isExpanded ? null : v.id)}
               >
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                        <Truck size={20} className="text-emerald-500" />
                     </div>
                     <div>
                        <div className="flex items-center gap-2 mb-0.5">
                           <span className="font-bold text-white tracking-wide">{v.id.replace('v_', 'VHC-0')}</span> {/* Mock mapping to VHC */}
                           <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-2 py-0.5 rounded-sm">
                             Disponible
                           </span>
                        </div>
                        <div className="text-xs text-slate-400 font-medium">
                          {v.type === 'Van' ? 'Furgón' : v.type === 'Truck' ? 'Cajón Cerrado' : 'Moto'} • {(v.maxWeightKg / 1000).toLocaleString()} Ton
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                     <span>Capacidad Total</span>
                     <ChevronDown size={14} className={cn("transition-transform", isExpanded ? "rotate-180" : "")} />
                  </div>
               </div>
               
               {/* Capacity Bars */}
               <div className="px-4 pb-4 flex flex-col gap-4">
                  {/* Volume */}
                  <div className="flex flex-col gap-1.5">
                     <div className="flex justify-between items-center text-xs text-slate-300">
                       <span className="flex items-center gap-2 font-medium"><Box size={14} className="text-slate-500" /> Volumen</span>
                       <span className="font-bold text-slate-400">{volPct}%</span>
                     </div>
                     <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                       <div className="h-full bg-emerald-500 transition-all rounded-full" style={{ width: `${volPct}%` }}></div>
                     </div>
                     <div className="text-right text-[10px] text-slate-500 font-mono">
                        {totalVolume.toFixed(2)} m³ / {v.maxVolumeM3.toFixed(2)} m³
                     </div>
                  </div>

                  {/* Weight */}
                  <div className="flex flex-col gap-1.5">
                     <div className="flex justify-between items-center text-xs text-slate-300">
                       <span className="flex items-center gap-2 font-medium"><Scale size={14} className="text-slate-500" /> Peso</span>
                       <span className="font-bold text-slate-400">{weightPct}%</span>
                     </div>
                     <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                       <div className="h-full bg-[#3b82f6] transition-all rounded-full" style={{ width: `${weightPct}%` }}></div>
                     </div>
                     <div className="text-right text-[10px] text-slate-500 font-mono">
                        {totalWeight.toLocaleString()} kg / {v.maxWeightKg.toLocaleString()} kg
                     </div>
                  </div>
               </div>

               {/* Action Area */}
               <div className="px-4 pb-4">
                  <button className="w-full py-2 bg-[#1e293b]/50 hover:bg-[#1e293b] text-slate-400 hover:text-slate-200 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors border border-slate-700/50">
                     <Plus size={16} /> Asignación Manual
                  </button>
               </div>
               
               {/* Expanded details if needed */}
               {isExpanded && vRoute && (
                 <div className="px-4 pb-4 border-t border-slate-800 pt-3 bg-slate-900/30">
                    <div className="text-xs text-slate-500 text-center">Detalles de paradas...</div>
                 </div>
               )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
