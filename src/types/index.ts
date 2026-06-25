export type EntityStatus = "OK" | "Needs_Service";
export type DriverStatus = "Off_Duty" | "Available" | "En_Route";
export type RouteStatus = "Draft" | "Dispatched" | "Completed";
export type OrderStatus = "Pending" | "Routed" | "Delivered" | "Failed";

export interface Depot {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  windowStart: string; // "HH:mm"
  windowEnd: string;
}

export interface Vehicle {
  id: string;
  depotId: string;
  plate: string;
  type: "Moto" | "Van" | "Truck";
  maxWeightKg: number;
  maxVolumeM3: number;
  fuelEfficiencyKmPl: number;
  costPerKm: number;
  fixedCostDaily: number;
  status: EntityStatus;
  tags: string[]; // e.g. ["Refrigerated"]
  color?: string; // e.g. "#10b981"
}

export interface Driver {
  id: string;
  vehicleId?: string;
  dni: string;
  name: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: DriverStatus;
}

export interface Route {
  id: string;
  vehicleId: string;
  driverId: string;
  scheduledDate: string;
  estimatedDistKm: number;
  estimatedTimeMin: number;
  status: RouteStatus;
  polyline?: [number, number][]; // optional for drawing
}

export interface Order {
  id: string;
  routeId?: string; // null meaning Pending
  trackingCode: string;
  customerName: string;
  customerPhone: string;
  destLat: number;
  destLng: number;
  weightKg: number;
  volumeM3: number;
  totalAmount: number;
  estimatedServiceTimeMin: number;
  windowStart: string;
  windowEnd: string;
  tags: string[];
  routeSequence?: number;
  status: OrderStatus;
  priority: 1 | 2 | 3; // 1 = High, 3 = Low
}
