import React, { useRef, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import { VendingMachine, getUserLocation } from "@/utils/vendingMachines";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Using the user-provided Mapbox token
mapboxgl.accessToken = "pk.eyJ1Ijoic3R5dG8iLCJhIjoiY204a2VtOXhkMHhqZTJrcXI5bjlyZjhsNSJ9.xeo91AG44Yz9q-zp7LEMrg";

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
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  // Initialize map when component mounts
  useEffect(() => {
    const initializeMap = async () => {
      try {
        // Get user location
        const location = await getUserLocation();
        setUserLocation(location);
        
        if (mapContainer.current && !map.current) {
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
          
          // Add user location marker
          new mapboxgl.Marker({
            color: "#3b82f6",
            scale: 0.8
          })
            .setLngLat([location.lng, location.lat])
            .addTo(map.current);
          
          // Add geolocate control
          map.current.addControl(
            new mapboxgl.GeolocateControl({
              positionOptions: {
                enableHighAccuracy: true
              },
              trackUserLocation: true,
              showUserHeading: true
            }),
            "top-right"
          );
          
          // Wait for map to load before adding markers
          map.current.on("load", () => {
            setLoading(false);
            addVendingMachineMarkers();
          });
        }
      } catch (error) {
        console.error("Error initializing map:", error);
        // Set default location if getUserLocation fails
        const defaultLocation = { lat: 52.3676, lng: 4.9041 }; // Amsterdam
        setUserLocation(defaultLocation);
        
        if (mapContainer.current && !map.current) {
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
  }, []);
  
  // Add or update markers when machines or selected machine changes
  useEffect(() => {
    if (!loading && map.current) {
      addVendingMachineMarkers();
    }
  }, [machines, selectedMachine, loading]);
  
  // Function to add vending machine markers to the map
  const addVendingMachineMarkers = () => {
    if (!map.current) return;
    
    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};
    
    // Add markers for each machine
    machines.forEach((machine, index) => {
      // For this demo, we'll generate positions around the user location
      // In a real app, you would use actual coordinates from your data
      const offset = (index + 1) * 0.005;
      const angle = (index * (360 / machines.length)) * (Math.PI / 180);
      const lng = (userLocation?.lng || 4.9041) + offset * Math.cos(angle);
      const lat = (userLocation?.lat || 52.3676) + offset * Math.sin(angle);
      
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
      el.innerHTML = `<span class="text-white font-semibold text-xs">${index + 1}</span>`;
      
      // Add click event
      el.addEventListener('click', () => {
        if (onSelectMachine) {
          onSelectMachine(machine);
        }
      });
      
      // Create and add marker
      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(map.current!);
      
      // Add popup for selected machine
      if (isSelected) {
        const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
          .setLngLat([lng, lat])
          .setHTML(`
            <div class="p-2">
              <h4 class="font-medium text-sm">${machine.name}</h4>
              <p class="text-xs text-gray-500">${machine.address}</p>
            </div>
          `)
          .addTo(map.current!);
          
        // Fly to the selected marker
        map.current!.flyTo({
          center: [lng, lat],
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
