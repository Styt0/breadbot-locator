import { useState } from "react";
import { toast } from "sonner";
import { formatDistance, formatRelative } from "date-fns";
import { nl } from "date-fns/locale";
import { Geolocation } from '@capacitor/geolocation';

// Define interfaces
export interface VendingMachine {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  isStocked: boolean;
  lastReported: Date;
  addedBy?: string;
  description?: string;
  openingHours?: string;
  image?: string;
  distance?: number; // Adding distance property for showing in UI
  stockLevel?: "full" | "low" | "empty"; // New property for more detailed stock status
  comment?: string; // New property for user comments
}

// Interface for adding a new vending machine
export interface NewVendingMachine {
  name: string;
  address: string;
  city: string;
  isStocked: boolean;
  location: { lat: number; lng: number };
  description?: string;
  openingHours?: string;
  image?: string;
}

// Format relative time since last update (e.g. "5 minutes ago")
export const formatRelativeTime = (date: Date): string => {
  return formatRelative(date, new Date(), {
    locale: nl
  });
};

// Format distance to human-readable text (e.g. "2.4 km")
export const formatDistanceToString = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(1)} km`;
};

// Get user's geolocation
export const getUserLocation = async (): Promise<{ lat: number; lng: number }> => {
  try {
    // Try to use Capacitor Geolocation if available (for mobile apps)
    if (typeof Geolocation !== 'undefined') {
      try {
        // Request permissions first
        const permissionStatus = await Geolocation.requestPermissions();
        
        if (permissionStatus.location === 'granted') {
          const position = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 10000
          });

          return {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
        }
      } catch (capacitorError) {
        console.error("Capacitor Geolocation error:", capacitorError);
        // Fall through to browser geolocation API
      }
    }

    // Fallback to browser geolocation API
    if (navigator.geolocation) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            console.error("Browser geolocation error:", error);
            // Fallback to Reet, Antwerpen on error (coordinates for Reet, Antwerpen, Belgium)
            resolve({ lat: 51.1074, lng: 4.3674 });
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      });
    }

    // Fallback if geolocation is not available
    console.log("Geolocation not available, using default location");
    return { lat: 51.1074, lng: 4.3674 }; // Fallback to Reet, Antwerpen
  } catch (error) {
    console.error("Error in getUserLocation:", error);
    return { lat: 51.1074, lng: 4.3674 }; // Fallback to Reet, Antwerpen
  }
};

// Add a new vending machine
export const addVendingMachine = async (machine: NewVendingMachine): Promise<VendingMachine> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate a new unique ID
  const newId = `vm-${String(mockMachines.length + 1).padStart(3, '0')}`;
  
  // Create the new machine object
  const newMachine: VendingMachine = {
    id: newId,
    name: machine.name,
    address: machine.address,
    city: machine.city,
    latitude: machine.location.lat,
    longitude: machine.location.lng,
    isStocked: machine.isStocked,
    lastReported: new Date(),
    description: machine.description,
    openingHours: machine.openingHours,
    image: machine.image || "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80", // Default image
    stockLevel: machine.isStocked ? "full" : "empty"
  };
  
  // Add to the mock machines array
  mockMachines.push(newMachine);
  
  return newMachine;
};

// Mock data for development
const mockMachines: VendingMachine[] = [
  {
    id: "vm-001",
    name: "Bakkerij Janssen Automaat",
    address: "Stationsstraat 12",
    city: "Reet, Antwerpen",
    latitude: 51.1074,
    longitude: 4.3674,
    isStocked: true,
    stockLevel: "full",
    lastReported: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    description: "Verse broodjes en croissants. Dagelijks bijgevuld om 7:00 en 16:00.",
    openingHours: "24/7",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80",
    comment: "Verse baguettes, net bijgevuld!"
  },
  {
    id: "vm-002",
    name: "Vers & Lekker",
    address: "Marktplein 5",
    city: "Reet, Antwerpen",
    latitude: 51.1097,
    longitude: 4.3710,
    isStocked: false,
    stockLevel: "empty",
    lastReported: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    description: "Biologische broodjes en gebak van lokale bakkers.",
    openingHours: "Ma-Za: 6:00-22:00, Zo: 7:00-21:00",
    image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
    comment: "Helemaal leeg, morgenochtend weer aangevuld."
  },
  {
    id: "vm-003",
    name: "Brood Express",
    address: "Hoofdweg 22",
    city: "Rotterdam",
    latitude: 51.9225,
    longitude: 4.4792,
    isStocked: true,
    stockLevel: "low",
    lastReported: new Date(Date.now() - 1000 * 60 * 240), // 4 hours ago
    description: "Snelle service voor onderweg. Broodjes, koffie en snacks.",
    openingHours: "24/7",
    image: "https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80"
  },
  {
    id: "vm-004",
    name: "Bakker's Hoek",
    address: "Kerkstraat 8",
    city: "Den Haag",
    latitude: 52.0705,
    longitude: 4.3007,
    isStocked: true,
    lastReported: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    description: "Traditionele recepten met moderne twist. Dagelijks vers.",
    openingHours: "Ma-Za: 7:00-20:00, Zo: Gesloten",
    image: "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80"
  },
  {
    id: "vm-005",
    name: "Broodnodig",
    address: "Winkelcentrum Zuid",
    city: "Eindhoven",
    latitude: 51.4416,
    longitude: 5.4697,
    isStocked: false,
    lastReported: new Date(Date.now() - 1000 * 60 * 360), // 6 hours ago
    description: "Verse broodjes en gebak. Populair bij studenten.",
    openingHours: "Ma-Zo: 8:00-22:00",
    image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1622&q=80"
  },
  {
    id: "vm-006",
    name: "Stationsbakker",
    address: "Stationsplein 1",
    city: "Groningen",
    latitude: 53.2127,
    longitude: 6.5656,
    isStocked: true,
    lastReported: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    description: "Ideaal voor forenzen. Verse broodjes en koffie to-go.",
    openingHours: "Ma-Vr: 5:30-22:00, Za-Zo: 7:00-21:00",
    image: "https://images.unsplash.com/photo-1578849278619-e73a158e76c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
  },
];

// Get all vending machines
export const getVendingMachines = (): VendingMachine[] => {
  // In a real app, this would fetch from an API
  return mockMachines;
};

// Update vending machine status
export const updateVendingMachineStatus = async (
  id: string,
  isStocked: boolean,
  stockLevel?: "full" | "low" | "empty",
  comment?: string
): Promise<VendingMachine> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Find and update the machine
  const machineIndex = mockMachines.findIndex(m => m.id === id);
  
  if (machineIndex === -1) {
    throw new Error("Vending machine not found");
  }
  
  // Update the machine
  mockMachines[machineIndex] = {
    ...mockMachines[machineIndex],
    isStocked,
    stockLevel: stockLevel || (isStocked ? "full" : "empty"),
    lastReported: new Date(),
    ...(comment !== undefined && { comment })
  };
  
  return mockMachines[machineIndex];
};

// Add a photo to a vending machine
export const addPhotoToVendingMachine = async (
  id: string,
  photoUrl: string
): Promise<VendingMachine> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Find and update the machine
  const machineIndex = mockMachines.findIndex(m => m.id === id);
  
  if (machineIndex === -1) {
    throw new Error("Vending machine not found");
  }
  
  // Update the machine
  mockMachines[machineIndex] = {
    ...mockMachines[machineIndex],
    image: photoUrl
  };
  
  return mockMachines[machineIndex];
};

// Add a comment to a vending machine
export const addCommentToVendingMachine = async (
  id: string,
  comment: string
): Promise<VendingMachine> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Find and update the machine
  const machineIndex = mockMachines.findIndex(m => m.id === id);
  
  if (machineIndex === -1) {
    throw new Error("Vending machine not found");
  }
  
  // Update the machine
  mockMachines[machineIndex] = {
    ...mockMachines[machineIndex],
    comment
  };
  
  return mockMachines[machineIndex];
};

// Get vending machines within a specific radius (in km)
export const getVendingMachinesInRadius = async (
  radius: number,
  lat?: number,
  lng?: number
): Promise<VendingMachine[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // If no coordinates provided, use geolocation or default to Reet, Antwerpen
  if (!lat || !lng) {
    // In a real app, we would use the browser's geolocation
    try {
      const location = await getUserLocation();
      lat = location.lat;
      lng = location.lng;
    } catch {
      lat = 51.1074;
      lng = 4.3674; // Reet, Antwerpen coordinates
    }
  }
  
  // Filter machines within radius
  // This is a simplified calculation - in production, use a proper distance formula
  return mockMachines.filter(machine => {
    const distance = Math.sqrt(
      Math.pow(machine.latitude - lat!, 2) + 
      Math.pow(machine.longitude - lng!, 2)
    ) * 111; // Rough conversion to km
    
    return distance <= radius;
  });
};

// Get closest vending machines
export const getClosestVendingMachines = async (
  limit: number = 5
): Promise<VendingMachine[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 600));
  
  try {
    // Get user location
    const location = await getUserLocation();
    const userLat = location.lat;
    const userLng = location.lng;
    
    // Sort by distance
    return [...mockMachines]
      .sort((a, b) => {
        const distA = Math.sqrt(
          Math.pow(a.latitude - userLat, 2) + 
          Math.pow(a.longitude - userLng, 2)
        );
        const distB = Math.sqrt(
          Math.pow(b.latitude - userLat, 2) + 
          Math.pow(b.longitude - userLng, 2)
        );
        return distA - distB;
      })
      .slice(0, limit);
  } catch {
    // Fallback to default location (Reet, Antwerpen)
    const userLat = 51.1074;
    const userLng = 4.3674;
    
    return [...mockMachines]
      .sort((a, b) => {
        const distA = Math.sqrt(
          Math.pow(a.latitude - userLat, 2) + 
          Math.pow(a.longitude - userLng, 2)
        );
        const distB = Math.sqrt(
          Math.pow(b.latitude - userLat, 2) + 
          Math.pow(b.longitude - userLng, 2)
        );
        return distA - distB;
      })
      .slice(0, limit);
  }
};

// Get a single vending machine by ID
export const getVendingMachineById = async (
  id: string
): Promise<VendingMachine | null> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const machine = mockMachines.find(m => m.id === id);
  return machine || null;
};
