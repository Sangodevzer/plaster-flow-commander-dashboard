
// Mock data for the Production Management Dashboard

// Product data
export type Product = {
  id: string;
  name: string;
  currentStock: number;
  orderedQuantity: number;
  minStockLevel: number;
};

export const products: Product[] = [
  {
    id: "P001",
    name: "Plâtre Standard",
    currentStock: 1200,
    orderedQuantity: 1500,
    minStockLevel: 800,
  },
  {
    id: "P002",
    name: "Plâtre Fin",
    currentStock: 850,
    orderedQuantity: 1200,
    minStockLevel: 600,
  },
  {
    id: "P003",
    name: "Plâtre Hydrofuge",
    currentStock: 450,
    orderedQuantity: 600,
    minStockLevel: 400,
  },
  {
    id: "P004",
    name: "Plâtre Haute Résistance",
    currentStock: 320,
    orderedQuantity: 280,
    minStockLevel: 200,
  },
];

// Customer orders
export type Order = {
  id: string;
  customerName: string;
  productId: string;
  quantity: number;
  dueDate: string;
  status: "Pending" | "In Production" | "Completed";
};

export const orders: Order[] = [
  {
    id: "O001",
    customerName: "BatiConstruct",
    productId: "P001",
    quantity: 800,
    dueDate: "2025-05-10",
    status: "Pending",
  },
  {
    id: "O002",
    customerName: "MaisonNeuve",
    productId: "P002",
    quantity: 600,
    dueDate: "2025-05-12",
    status: "In Production",
  },
  {
    id: "O003",
    customerName: "RenovExpert",
    productId: "P001",
    quantity: 700,
    dueDate: "2025-05-15",
    status: "Pending",
  },
  {
    id: "O004",
    customerName: "DecoBati",
    productId: "P003",
    quantity: 350,
    dueDate: "2025-05-20",
    status: "Pending",
  },
  {
    id: "O005",
    customerName: "ConstructPro",
    productId: "P004",
    quantity: 280,
    dueDate: "2025-05-08",
    status: "In Production",
  },
];

// Production Scenarios
export type Scenario = {
  id: string;
  name: string;
  description: string;
  productionTime: number; // hours
  machineDowntimeRisk: number; // percentage
  timeBeforeFailure: number; // hours
  costPerUnit: Record<string, number>; // cost in € per product unit
  resourceRequirements: ResourceRequirement[];
  recommended: boolean;
};

export type ResourceRequirement = {
  resourceId: string;
  requiredAmount: number;
};

export const scenarios: Scenario[] = [
  {
    id: "S001",
    name: "Plan A - Production Standard",
    description: "Production régulière avec capacité standard",
    productionTime: 48,
    machineDowntimeRisk: 12,
    timeBeforeFailure: 120,
    costPerUnit: {
      P001: 8.5,
      P002: 9.2,
      P003: 12.5,
      P004: 15.8,
    },
    resourceRequirements: [
      { resourceId: "R001", requiredAmount: 1200 },
      { resourceId: "R002", requiredAmount: 800 },
      { resourceId: "R003", requiredAmount: 4 },
    ],
    recommended: true,
  },
  {
    id: "S002",
    name: "Plan B - Production Intensifiée",
    description: "Production intensifiée pour répondre aux commandes urgentes",
    productionTime: 36,
    machineDowntimeRisk: 25,
    timeBeforeFailure: 80,
    costPerUnit: {
      P001: 10.2,
      P002: 11.0,
      P003: 14.8,
      P004: 19.0,
    },
    resourceRequirements: [
      { resourceId: "R001", requiredAmount: 1600 },
      { resourceId: "R002", requiredAmount: 1100 },
      { resourceId: "R003", requiredAmount: 6 },
    ],
    recommended: false,
  },
  {
    id: "S003",
    name: "Plan C - Production Économique",
    description: "Production optimisée pour réduire les coûts",
    productionTime: 60,
    machineDowntimeRisk: 8,
    timeBeforeFailure: 180,
    costPerUnit: {
      P001: 7.8,
      P002: 8.5,
      P003: 11.2,
      P004: 14.0,
    },
    resourceRequirements: [
      { resourceId: "R001", requiredAmount: 1000 },
      { resourceId: "R002", requiredAmount: 700 },
      { resourceId: "R003", requiredAmount: 3 },
    ],
    recommended: false,
  },
];

