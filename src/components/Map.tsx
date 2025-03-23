
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { VendingMachine } from "@/utils/vendingMachines";
import { cn } from "@/lib/utils";
import { ExternalLink, Navigation } from "lucide-react";
import { Button } from "./ui/button";
import StatusBadge from "./StatusBadge";

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Create custom icons
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: "custom-icon",
    html: `<div class="marker-pin bg-${color}-500 border-2 border-white rounded-full w-6 h-6 flex items-center justify-center shadow-md"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

// Component to handle map center changes
const SetViewOnChange = ({ coords }: { coords: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, map.getZoom());
  }, [coords, map]);
  return null;
};

interface MapProps {
  machines: VendingMachine[];
  selectedMachine: VendingMachine | null;
  onSelectMachine: (machine: VendingMachine) => void;
  className?: string;
}

const Map: React.FC<MapProps> = ({
  machines,
  selectedMachine,
  onSelectMachine,
  className,
}) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const defaultCenter: [number, number] = [52.3676, 4.9041]; // Amsterdam
  const center = selectedMachine
    ? [selectedMachine.lat, selectedMachine.lng] as [number, number]
    : userLocation || defaultCenter;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([
          position.coords.latitude,
          position.coords.longitude,
        ]);
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  }, []);

  const getDirectionsUrl = (lat: number, lng: number) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  };

  return (
    <div className={cn("relative w-full h-full", className)}>
      <MapContainer
        className="h-full w-full"
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <SetViewOnChange coords={center} />

        {machines.map((machine) => {
          const isSelected = selectedMachine?.id === machine.id;
          const markerIcon = isSelected
            ? createCustomIcon("blue")
            : createCustomIcon(
                machine.status === "stocked"
                  ? "green"
                  : machine.status === "low"
                  ? "yellow"
                  : "red"
              );

          return (
            <Marker
              key={machine.id}
              position={[machine.lat, machine.lng]}
              icon={markerIcon}
              eventHandlers={{
                click: () => onSelectMachine(machine),
              }}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-medium">{machine.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{machine.address}</p>
                  
                  <div className="flex items-center mb-2">
                    <StatusBadge status={machine.status} />
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(getDirectionsUrl(machine.lat, machine.lng), "_blank");
                      }}
                    >
                      <Navigation className="mr-2 h-4 w-4" />
                      Navigeer
                    </Button>
                    
                    {machine.website && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(machine.website, "_blank");
                        }}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Website
                      </Button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {userLocation && (
          <Marker
            position={userLocation}
            icon={L.divIcon({
              className: "custom-icon",
              html: `<div class="marker-pin bg-blue-500 border-2 border-white rounded-full w-6 h-6 flex items-center justify-center shadow-md pulse-animation"></div>`,
              iconSize: [24, 24],
              iconAnchor: [12, 24],
            })}
          >
            <Popup>Jouw locatie</Popup>
          </Marker>
        )}
      </MapContainer>

      <style>
        {`
        .pulse-animation {
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }
        `}
      </style>
    </div>
  );
};

export default Map;
