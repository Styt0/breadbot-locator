
import React, { useState } from "react";
import { MapPin, Locate, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getUserLocation } from "@/utils/vendingMachines";
import { toast } from "sonner";
import mapboxgl from "mapbox-gl";

interface LocationSearchProps {
  onLocationFound?: (location: { lat: number; lng: number }) => void;
  className?: string;
}

// Set the Mapbox access token
mapboxgl.accessToken = "pk.eyJ1Ijoic3R5dG8iLCJhIjoiY204a2VtOXhkMHhqZTJrcXI5bjlyZjhsNSJ9.xeo91AG44Yz9q-zp7LEMrg";

const LocationSearch: React.FC<LocationSearchProps> = ({ 
  onLocationFound,
  className 
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<string | null>("Reet, Antwerpen");

  // Educated guess of user location based on browser language or timezone
  React.useEffect(() => {
    try {
      // Try to guess location based on browser language
      const language = navigator.language;
      let guessedLocation = "Reet, Antwerpen"; // Default to Reet, Antwerpen

      if (language.includes("nl")) {
        guessedLocation = "Reet, Antwerpen";
      } else if (language.includes("be")) {
        guessedLocation = "Reet, Antwerpen";
      } else if (language.includes("de")) {
        guessedLocation = "Deutschland";
      } else if (language.includes("fr")) {
        guessedLocation = "France";
      } else if (language.includes("en-GB")) {
        guessedLocation = "United Kingdom";
      }

      setCurrentLocation(guessedLocation);
      
    } catch (error) {
      console.error("Error guessing location:", error);
      setCurrentLocation("Reet, Antwerpen");
    }
  }, []);

  const handleLocateMe = async () => {
    setIsLocating(true);
    try {
      const location = await getUserLocation();
      if (onLocationFound) {
        onLocationFound(location);
      }
      
      // Using the browser's Geocoding API to get location name (if available)
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${location.lng},${location.lat}.json?access_token=${mapboxgl.accessToken}&language=nl`
        );
        const data = await response.json();
        if (data.features && data.features.length > 0) {
          // Get city or location name from the geocoding result
          const place = data.features.find(
            (f: any) => f.place_type.includes("place") || f.place_type.includes("locality")
          );
          if (place) {
            setCurrentLocation(place.text);
          } else {
            setCurrentLocation(data.features[0].place_name.split(',')[0]);
          }
        }
      } catch (geocodeError) {
        console.error("Error geocoding location:", geocodeError);
      }
      
      toast.success("Locatie gevonden!");
    } catch (error) {
      console.error("Error getting location:", error);
      toast.error("Kon je locatie niet bepalen");
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <div className={className}>
      <div className="relative flex items-center">
        <MapPin className="absolute left-3 text-muted-foreground h-5 w-5" />
        <Input
          type="text"
          placeholder="Zoek een locatie..."
          className="pl-10 pr-24 py-6 text-base shadow-md border-gray-200 focus-visible:ring-bread-500"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLocateMe}
          disabled={isLocating}
          className="absolute right-2 gap-1.5 hover:bg-bread-50"
        >
          {isLocating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Locate className="h-4 w-4 text-bread-600" />
          )}
          <span className="text-bread-600">Locate</span>
        </Button>
      </div>
      
      {currentLocation && (
        <div 
          className="flex items-center mt-2 text-sm text-muted-foreground cursor-pointer" 
          onClick={handleLocateMe}
        >
          <MapPin className="h-3.5 w-3.5 mr-1.5 text-bread-600" />
          <span>
            {isLocating 
              ? "Locatie bepalen..." 
              : `Huidige locatie: ${currentLocation}`}
          </span>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
