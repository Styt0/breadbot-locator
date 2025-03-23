
import React, { useRef, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import { VendingMachine, getUserLocation } from "@/utils/vendingMachines";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Set your Mapbox access token
mapboxgl.accessToken = "pk.eyJ1Ijoic3R5dG8iLCJhIjoiY204bTVhNWdtMGJ1ZjJpczdreGNzMzY1MiJ9.PPqQP7HVO8ybU6jzLMG4qA";

interface MapProps {
  machines: VendingMachine[];
  selectedMachine?: VendingMachine | null;
  onSelectMachine?: (machine: VendingMachine) => void;
  className?: string;
}

const Map: React.FC<MapProps> = ({
  machines,
  selectedMachine,
  onSelectMachine,
  className,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{[key: string]: mapboxgl.Marker}>({});
  const [loading, setLoading] = useState(true);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({ lat: 51.1074, lng: 4.3674 }); // Default to Reet, Antwerpen
  
  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current || mapInitialized) return;
    
    const initializeMap = async () => {
      try {
        // Get user location
        const location = await getUserLocation();
        setUserLocation(location);
        
        if (!map.current) {
          // Create new map instance
          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [location.lng, location.lat],
            zoom: 12,
          });
          
          // Add navigation controls
          map.current.addControl(
            new mapboxgl.NavigationControl(),
            "top-right"
          );
          
          // Wait for map to load before adding markers
          map.current.on("load", () => {
            setLoading(false);
            setMapInitialized(true);
            addVendingMachineMarkers();
          });
        }
      } catch (error) {
        console.error("Error initializing map:", error);
        // Set default location if getUserLocation fails
        const defaultLocation = { lat: 51.1074, lng: 4.3674 }; // Reet, Antwerpen
        setUserLocation(defaultLocation);
        
        if (!map.current && mapContainer.current) {
          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [defaultLocation.lng, defaultLocation.lat],
            zoom: 12,
          });
          
          map.current.addControl(
            new mapboxgl.NavigationControl(),
            "top-right"
          );
          
          map.current.on("load", () => {
            setLoading(false);
            setMapInitialized(true);
            addVendingMachineMarkers();
          });
        }
      }
    };
    
    initializeMap();
    
    // Cleanup function
    return () => {
      // Remove all markers
      Object.values(markersRef.current).forEach(marker => marker.remove());
      
      // Remove map
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapContainer, mapInitialized]);
  
  // Add or update markers when machines or selected machine changes
  useEffect(() => {
    if (!loading && map.current && mapInitialized) {
      addVendingMachineMarkers();
    }
  }, [machines, selectedMachine, loading, mapInitialized]);
  
  // Function to add vending machine markers to the map
  const addVendingMachineMarkers = () => {
    if (!map.current) return;
    
    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};
    
    // Add markers for each machine
    machines.forEach((machine) => {
      const isSelected = selectedMachine?.id === machine.id;
      
      // Create HTML element for marker
      const el = document.createElement('div');
      el.className = `flex items-center justify-center w-8 h-8 rounded-full shadow-sm border-2 transition-colors cursor-pointer ${
        isSelected 
          ? "bg-blue-500 border-white" 
          : machine.isStocked 
            ? "bg-green-500 border-white"
            : "bg-red-500 border-white"
      }`;
      el.innerHTML = `<span class="text-white font-semibold text-xs">${machine.id.split('-')[1]}</span>`;
      
      // Add click event
      el.addEventListener('click', () => {
        if (onSelectMachine) {
          onSelectMachine(machine);
        }
      });
      
      // Create and add marker
      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([machine.longitude, machine.latitude])
        .addTo(map.current!);
      
      // Add popup for selected machine
      if (isSelected) {
        const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
          .setLngLat([machine.longitude, machine.latitude])
          .setHTML(`
            <div class="p-2">
              <h4 class="font-medium text-sm">${machine.name}</h4>
              <p class="text-xs text-gray-500">${machine.address}, ${machine.city}</p>
            </div>
          `)
          .addTo(map.current!);
          
        // Fly to the selected marker
        map.current!.flyTo({
          center: [machine.longitude, machine.latitude],
          zoom: 14,
          speed: 1.5,
          essential: true
        });
      }
      
      // Store marker reference
      markersRef.current[machine.id] = marker;
    });
  };

  return (
    <div 
      className={cn(
        "relative w-full h-full min-h-[400px] rounded-xl overflow-hidden",
        className
      )}
    >
      {loading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
          <p className="text-muted-foreground">Kaart laden...</p>
        </div>
      ) : (
        <>
          <div 
            ref={mapContainer} 
            className="absolute inset-0"
          />
        </>
      )}
    </div>
  );
};

export default Map;
