import { useTMSStore } from "../../store/useStore";
import { Search, Filter, Calendar, Zap, LayoutList, Columns } from "lucide-react";
import { cn } from "../../lib/utils";
import { useState } from "react";

export const OrdersTableForm = ({ onOrderClick }: { onOrderClick?: (lat: number, lng: number, id: string) => void }) => {
  const orders = useTMSStore(s => s.orders);
  const setSelectedOrderId = useTMSStore(s => s.setSelectedOrderId);
  const selectedOrderId = useTMSStore(s => s.selectedOrderId);
  const [searchVal, setSearchVal] = useState("");

  const selectedOrdersForRouting = useTMSStore(s => s.selectedOrdersForRouting);
  const toggleOrderForRouting = useTMSStore(s => s.toggleOrderForRouting);
  const selectAllOrdersForRouting = useTMSStore(s => s.selectAllOrdersForRouting);
  const triggerOptimization = useTMSStore(s => s.triggerOptimization);
  const isOptimizing = useTMSStore(s => s.isOptimizing);

  const pendingOrders = orders.filter(o => o.status === "Pending");
  const filteredOrders = pendingOrders.filter(o => o.trackingCode.toLowerCase().includes(searchVal.toLowerCase()) || o.customerName.toLowerCase().includes(searchVal.toLowerCase()));
  const isAllSelected = filteredOrders.length > 0 && filteredOrders.every(o => selectedOrdersForRouting.includes(o.id));

  // Stats
  const routedSelectedOrders = orders.filter(o => selectedOrdersForRouting.includes(o.id));
  const totalVol = routedSelectedOrders.reduce((acc, o) => acc + o.volumeM3, 0);
  const totalWeight = routedSelectedOrders.reduce((acc, o) => acc + o.weightKg, 0);
  const totalClients = new Set(routedSelectedOrders.map(o => o.customerName)).size;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-col h-full bg-[#0b1120] rounded-xl overflow-hidden shadow-2xl relative">
      
      {/* Header */}
      <div className="p-5 pb-4 shrink-0">
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-lg font-bold text-white tracking-tight">Órdenes Pendientes</h2>
          <span className="bg-slate-800 text-slate-300 text-xs font-bold px-2 py-0.5 rounded-full">{pendingOrders.length}</span>
        </div>
        <p className="text-slate-400 text-sm mb-4">Selecciona las órdenes que deseas planificar</p>
        
        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-3 items-end mb-4">
          <div className="flex flex-col gap-1.5 w-full sm:w-[160px]">
            <label className="text-[11px] text-slate-400 font-medium">Fecha de Despacho</label>
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="date" defaultValue={today} className="w-full bg-[#111827] border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-brand-emerald transition-colors placeholder:text-slate-600" />
            </div>
          </div>
          <div className="flex-1 relative w-full">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Buscar por cliente, código, dirección..." 
              className="w-full bg-[#111827] border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-brand-emerald transition-colors"
            />
          </div>
          <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-sm font-medium px-4 py-1.5 rounded-lg flex items-center gap-2 transition-colors shrink-0">
            <Filter size={14} /> Filtros
          </button>
        </div>

        {/* Selection Action Row */}
        <div className="flex items-center justify-between text-sm py-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={isAllSelected} 
              onChange={(e) => selectAllOrdersForRouting(e.target.checked, filteredOrders.map(o => o.id))} 
              className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500 cursor-pointer accent-emerald-500"
            />
            {selectedOrdersForRouting.length > 0 && (
              <span className="text-emerald-500 font-semibold">{selectedOrdersForRouting.length} seleccionadas</span>
            )}
          </label>
          <button 
            onClick={() => selectAllOrdersForRouting(false, filteredOrders.map(o => o.id))}
            className="text-[#3b82f6] text-xs hover:text-blue-400 font-medium transition-colors"
          >
            Limpiar selección ˅
          </button>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="flex-1 overflow-x-auto overflow-y-auto px-5 custom-scrollbar relative">
        <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
          <thead className="bg-[#0b1120] text-slate-400 border-b border-slate-800 sticky top-0 z-10">
            <tr>
              <th className="py-3 w-8"></th>
              <th className="py-3 font-semibold px-2">Cliente</th>
              <th className="py-3 font-semibold px-2">Código</th>
              <th className="py-3 font-semibold px-2">Volumen (m³)</th>
              <th className="py-3 font-semibold px-2">Peso (Kg)</th>
              <th className="py-3 font-semibold px-2">Ventana Horaria</th>
              <th className="py-3 font-semibold px-2">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredOrders.length === 0 ? (
               <tr>
                  <td colSpan={7} className="px-2 py-8 text-center text-slate-500">No orders found.</td>
               </tr>
            ) : (
              filteredOrders.map(o => (
                <tr 
                  key={o.id} 
                  onClick={() => {
                    setSelectedOrderId(o.id);
                    onOrderClick?.(o.destLat, o.destLng, o.id);
                  }}
                  className={cn(
                    "hover:bg-[#111827] cursor-pointer transition-colors group", 
                    selectedOrderId === o.id ? "bg-[#111827]" : ""
                  )}
                >
                  <td className="py-3 px-1" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      disabled={o.status === "Routed"} 
                      checked={selectedOrdersForRouting.includes(o.id) || o.status === "Routed"} 
                      onChange={() => toggleOrderForRouting(o.id)} 
                      className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500 cursor-pointer accent-emerald-500" 
                    />
                  </td>
                  <td className="py-3 px-2 text-slate-200 font-medium truncate max-w-[150px]">{o.customerName}</td>
                  <td className="py-3 px-2 text-slate-400 font-mono">{o.trackingCode}</td>
                  <td className="py-3 px-2 text-slate-400 font-mono">{o.volumeM3.toFixed(2)}</td>
                  <td className="py-3 px-2 text-slate-400 font-mono">{o.weightKg}</td>
                  <td className="py-3 px-2 text-slate-400 font-mono">{o.windowStart} - {o.windowEnd}</td>
                  <td className="py-3 px-2">
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-1 rounded-md font-medium border border-slate-700">
                      Sin Asignar
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Footer Stats & Button (sticky at bottom) */}
      <div className="shrink-0 p-5 border-t border-slate-800 bg-[#0b1120] relative z-20">
         <div className="grid grid-cols-4 gap-2 mb-4 text-center divide-x divide-slate-800">
            <div className="flex flex-col items-center justify-center p-1">
               <div className="text-base font-bold text-white mb-0.5">{selectedOrdersForRouting.length}</div>
               <div className="text-[10px] text-slate-400 font-medium uppercase tracking-widest flex items-center gap-1">Órdenes</div>
            </div>
            <div className="flex flex-col items-center justify-center p-1">
               <div className="text-base font-bold text-white mb-0.5">{totalVol.toFixed(2)} <span className="text-xs text-slate-400">m³</span></div>
               <div className="text-[10px] text-slate-400 font-medium uppercase tracking-widest flex items-center gap-1">Volumen Total</div>
            </div>
            <div className="flex flex-col items-center justify-center p-1">
               <div className="text-base font-bold text-white mb-0.5">{totalWeight.toLocaleString()} <span className="text-xs text-slate-400">kg</span></div>
               <div className="text-[10px] text-slate-400 font-medium uppercase tracking-widest flex items-center gap-1">Peso Total</div>
            </div>
            <div className="flex flex-col items-center justify-center p-1">
               <div className="text-base font-bold text-white mb-0.5">{totalClients}</div>
               <div className="text-[10px] text-slate-400 font-medium uppercase tracking-widest flex items-center gap-1">Clientes</div>
            </div>
         </div>

        <button 
          onClick={triggerOptimization}
          disabled={isOptimizing || selectedOrdersForRouting.length === 0}
          className="w-full bg-[#10b981] text-white font-bold py-3.5 rounded-lg shadow-lg hover:bg-[#059669] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mb-3"
        >
          {isOptimizing ? (
            <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Calculando...</>
          ) : (
            <><Zap size={18} className="fill-white" /> Optimizar Selección con IA</>
          )}
        </button>
        <p className="text-center text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
          La IA calculará las mejores rutas y asignará las órdenes a los vehículos más eficientes.
        </p>
      </div>
    </div>
  );
};
