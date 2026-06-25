import { create } from "zustand";
import { Depot, Vehicle, Driver, Route, Order } from "../types";

interface TMSState {
  language: "es" | "en";
  theme: "dark" | "light";
  depots: Depot[];
  vehicles: Vehicle[];
  drivers: Driver[];
  routes: Route[];
  orders: Order[];
  isOptimizing: boolean;
  selectedOrderId: string | null;
  showFleetPanel: boolean;
  selectedOrdersForRouting: string[];
  activeView: 'dashboard' | 'planner';
  
  // Actions
  setActiveView: (view: 'dashboard' | 'planner') => void;
  setLanguage: (lang: "es" | "en") => void;
  toggleTheme: () => void;
  toggleFleetPanel: () => void;
  setSelectedOrderId: (id: string | null) => void;
  toggleOrderForRouting: (id: string) => void;
  selectAllOrdersForRouting: (select: boolean, ids: string[]) => void;
  addVehicle: (v: Vehicle) => void;
  updateOrderRoute: (orderId: string, routeId: string, sequence: number) => void;
  triggerOptimization: () => void;
}

// Initial Mock Data maintaining relational integrity
const MOCK_DEPOTS: Depot[] = [
  {
    id: "depot_1",
    name: "Hub Central (Callao)",
    address: "Av. Elmer Faucett 1234, Callao",
    lat: -12.0560,
    lng: -77.1189,
    windowStart: "06:00",
    windowEnd: "22:00",
  }
];

const MOCK_VEHICLES: Vehicle[] = [
  { id: "v_1", depotId: "depot_1", plate: "ABC-123", type: "Truck", maxWeightKg: 5000, maxVolumeM3: 20, fuelEfficiencyKmPl: 10, costPerKm: 1.5, fixedCostDaily: 100, status: "OK", tags: ["Refrigerated"] },
  { id: "v_2", depotId: "depot_1", plate: "XYZ-987", type: "Van", maxWeightKg: 1500, maxVolumeM3: 8, fuelEfficiencyKmPl: 15, costPerKm: 0.8, fixedCostDaily: 50, status: "OK", tags: [] },
  { id: "v_3", depotId: "depot_1", plate: "MTO-001", type: "Moto", maxWeightKg: 80, maxVolumeM3: 0.5, fuelEfficiencyKmPl: 30, costPerKm: 0.2, fixedCostDaily: 10, status: "OK", tags: ["Express"] }
];

const MOCK_DRIVERS: Driver[] = [
  { id: "d_1", vehicleId: "v_1", dni: "10000001", name: "Carlos Mendoza", phone: "+123456789", licenseNumber: "L-101", licenseExpiry: "2028-12-31", status: "Available" },
  { id: "d_2", vehicleId: "v_2", dni: "10000002", name: "Ana Torres", phone: "+123456790", licenseNumber: "L-102", licenseExpiry: "2027-05-15", status: "Available" }
];

const MOCK_ORDERS: Order[] = [
  { id: "o_1", trackingCode: "TRK-001", customerName: "Supermercado Wong", customerPhone: "+10101010", destLat: -12.1211, destLng: -77.0294, weightKg: 1200, volumeM3: 5, totalAmount: 5449.04, estimatedServiceTimeMin: 30, windowStart: "08:00", windowEnd: "12:00", tags: ["Refrigerated"], status: "Pending", priority: 1 },
  { id: "o_2", trackingCode: "TRK-002", customerName: "Farmacia Beta", customerPhone: "+20202020", destLat: -12.0970, destLng: -77.0268, weightKg: 200, volumeM3: 1, totalAmount: 528.00, estimatedServiceTimeMin: 15, windowStart: "09:00", windowEnd: "18:00", tags: [], status: "Pending", priority: 2 },
  { id: "o_3", trackingCode: "TRK-003", customerName: "Restaurante Central", customerPhone: "+30303030", destLat: -12.1465, destLng: -77.0229, weightKg: 50, volumeM3: 0.2, totalAmount: 6220.00, estimatedServiceTimeMin: 10, windowStart: "10:00", windowEnd: "14:00", tags: ["Express"], status: "Pending", priority: 1 },
  { id: "o_4", trackingCode: "TRK-004", customerName: "Boutique Lima", customerPhone: "+40404040", destLat: -12.0464, destLng: -77.0428, weightKg: 15, volumeM3: 0.1, totalAmount: 2832.00, estimatedServiceTimeMin: 5, windowStart: "14:00", windowEnd: "18:00", tags: [], status: "Pending", priority: 3 },
  { id: "o_5", trackingCode: "TRK-005", customerName: "Ferreteria Mega", customerPhone: "+50505050", destLat: -11.9774, destLng: -77.0699, weightKg: 800, volumeM3: 3, totalAmount: 1149.40, estimatedServiceTimeMin: 20, windowStart: "08:00", windowEnd: "18:00", tags: [], status: "Pending", priority: 2 },
];

