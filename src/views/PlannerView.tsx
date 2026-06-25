import { useState } from "react";
import { PlannerMap } from "../components/map/PlannerMap";
import { OrdersTableForm } from "../components/planner/OrdersTableForm";
import { FleetPanel } from "../components/planner/FleetPanel";
import { useTMSStore } from "../store/useStore";
import { translations } from "../i18n";
import { Layers } from "lucide-react";

export const PlannerView = () => {
  const [mapFocusCoords, setMapFocusCoords] = useState<[number, number] | null>(null);
  const [showFleetPanel, setShowFleetPanel] = useState(true);
  const language = useTMSStore(s => s.language);
  const t = translations[language];

  // Split view Layout based on the mockup analysis Request
  // Left: Data Table & Filters (approx 55%)
  // Right: Map with Fleet Panel floating on it (approx 45%)

  return (
    <div className="w-full h-full flex flex-col xl:flex-row bg-slate-100 dark:bg-[#020617] p-4 gap-4 overflow-hidden relative transition-colors">
      
      {/* 1. Left Pane - Orders Pending */}
      <div className="w-full xl:w-[35%] 2xl:w-[30%] flex flex-col gap-4 h-full shrink-0 z-10 transition-all duration-300">
        <OrdersTableForm onOrderClick={(lat, lng) => setMapFocusCoords([lat, lng])} />
      </div>

      {/* 2. Center Pane - Operations Map */}
      <div className="flex-1 h-full relative rounded-2xl bg-white dark:bg-[#0f172a]/90 backdrop-blur-md overflow-hidden border border-slate-200 dark:border-slate-800 z-10 shadow-sm dark:shadow-inner">
        <PlannerMap focusCoords={mapFocusCoords} />
      </div>

      {/* 3. Right Pane - Routes & Fleet */}
      <div className={`w-full xl:w-[30%] 2xl:w-[25%] flex flex-col gap-4 h-full shrink-0 z-10 transition-all duration-300 ${!showFleetPanel ? 'hidden' : ''}`}>
        <FleetPanel />
      </div>
    </div>
  );
};
