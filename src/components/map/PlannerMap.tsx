import { useEffect, useRef, useState, Fragment } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import { useTMSStore } from "../../store/useStore";
import { translations } from "../../i18n";
import { getStreetRoute } from "../../lib/osrm";

// Premium Custom HTML Icons
const depotIcon = new L.DivIcon({
  html: `<div class="relative flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 border-[3px] border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] z-30 transition-transform hover:scale-105">
           <div class="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,1)]"></div>
         </div>`,
  className: "",
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

const orderIcon = (isRouted: boolean, sequence?: number, color: string = '#10b981') => {
  const isPending = !isRouted;
  const bgColor = isPending ? '#cbd5e1' : color;
  const borderColor = isPending ? '#94a3b8' : color;
  const shadowColor = isPending ? 'rgba(0,0,0,0.1)' : `${color}66`; // Adding alpha
  
  return new L.DivIcon({
    html: `<div class="relative flex items-center justify-center w-7 h-7 rounded-full bg-white dark:bg-[#020617] border-[2.5px] z-20" style="border-color: ${borderColor}; box-shadow: 0 0 12px ${shadowColor};">
             ${isRouted && sequence !== undefined
               ? `<span class="text-[11px] font-bold text-slate-800 dark:text-slate-100">${sequence}</span>`
               : `<div class="w-1.5 h-1.5 rounded-full" style="background-color: ${bgColor};"></div>`
             }
           </div>`,
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

// Component to handle map bounds adjusting to data
const MapBoundsAdjuster = ({ points }: { points: [number, number][] }) => {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
    }
  }, [points, map]);
  return null;
};

// Component to handle map recentering
const MapRecenter = ({ focusCoords }: { focusCoords: [number, number] | null }) => {
  const map = useMap();
  useEffect(() => {
    if (focusCoords) {
      map.flyTo(focusCoords, 15, { duration: 1.5 });
    }
  }, [focusCoords, map]);
  return null;
};

export const PlannerMap = ({ focusCoords }: { focusCoords: [number, number] | null }) => {
  const depots = useTMSStore(s => s.depots);
  const orders = useTMSStore(s => s.orders);
  const routes = useTMSStore(s => s.routes);
  const selectedOrderId = useTMSStore(s => s.selectedOrderId);
  const vehicles = useTMSStore(s => s.vehicles);
  const language = useTMSStore(s => s.language);
  
  const getRouteColor = (routeId?: string) => {
    if (!routeId) return '#94a3b8';
    const route = routes.find(r => r.id === routeId);
    if (!route) return '#94a3b8';
    const vehicle = vehicles.find(v => v.id === route.vehicleId);
    return vehicle?.color || '#10b981';
  }
  const theme = useTMSStore(s => s.theme);
  const t = translations[language];

  const [selectedRouteCache, setSelectedRouteCache] = useState<{[key: string]: [number, number][]}>({});
  const [activeRoutePath, setActiveRoutePath] = useState<[number, number][]>([]);

  // Map settings
  const center: [number, number] = depots.length > 0 ? [depots[0].lat, depots[0].lng] : [-12.0464, -77.0428];
  
  // Selected line logic using OSRM
  useEffect(() => {
    async function loadRoute() {
      const selectedOrderObj = orders.find(o => o.id === selectedOrderId);
      if (selectedOrderObj && depots.length > 0) {
        const cacheKey = `${selectedOrderId}_${depots[0].id}`;
        if (selectedRouteCache[cacheKey]) {
          setActiveRoutePath(selectedRouteCache[cacheKey]);
        } else {
          try {
            const path = await getStreetRoute([
              [depots[0].lat, depots[0].lng],
              [selectedOrderObj.destLat, selectedOrderObj.destLng]
            ]);
            setSelectedRouteCache(prev => ({ ...prev, [cacheKey]: path }));
            setActiveRoutePath(path);
          } catch (e) {
            console.error("Failed to load OSRM path", e);
            setActiveRoutePath([
              [depots[0].lat, depots[0].lng],
              [selectedOrderObj.destLat, selectedOrderObj.destLng]
            ]);
          }
        }
      } else {
        setActiveRoutePath([]);
      }
    }
    loadRoute();
  }, [selectedOrderId, orders, depots]);

  const allPoints: [number, number][] = [
    ...depots.map(d => [d.lat, d.lng] as [number, number]),
    ...orders.map(o => [o.destLat, o.destLng] as [number, number])
  ];

  return (
    <div className="absolute inset-0 z-0 bg-white dark:bg-[#020617] transition-colors">
      <MapContainer 
        center={center} 
        zoom={12} 
        zoomControl={false} 
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
        <MapBoundsAdjuster points={allPoints} />
        <MapRecenter focusCoords={focusCoords} />
        
        <TileLayer
          key={theme}
          url={theme === 'dark' 
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        />

        {depots.map(d => (
          <Marker key={d.id} position={[d.lat, d.lng]} icon={depotIcon}>
            <Tooltip direction="top" offset={[0, -16]} className="!bg-white dark:!bg-[#0f172a] !border !border-slate-200 dark:!border-slate-800 !text-slate-900 !shadow-xl dark:!text-slate-100 !font-medium !p-3 !rounded-xl !opacity-100">
              <div className="text-emerald-500 text-xs mb-1 font-bold tracking-wider uppercase">Centro de Origen</div>
              <div className="font-semibold text-sm text-slate-800 dark:text-slate-100">{d.name}</div>
            </Tooltip>
          </Marker>
        ))}

        {orders.map(o => (
          <Marker key={o.id} position={[o.destLat, o.destLng]} icon={orderIcon(o.status === "Routed", o.routeSequence, getRouteColor(o.routeId))}>
            <Tooltip direction="top" offset={[0, -12]} className="!bg-white dark:!bg-[#0f172a] !shadow-2xl !border !border-slate-200 dark:!border-slate-800 !text-slate-900 dark:!text-slate-100 !p-3 !rounded-xl !opacity-100">
              <div className="flex flex-col">
                <span className="text-[10px] text-amber-500 mb-1 font-bold uppercase tracking-wider">{t.selectedOrder || 'Orden'} {o.routeSequence ? `#${o.routeSequence}` : ''}</span>
                <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 mb-1">ID: <span className="font-semibold text-slate-700 dark:text-slate-200">{o.trackingCode}</span></span>
                <span className="font-semibold text-sm mb-1">{o.customerName}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{t.visited}: {o.status === "Routed" ? "Sí" : "No"}</span>
              </div>
            </Tooltip>
          </Marker>
        ))}

        {routes.map(r => {
          const vehicleColor = vehicles.find(v => v.id === r.vehicleId)?.color || '#10b981';
          return r.polyline && (
          <Fragment key={r.id}>
            {/* Glow Background Layer */}
            <Polyline 
              positions={r.polyline} 
              pathOptions={{ color: vehicleColor, weight: 12, opacity: 0.25, lineCap: "round", lineJoin: "round" }} 
            />
            {/* Core Route Line */}
            <Polyline 
              positions={r.polyline} 
              pathOptions={{ color: vehicleColor, weight: 4.5, opacity: 0.95, lineCap: "round", lineJoin: "round" }} 
            />
          </Fragment>
          );
        })}

        {activeRoutePath.length > 0 && (
          <Fragment>
            {/* Glow Background Layer for Selected Route */}
            <Polyline 
              positions={activeRoutePath} 
              pathOptions={{ color: "#0ea5e9", weight: 14, opacity: 0.25, lineCap: "round", lineJoin: "round" }} 
            />
            {/* Core Route Line */}
            <Polyline 
              positions={activeRoutePath} 
              pathOptions={{ color: "#0ea5e9", weight: 5, opacity: 1, lineCap: "round", lineJoin: "round" }} 
            />
          </Fragment>
        )}
      </MapContainer>
    </div>
  );
};
