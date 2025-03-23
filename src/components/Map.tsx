
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import { VendingMachine, getUserLocation } from "@/utils/vendingMachines";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for Leaflet's default icon
// We need to manually set the path to the marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Custom marker icons
const createCustomIcon = (isStocked: boolean, isSelected: boolean) => {
  return L.divIcon({
    className: "custom-div-icon",
    html: `<div style="
      background-color: ${isStocked ? '#10B981' : '#EF4444'};
      border: 2px solid ${isSelected ? '#3B82F6' : 'white'};
      width: 30px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    "><span style="color: white; font-weight: bold; font-size: 12px;"></span></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

// This component updates the map center when it changes
const ChangeMapView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

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
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number]>([51.1074, 4.3674]); // Default to Reet, Antwerpen
  
  useEffect(() => {
    const initializeMap = async () => {
      try {
        // Get user location
        const location = await getUserLocation();
        setUserLocation([location.lat, location.lng]);
      } catch (error) {
        console.error("Error getting user location:", error);
        // Default to Reet, Antwerpen if location fails
      } finally {
        setLoading(false);
      }
    };
    
    initializeMap();
  }, []);

  // Set center based on selected machine or user location
  const mapCenter = selectedMachine 
    ? [selectedMachine.latitude, selectedMachine.longitude] as [number, number]
    : userLocation;

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
        <MapContainer 
          center={mapCenter} 
          zoom={13} 
          style={{ height: "100%", width: "100%" }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <ChangeMapView center={mapCenter} />
          
          {machines.map((machine) => (
            <Marker
              key={machine.id}
              position={[machine.latitude, machine.longitude]}
              icon={createCustomIcon(machine.isStocked, selectedMachine?.id === machine.id)}
              eventHandlers={{
                click: () => {
                  if (onSelectMachine) {
                    onSelectMachine(machine);
                  }
                },
              }}
            >
              <Popup>
                <div className="p-1">
                  <h4 className="font-medium text-sm">{machine.name}</h4>
                  <p className="text-xs text-gray-500">{machine.address}, {machine.city}</p>
                  <div className="mt-2">
                    <StatusBadge 
                      isStocked={machine.isStocked} 
                      lastReported={machine.lastReported}
                      size="sm"
                    />
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default Map;
