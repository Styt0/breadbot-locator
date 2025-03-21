
import { toast } from "@/components/ui/sonner";

export interface Location {
  lat: number;
  lng: number;
}

export interface VendingMachine {
  id: string;
  name: string;
  address: string;
  location: Location;
  isStocked: boolean;
  lastReported?: Date;
  reportedBy?: string;
  distance?: number; // calculated field
}

// Initial demo data
export const DEMO_MACHINES: VendingMachine[] = [
  {
    id: "vm-001",
    name: "Bakkerij De Verse Knip",
    address: "Dorpstraat 12, Utrecht",
    location: { lat: 52.0907, lng: 5.1214 },
    isStocked: true,
    lastReported: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: "vm-002",
    name: "Brood Express",
    address: "Stationsplein 5, Utrecht",
    location: { lat: 52.0894, lng: 5.1095 },
    isStocked: true,
    lastReported: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
  },
  {
    id: "vm-003",
    name: "Vers Brood Automaat",
    address: "Biltstraat 45, Utrecht",
    location: { lat: 52.0977, lng: 5.1326 },
    isStocked: false,
    lastReported: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
  },
  {
    id: "vm-004",
    name: "Buurtkruideniers",
    address: "Wittevrouwenstraat 12, Utrecht",
    location: { lat: 52.0943, lng: 5.1280 },
    isStocked: true,
    lastReported: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
  },
  {
    id: "vm-005",
    name: "De Broodkas",
    address: "Amsterdamsestraatweg 124, Utrecht",
    location: { lat: 52.1008, lng: 5.1155 },
    isStocked: true,
    lastReported: new Date(),
  },
  {
    id: "vm-006",
    name: "Bakkershoek",
    address: "Kanaalstraat 78, Utrecht",
    location: { lat: 52.0874, lng: 5.0989 },
    isStocked: true,
    lastReported: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
  },
  {
    id: "vm-007",
    name: "Brood & Co",
    address: "Twijnstraat 67, Utrecht",
    location: { lat: 52.0809, lng: 5.1229 },
    isStocked: false,
    lastReported: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
  },
];

// Local storage keys
const STORAGE_KEY = "bread-vending-machines";
const CURRENT_LOCATION_KEY = "user-location";

// Get user location with a promise
export const getUserLocation = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    // Check if we have a saved location
    const savedLocation = localStorage.getItem(CURRENT_LOCATION_KEY);
    if (savedLocation) {
      resolve(JSON.parse(savedLocation));
      return;
    }

    // If not, try to get the user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          localStorage.setItem(CURRENT_LOCATION_KEY, JSON.stringify(userLocation));
          resolve(userLocation);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Default to Utrecht center if location permission is denied
          const defaultLocation = { lat: 52.0907, lng: 5.1214 };
          localStorage.setItem(CURRENT_LOCATION_KEY, JSON.stringify(defaultLocation));
          resolve(defaultLocation);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser");
      // Default to Utrecht center
      const defaultLocation = { lat: 52.0907, lng: 5.1214 };
      localStorage.setItem(CURRENT_LOCATION_KEY, JSON.stringify(defaultLocation));
      resolve(defaultLocation);
    }
  });
};

// Store the vending machines in localStorage
export const saveVendingMachines = (machines: VendingMachine[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(machines));
};

// Get the vending machines from localStorage
export const getVendingMachines = (): VendingMachine[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  
  // If there's nothing stored yet, use the demo data
  if (!stored) {
    saveVendingMachines(DEMO_MACHINES);
    return DEMO_MACHINES;
  }
  
  try {
    // Parse the stored data and fix date objects
    const machines: VendingMachine[] = JSON.parse(stored);
    return machines.map(machine => ({
      ...machine,
      lastReported: machine.lastReported ? new Date(machine.lastReported) : undefined
    }));
  } catch (error) {
    console.error("Error parsing stored vending machines:", error);
    return DEMO_MACHINES;
  }
};

// Add a new vending machine
export const addVendingMachine = (machine: Omit<VendingMachine, 'id'>): VendingMachine => {
  const machines = getVendingMachines();
  
  // Create a new machine with an ID
  const newMachine: VendingMachine = {
    ...machine,
    id: `vm-${Date.now().toString(36)}`,
    lastReported: new Date(),
  };
  
  // Save the updated list
  saveVendingMachines([...machines, newMachine]);
  toast.success("Broodautomaat toegevoegd");
  
  return newMachine;
};

// Update vending machine stocked status
export const updateVendingMachineStatus = (id: string, isStocked: boolean): VendingMachine | null => {
  const machines = getVendingMachines();
  const index = machines.findIndex(m => m.id === id);
  
  if (index === -1) {
    toast.error("Broodautomaat niet gevonden");
    return null;
  }
  
  // Update the machine
  const updatedMachine: VendingMachine = {
    ...machines[index],
    isStocked,
    lastReported: new Date(),
  };
  
  machines[index] = updatedMachine;
  saveVendingMachines(machines);
  
  toast.success(
    isStocked 
      ? "Broodautomaat gemarkeerd als gevuld" 
      : "Broodautomaat gemarkeerd als leeg"
  );
  
  return updatedMachine;
};

// Calculate distance between two points using the Haversine formula
export const calculateDistance = (location1: Location, location2: Location): number => {
  const R = 6371; // Earth's radius in km
  const dLat = degreesToRadians(location2.lat - location1.lat);
  const dLng = degreesToRadians(location2.lng - location1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(location1.lat)) * Math.cos(degreesToRadians(location2.lat)) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Helper function to convert degrees to radians
const degreesToRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

// Get the 5 closest vending machines
export const getClosestVendingMachines = async (limit: number = 5): Promise<VendingMachine[]> => {
  const userLocation = await getUserLocation();
  const machines = getVendingMachines();
  
  // Calculate distance for each machine
  const machinesWithDistance = machines.map(machine => ({
    ...machine,
    distance: calculateDistance(userLocation, machine.location)
  }));
  
  // Sort by distance and take the closest "limit" number
  return machinesWithDistance
    .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
    .slice(0, limit);
};

// Get all vending machines within a certain radius (km)
export const getVendingMachinesInRadius = async (radius: number = 20): Promise<VendingMachine[]> => {
  const userLocation = await getUserLocation();
  const machines = getVendingMachines();
  
  // Calculate distance for each machine and filter by radius
  return machines
    .map(machine => ({
      ...machine,
      distance: calculateDistance(userLocation, machine.location)
    }))
    .filter(machine => (machine.distance ?? Infinity) <= radius)
    .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
};

// Format relative time (e.g., "5 minutes ago")
export const formatRelativeTime = (date?: Date): string => {
  if (!date) return "Onbekend";
  
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) return "zojuist";
  if (diffMin < 60) return `${diffMin} ${diffMin === 1 ? 'minuut' : 'minuten'} geleden`;
  if (diffHour < 24) return `${diffHour} ${diffHour === 1 ? 'uur' : 'uren'} geleden`;
  if (diffDay < 30) return `${diffDay} ${diffDay === 1 ? 'dag' : 'dagen'} geleden`;
  
  // Fallback to date format
  return date.toLocaleDateString();
};