// Resources
export type Resource = {
  id: string;
  name: string;
  type: "RawMaterial" | "Machine" | "Personnel";
  available: number;
  unit: string;
  threshold: number;
  status: "Normal" | "Warning" | "Critical";
};

export const resources: Resource[] = [
  {
    id: "R001",
    name: "Gypse",
    type: "RawMaterial",
    available: 2500,
    unit: "kg",
    threshold: 1000,
    status: "Normal",
  },
  {
    id: "R002",
    name: "Additifs",
    type: "RawMaterial",
    available: 850,
    unit: "kg",
    threshold: 500,
    status: "Warning",
  },
  {
    id: "R003",
    name: "Opérateurs",
    type: "Personnel",
    available: 8,
    unit: "personnes",
    threshold: 5,
    status: "Normal",
  },
  {
    id: "R004",
    name: "Machine A",
    type: "Machine",
    available: 1,
    unit: "unité",
    threshold: 1,
    status: "Normal",
  },
  {
    id: "R005",
    name: "Machine B",
    type: "Machine",
    available: 1,
    unit: "unité",
    threshold: 1,
    status: "Critical",
  },
];

// Risk Data
export type MachineRisk = {
  machineId: string;
  machineName: string;
  downtimeRisk: number;
  hoursBeforeFailure: number;
  maintenanceDue: string | null;
  historyData: { date: string; hours: number }[];
};

export const machineRisks: MachineRisk[] = [
  {
    machineId: "M001",
    machineName: "Mélangeur Principal",
    downtimeRisk: 15,
    hoursBeforeFailure: 120,
    maintenanceDue: "2025-05-15",
    historyData: [
      { date: "2025-03-01", hours: 180 },
      { date: "2025-03-15", hours: 160 },
      { date: "2025-04-01", hours: 140 },
      { date: "2025-04-15", hours: 130 },
      { date: "2025-05-01", hours: 120 },
    ],
  },
  {
    machineId: "M002",
    machineName: "Four Rotatif",
    downtimeRisk: 28,
    hoursBeforeFailure: 60,
    maintenanceDue: "2025-05-05",
    historyData: [
      { date: "2025-03-01", hours: 120 },
      { date: "2025-03-15", hours: 100 },
      { date: "2025-04-01", hours: 90 },
      { date: "2025-04-15", hours: 75 },
      { date: "2025-05-01", hours: 60 },
    ],
  },
  {
    machineId: "M003",
    machineName: "Broyeur",
    downtimeRisk: 10,
    hoursBeforeFailure: 200,
    maintenanceDue: null,
    historyData: [
      { date: "2025-03-01", hours: 250 },
      { date: "2025-03-15", hours: 240 },
      { date: "2025-04-01", hours: 230 },
      { date: "2025-04-15", hours: 215 },
      { date: "2025-05-01", hours: 200 },
    ],
  },
];

// Alert data
export type Alert = {
  id: string;
  title: string;
  description: string;
  type: "Warning" | "Critical" | "Info";
  timestamp: string;
  read: boolean;
};

export const alerts: Alert[] = [
  {
    id: "A001",
    title: "Rupture de Stock Imminente",
    description: "Le niveau de stock de Plâtre Hydrofuge approche du seuil critique",
    type: "Warning",
    timestamp: "2025-04-24T08:30:00",
    read: false,
  },
  {
    id: "A002",
    title: "Maintenance Requise",
    description: "Le Four Rotatif nécessite une maintenance dans les 5 jours",
    type: "Critical",
    timestamp: "2025-04-24T09:15:00",
    read: false,
  },
  {
    id: "A003",
    title: "Nouvelle Commande",
    description: "Commande de 400 unités de Plâtre Standard reçue",
    type: "Info",
    timestamp: "2025-04-24T10:05:00",
    read: true,
  },
];

// Cost breakdown
export type CostBreakdown = {
  scenarioId: string;
  machineCost: number;
  materialCost: number;
  laborCost: number;
  overheadCost: number;
};

export const costBreakdowns: CostBreakdown[] = [
  {
    scenarioId: "S001",
    machineCost: 2.5,
    materialCost: 3.8,
    laborCost: 1.2,
    overheadCost: 1.0,
  },
  {
    scenarioId: "S002",
    machineCost: 3.2,
    materialCost: 3.8,
    laborCost: 2.1,
    overheadCost: 1.1,
  },
  {
    scenarioId: "S003",
    machineCost: 2.0,
    materialCost: 3.5,
    laborCost: 1.4,
    overheadCost: 0.9,
  },
];
