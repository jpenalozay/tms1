import React from 'react';
import { useTMSStore } from '../store/useStore';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, TrendingUp, AlertCircle, Clock, MapPin, Truck, Calendar, Filter, Layers } from 'lucide-react';
import { PlannerMap } from '../components/map/PlannerMap';

export const DashboardView = () => {
  const activeView = useTMSStore(s => s.activeView);

  // Mock data for charts
  const orderStatusData = [
    { name: 'En Tránsito', value: 45, color: '#3b82f6' },
    { name: 'Pendientes', value: 28, color: '#f59e0b' },
    { name: 'Entregadas', value: 63, color: '#10b981' },
    { name: 'Canceladas', value: 2, color: '#ef4444' },
  ];

  const performanceData = [
    { date: '08/06', value: 82 },
    { date: '09/06', value: 85 },
    { date: '10/06', value: 90 },
    { date: '11/06', value: 88 },
    { date: '12/06', value: 95 },
    { date: '13/06', value: 92 },
    { date: '14/06', value: 96 },
  ];

  return (
    <div className="w-full h-full flex flex-col p-4 gap-4 bg-[#070b14] text-slate-100 overflow-y-auto custom-scrollbar">
      {/* Top KPIs */}
      <div className="flex gap-4 shrink-0 overflow-x-auto no-scrollbar pb-1">
        <div className="bg-[#0b1120] border border-slate-800 rounded-xl p-4 flex-1 min-w-[200px]">
          <div className="text-sm text-slate-400 mb-1">Órdenes Totales</div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold">128</div>
            <div className="flex items-center gap-1 text-emerald-500 text-xs font-semibold mb-1"><TrendingUp size={14} /> +12% vs ayer</div>
          </div>
        </div>
        <div className="bg-[#0b1120] border border-slate-800 rounded-xl p-4 flex-1 min-w-[200px]">
          <div className="text-sm text-slate-400 mb-1">Órdenes en Tránsito</div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold">45</div>
            <div className="text-slate-500 text-xs mb-1">35% del total</div>
          </div>
        </div>
        <div className="bg-[#0b1120] border border-slate-800 rounded-xl p-4 flex-1 min-w-[200px]">
          <div className="text-sm text-slate-400 mb-1">Entregadas Hoy</div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold">63</div>
            <div className="flex items-center gap-1 text-emerald-500 text-xs font-semibold mb-1"><TrendingUp size={14} /> +8% vs ayer</div>
          </div>
        </div>
        <div className="bg-[#0b1120] border border-slate-800 rounded-xl p-4 flex-1 min-w-[200px]">
          <div className="text-sm text-slate-400 mb-1 flex items-center justify-between">Incidencias <AlertTriangle size={14} className="text-red-500" /></div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-white">7</div>
            <div className="text-red-500 text-xs font-semibold mb-1">↑ 3 críticas</div>
          </div>
        </div>
        <div className="bg-[#0b1120] border border-slate-800 rounded-xl p-4 flex-1 min-w-[200px]">
          <div className="text-sm text-slate-400 mb-1">Vehículos Activos</div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold">32 <span className="text-lg text-slate-500 font-normal">/ 48</span></div>
            <div className="text-slate-500 text-xs mb-1">67% ocupación</div>
          </div>
        </div>
        <div className="bg-[#0b1120] border border-slate-800 rounded-xl p-4 flex-1 min-w-[200px]">
          <div className="text-sm text-slate-400 mb-1">Cumplimiento (OTD)</div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-emerald-500">96.2%</div>
            <div className="flex items-center gap-1 text-emerald-500 text-xs font-semibold mb-1"><TrendingUp size={14} /> +2.4% vs ayer</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-2 shrink-0 w-[240px]">
           <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Rango de Fechas</div>
           <div className="flex gap-2 h-full">
              <button className="flex-1 bg-[#0b1120] border border-slate-800 rounded-lg flex items-center justify-between px-3 text-sm text-slate-300 hover:bg-[#111827] transition-colors">
                 <div className="flex items-center gap-2"><Calendar size={14} className="text-slate-500" /> 14/06/2024</div>
                 <Calendar size={12} className="text-slate-600" />
              </button>
              <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg px-3 flex items-center justify-center text-slate-300 transition-colors">
                 <Filter size={16} />
              </button>
           </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 flex gap-4 min-h-0">
        
        {/* Left Column */}
        <div className="w-[320px] flex flex-col gap-4 shrink-0 overflow-y-auto no-scrollbar pb-4">
          
          {/* Donut Chart */}
          <div className="bg-[#0b1120] border border-slate-800 rounded-xl p-5 flex flex-col shrink-0">
            <div className="flex items-center justify-between mb-4">
               <h3 className="font-semibold text-slate-100">Órdenes por Estado</h3>
               <button className="text-blue-500 text-xs hover:text-blue-400 font-medium">Ver todas</button>
            </div>
            <div className="flex items-center">
               <div className="w-[120px] h-[120px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie
                           data={orderStatusData}
                           innerRadius={40}
                           outerRadius={60}
                           paddingAngle={2}
                           dataKey="value"
                           stroke="none"
                        >
                           {orderStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                           ))}
                        </Pie>
                     </PieChart>
                  </ResponsiveContainer>
               </div>
               <div className="flex-1 pl-4 flex flex-col gap-2">
                  {orderStatusData.map((d, i) => (
                     <div key={i} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                           <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: d.color }}></div>
                           <span className="text-slate-300">{d.name}</span>
                        </div>
                        <div className="text-slate-400 font-medium">{d.value} <span className="text-slate-600 text-[10px]">({Math.round((d.value/138)*100)}%)</span></div>
                     </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Critical Alerts */}
          <div className="bg-[#0b1120] border border-slate-800 rounded-xl p-5 flex flex-col shrink-0">
             <div className="flex items-center justify-between mb-4">
               <h3 className="font-semibold text-slate-100">Alertas Críticas</h3>
               <button className="text-blue-500 text-xs hover:text-blue-400 font-medium">Ver todas</button>
            </div>
            <div className="flex flex-col gap-4">
               <div className="flex gap-3 items-start">
                  <div className="mt-0.5 p-1.5 rounded-md bg-red-500/10 text-red-500 border border-red-500/20"><AlertCircle size={16} /></div>
                  <div className="flex-1">
                     <div className="text-sm font-semibold text-slate-200">Retraso en entrega</div>
                     <div className="text-xs text-slate-400">TRK-002 • 2h 15m de retraso</div>
                  </div>
                  <div className="text-xs text-slate-500">Hace 15 min</div>
               </div>
               <div className="flex gap-3 items-start">
                  <div className="mt-0.5 p-1.5 rounded-md bg-orange-500/10 text-orange-500 border border-orange-500/20"><AlertTriangle size={16} /></div>
                  <div className="flex-1">
                     <div className="text-sm font-semibold text-slate-200">Desviación de ruta</div>
                     <div className="text-xs text-slate-400">TRK-005 • 3.2 km fuera de ruta</div>
                  </div>
                  <div className="text-xs text-slate-500">Hace 22 min</div>
               </div>
               <div className="flex gap-3 items-start">
                  <div className="mt-0.5 p-1.5 rounded-md bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"><AlertTriangle size={16} /></div>
                  <div className="flex-1">
                     <div className="text-sm font-semibold text-slate-200">Mantenimiento próximo</div>
                     <div className="text-xs text-slate-400">VHC-12 • En 150 km o 3 días</div>
                  </div>
                  <div className="text-xs text-slate-500">Hace 1 hora</div>
               </div>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-[#0b1120] border border-slate-800 rounded-xl p-5 flex flex-col flex-1 min-h-[200px]">
             <div className="flex items-center justify-between mb-4">
               <h3 className="font-semibold text-slate-100">Rendimiento de Entregas</h3>
               <span className="text-xs text-slate-500 font-medium">Últ. 7 días</span>
            </div>
            <div className="flex-1 w-full min-h-0">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                     <XAxis dataKey="date" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                     <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} ticks={[0,20,40,60,80,100]} tickFormatter={v => `${v}%`} />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                        itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                     />
                     <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#fff', stroke: '#10b981', strokeWidth: 2 }} />
                  </LineChart>
               </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
               <span className="text-xs text-slate-400">Cumplimiento OTD</span>
            </div>
          </div>
        </div>

        {/* Center Column - Map */}
        <div className="flex-1 bg-[#0b1120] border border-slate-800 rounded-xl overflow-hidden flex flex-col relative shadow-xl">
           <div className="p-3 absolute top-0 left-0 right-0 z-10 flex justify-between pointer-events-none">
              <div className="pointer-events-auto bg-[#070b14]/80 backdrop-blur-sm border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-semibold text-slate-200">
                 <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Vista: En Tiempo Real ˅
              </div>
              <div className="pointer-events-auto bg-[#070b14]/80 backdrop-blur-sm border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer">
                 <Layers size={14} /> Capas ˅
              </div>
           </div>
           
           <div className="flex-1 relative z-0">
              <PlannerMap />
           </div>

           {/* Bottom KPIs strip */}
           <div className="bg-[#070b14] border-t border-slate-800 grid grid-cols-5 p-4 shrink-0 justify-items-start z-10">
              <div className="flex flex-col">
                 <div className="text-xs text-slate-400 font-medium mb-1">Distancia Recorrida (Hoy)</div>
                 <div className="text-xl font-bold text-white">1,245 <span className="text-sm font-normal text-slate-500">km</span></div>
                 <div className="text-[10px] text-emerald-500 mt-1 font-semibold">+8% vs ayer</div>
              </div>
              <div className="flex flex-col">
                 <div className="text-xs text-slate-400 font-medium mb-1">Tiempo en Tránsito</div>
                 <div className="text-xl font-bold text-white">21h 35m</div>
                 <div className="text-[10px] text-emerald-500 mt-1 font-semibold">+5% vs ayer</div>
              </div>
              <div className="flex flex-col">
                 <div className="text-xs text-slate-400 font-medium mb-1">Costo Operativo (Hoy)</div>
                 <div className="text-xl font-bold text-white">S/ 8,745</div>
                 <div className="text-[10px] text-emerald-500 mt-1 font-semibold">-3% vs ayer</div>
              </div>
              <div className="flex flex-col">
                 <div className="text-xs text-slate-400 font-medium mb-1">Combustible (Hoy)</div>
                 <div className="text-xl font-bold text-white">320 <span className="text-sm font-normal text-slate-500">L</span></div>
                 <div className="text-[10px] text-emerald-500 mt-1 font-semibold">-2% vs ayer</div>
              </div>
               <div className="flex flex-col">
                 <div className="text-xs text-slate-400 font-medium mb-1">Emisiones CO2</div>
                 <div className="text-xl font-bold text-white">1.2 <span className="text-sm font-normal text-slate-500">ton</span></div>
                 <div className="text-[10px] text-emerald-500 mt-1 font-semibold">-5% vs ayer</div>
              </div>
           </div>
        </div>

        {/* Right Column */}
        <div className="w-[320px] flex flex-col gap-4 shrink-0 overflow-y-auto no-scrollbar pb-4">
           
           {/* Rutas en Ejecución */}
           <div className="bg-[#0b1120] border border-slate-800 rounded-xl p-5 flex flex-col shrink-0">
             <div className="flex items-center justify-between mb-4">
               <h3 className="font-semibold text-slate-100">Rutas en Ejecución</h3>
               <button className="text-blue-500 text-xs hover:text-blue-400 font-medium">Ver todas</button>
            </div>
            <div className="flex flex-col gap-4">
               <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs">
                     <span className="font-bold text-slate-200">RTA-001</span>
                     <span className="text-slate-400">2/5 entregas</span>
                     <span className="text-emerald-500 font-bold">40%</span>
                  </div>
                  <div className="text-[10px] text-emerald-500 mb-1">En progreso</div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden"><div className="h-full bg-emerald-500" style={{width: '40%'}}></div></div>
               </div>
               <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs">
                     <span className="font-bold text-slate-200">RTA-002</span>
                     <span className="text-slate-400">3/8 entregas</span>
                     <span className="text-emerald-500 font-bold">38%</span>
                  </div>
                  <div className="text-[10px] text-emerald-500 mb-1">En progreso</div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden"><div className="h-full bg-emerald-500" style={{width: '38%'}}></div></div>
               </div>
               <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs">
                     <span className="font-bold text-slate-200">RTA-003</span>
                     <span className="text-slate-400">1/6 entregas</span>
                     <span className="text-red-500 font-bold">17%</span>
                  </div>
                  <div className="text-[10px] text-red-500 mb-1">Retrasada</div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden"><div className="h-full bg-red-500" style={{width: '17%'}}></div></div>
               </div>
               <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs">
                     <span className="font-bold text-slate-200">RTA-004</span>
                     <span className="text-slate-400">4/7 entregas</span>
                     <span className="text-blue-500 font-bold">57%</span>
                  </div>
                  <div className="text-[10px] text-blue-500 mb-1">En progreso</div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden"><div className="h-full bg-blue-500" style={{width: '57%'}}></div></div>
               </div>
            </div>
           </div>

           {/* Vehículos Activos */}
           <div className="bg-[#0b1120] border border-slate-800 rounded-xl p-5 flex flex-col shrink-0">
             <div className="flex items-center justify-between mb-4">
               <h3 className="font-semibold text-slate-100">Vehículos Activos</h3>
               <button className="text-blue-500 text-xs hover:text-blue-400 font-medium">Ver todas</button>
            </div>
            <div className="flex flex-col gap-3">
               <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20"><Truck size={12} className="text-emerald-500"/></div>
                     <span className="font-bold text-slate-200">VHC-01</span>
                  </div>
                  <span className="text-emerald-500">En movimiento</span>
                  <span className="text-slate-400 font-mono">RTA-001</span>
                  <span className="text-slate-400 font-mono">45 km/h</span>
               </div>
               <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20"><Truck size={12} className="text-emerald-500"/></div>
                     <span className="font-bold text-slate-200">VHC-05</span>
                  </div>
                  <span className="text-emerald-500">En movimiento</span>
                  <span className="text-slate-400 font-mono">RTA-002</span>
                  <span className="text-slate-400 font-mono">38 km/h</span>
               </div>
               <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded-md bg-red-500/10 flex items-center justify-center border border-red-500/20"><Truck size={12} className="text-red-500"/></div>
                     <span className="font-bold text-slate-200">VHC-12</span>
                  </div>
                  <span className="text-red-500">Detenido</span>
                  <span className="text-slate-400 font-mono">RTA-003</span>
                  <span className="text-slate-400 font-mono">0 km/h</span>
               </div>
            </div>
           </div>

           {/* Próximas Entregas */}
           <div className="bg-[#0b1120] border border-slate-800 rounded-xl p-5 flex flex-col flex-1 min-h-[220px]">
             <div className="flex items-center justify-between mb-4">
               <h3 className="font-semibold text-slate-100">Próximas Entregas</h3>
               <button className="text-blue-500 text-xs hover:text-blue-400 font-medium">Ver todas</button>
            </div>
            <div className="flex flex-col gap-0 relative">
               <div className="absolute left-2.5 top-2 bottom-3 w-px bg-slate-800"></div>
               
               <div className="flex gap-3 relative pb-4 text-xs">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 border-[3px] border-[#0b1120] relative z-10 shrink-0 mt-0.5"></div>
                  <div className="flex flex-col flex-1">
                     <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold text-slate-300">10:30 <span className="text-slate-100 ml-1">TRK-001</span></span>
                        <span className="text-emerald-500">En camino</span>
                     </div>
                     <span className="text-slate-500 truncate max-w-[180px]">Av. Arequipa 1234, Lima</span>
                  </div>
               </div>
               
               <div className="flex gap-3 relative pb-4 text-xs">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 border-[3px] border-[#0b1120] relative z-10 shrink-0 mt-0.5"></div>
                  <div className="flex flex-col flex-1">
                     <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold text-slate-300">11:00 <span className="text-slate-100 ml-1">TRK-003</span></span>
                        <span className="text-emerald-500">En camino</span>
                     </div>
                     <span className="text-slate-500 truncate max-w-[180px]">Jr. de la Unión 456, Lima</span>
                  </div>
               </div>

               <div className="flex gap-3 relative pb-3 text-xs">
                  <div className="w-5 h-5 rounded-full bg-orange-500 border-[3px] border-[#0b1120] relative z-10 shrink-0 mt-0.5"></div>
                  <div className="flex flex-col flex-1">
                     <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold text-slate-300">11:30 <span className="text-slate-100 ml-1">TRK-002</span></span>
                        <span className="text-orange-500">Pendiente</span>
                     </div>
                     <span className="text-slate-500 truncate max-w-[180px]">Av. Javier Prado 789, Lima</span>
                  </div>
               </div>
            </div>
           </div>

        </div>

      </div>
    </div>
  );
};