export const useTMSStore = create<TMSState>((set) => ({
  language: "es",
  theme: "dark",
  depots: MOCK_DEPOTS,
  vehicles: MOCK_VEHICLES,
  drivers: MOCK_DRIVERS,
  routes: [],
  orders: MOCK_ORDERS,
  isOptimizing: false,
  selectedOrderId: null,
  showFleetPanel: true,
  selectedOrdersForRouting: [],
  activeView: "planner",

  setActiveView: (view) => set({ activeView: view }),
  setLanguage: (lang: "es" | "en") => set({ language: lang }),
  
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === "dark" ? "light" : "dark";
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    return { theme: newTheme };
  }),

  toggleFleetPanel: () => set((state) => ({ showFleetPanel: !state.showFleetPanel })),

  setSelectedOrderId: (id) => set({ selectedOrderId: id }),

  toggleOrderForRouting: (id) => set((state) => ({
    selectedOrdersForRouting: state.selectedOrdersForRouting.includes(id)
      ? state.selectedOrdersForRouting.filter(oid => oid !== id)
      : [...state.selectedOrdersForRouting, id]
  })),

  selectAllOrdersForRouting: (select, ids) => set((state) => {
    let newSelected = [...state.selectedOrdersForRouting];
    if (select) {
      // Add all ids that are not already selected
      ids.forEach(id => {
        if (!newSelected.includes(id)) newSelected.push(id);
      });
    } else {
      // Remove all ids
      newSelected = newSelected.filter(id => !ids.includes(id));
    }
    return { selectedOrdersForRouting: newSelected };
  }),

  addVehicle: (v) => set((state) => ({ vehicles: [...state.vehicles, v] })),
  
  updateOrderRoute: (orderId, routeId, sequence) => 
    set((state) => ({
      orders: state.orders.map(o => o.id === orderId ? { ...o, routeId, routeSequence: sequence, status: "Routed" } : o)
    })),

  triggerOptimization: async () => {
    set({ isOptimizing: true });
    
    // Allow state to update before blocking
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      // Import the OSRM function dynamically to avoid circular dependencies if any
      const { getStreetRoute } = await import('../lib/osrm');

      const state = useTMSStore.getState();
      const newRouteId = "route_" + Date.now();
      const ordersToRouteIds = state.selectedOrdersForRouting;
      
      const routedOrders = [...state.orders].filter(o => o.status === "Pending" && ordersToRouteIds.includes(o.id)).sort((a,b) => b.priority - a.priority);
      
      if(routedOrders.length === 0) {
         set({ isOptimizing: false });
         return;
      }
      
      const waypoints: [number, number][] = [
        [state.depots[0].lat, state.depots[0].lng],
        ...routedOrders.map(o => [o.destLat, o.destLng] as [number, number]),
        [state.depots[0].lat, state.depots[0].lng],
      ];

      // Note: In a real VRP, we'd chunk this or use OSRM Trip API. For mock, just route sequentially.
      const polyline = await getStreetRoute(waypoints);

      set((state) => {
        const newRoute: Route = {
          id: newRouteId,
          vehicleId: state.vehicles[0].id,
          driverId: state.drivers[0].id,
          scheduledDate: new Date().toISOString().split("T")[0],
          estimatedDistKm: 45.2, // Mocked
          estimatedTimeMin: 120, // Mocked
          status: "Draft",
          polyline: polyline.length > 0 ? polyline : waypoints // fallback if osrm fails
        };

        const updatedOrders = state.orders.map(o => {
          if (o.status === "Pending" && ordersToRouteIds.includes(o.id)) {
            // Determine sequence based on index in routedOrders
            const sequence = routedOrders.findIndex(ro => ro.id === o.id) + 1;
            return { ...o, routeId: newRouteId, routeSequence: sequence, status: "Routed" as const };
          }
          return o;
        });

        return {
          isOptimizing: false,
          routes: [...state.routes, newRoute],
          orders: updatedOrders,
          selectedOrdersForRouting: [] // empty selection after routing
        };
      });
    } catch(err) {
      console.error(err);
      set({ isOptimizing: false });
    }
  }
}));
