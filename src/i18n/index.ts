export const translations = {
  es: {
    // Topbar
    appTitle: "Consola de Ruteo",
    searchPlaceholder: "Buscar órdenes, placas...",
    langToggle: "EN",
    
    // Sidebar
    liveMap: "Mapa en Vivo",
    orders: "Órdenes",
    fleet: "Flota",
    drivers: "Conductores",
    telemetry: "Telemetría",
    settings: "Configuración",
    adminUser: "Usuario Admin",
    
    // Filters & Orders
    filtersTitle: "Órdenes por Fechas",
    dateFrom: "Desde",
    dateTo: "Hasta",
    orderNro: "Nro Orden",
    btnSearch: "Buscar",
    btnClear: "Limpiar",
    filterStatus: "Estado",
    filterPriority: "Prioridad",
    all: "Todos",
    priorityHigh: "Alta",
    priorityMed: "Media",
    priorityLow: "Baja",
    
    // Table
    colTracking: "Código",
    colCustomer: "Cliente",
    colWeight: "Carga (kg)",
    colAmount: "Monto Total",
    colWindow: "Ventana",
    colStatus: "Estado",
    colAction: "Ruta",
    btnViewPoints: "Ver puntos",
    compactView: "Vista Compacta",
    fullView: "Vista Completa",
    toggleFleet: "Mostrar/Ocultar Flota",
    
    // Fleet Panel & Optimization
    activeFleet: "Flota Activa",
    capacity: "cap.",
    runVrp: "Optimizar Rutas (VRP)",
    optimizing: "Calculando...",
    
    // Map Tooltips
    selectedOrder: "Orden seleccionada",
    destPoint: "Destino",
    visited: "Visitado",
    pending: "Pendiente"
  },
  en: {
    // Topbar
    appTitle: "Routing Console",
    searchPlaceholder: "Search orders, plates...",
    langToggle: "ES",
    
    // Sidebar
    liveMap: "Live Map",
    orders: "Orders",
    fleet: "Fleet",
    drivers: "Drivers",
    telemetry: "Telemetry",
    settings: "Settings",
    adminUser: "Admin User",
    
    // Filters & Orders
    filtersTitle: "Orders by Date",
    dateFrom: "From",
    dateTo: "To",
    orderNro: "Order No",
    btnSearch: "Search",
    btnClear: "Clear",
    filterStatus: "Status",
    filterPriority: "Priority",
    all: "All",
    priorityHigh: "High",
    priorityMed: "Medium",
    priorityLow: "Low",
    
    // Table
    colTracking: "Code",
    colCustomer: "Customer",
    colWeight: "Load (kg)",
    colAmount: "Total Amount",
    colWindow: "Window",
    colStatus: "Status",
    colAction: "Route",
    btnViewPoints: "View points",
    compactView: "Compact View",
    fullView: "Full View",
    toggleFleet: "Toggle Fleet Panel",
    
    // Fleet Panel & Optimization
    activeFleet: "Active Fleet",
    capacity: "cap.",
    runVrp: "Run Optimizer (VRP)",
    optimizing: "Calculating...",
    
    // Map Tooltips
    selectedOrder: "Selected Order",
    destPoint: "Destination",
    visited: "Visited",
    pending: "Pending"
  }
};

export type Language = "es" | "en";
export type TranslationKey = keyof typeof translations["es"];
