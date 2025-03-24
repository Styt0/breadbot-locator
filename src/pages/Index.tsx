
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Navigation, Map as MapIcon, ListFilter, MapPin, Plus, Sparkles } from "lucide-react";
import NavBar from "@/components/NavBar";
import Map from "@/components/Map";
import VendingMachineList from "@/components/VendingMachineList";
import VendingMachineCard from "@/components/VendingMachineCard";
import AddMachineForm from "@/components/AddMachineForm";
import LocationSearch from "@/components/LocationSearch";
import UserProfile from "@/components/UserProfile";
import NearbyMachineSuggestion from "@/components/NearbyMachineSuggestion";
import { UserBadge } from "@/components/BadgeSystem";
import { 
  VendingMachine, 
  getVendingMachines, 
  getClosestVendingMachines,
  getVendingMachinesInRadius,
  updateVendingMachineStatus
} from "@/utils/vendingMachines";
import { toast } from "sonner";

// Mock user data for the gamification system
const MOCK_USER_BADGES: UserBadge[] = [
  {
    id: "badge-1",
    name: "Eerste Update",
    description: "Je eerste status update van een broodautomaat",
    icon: "trophy",
    earned: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5)
  },
  {
    id: "badge-2",
    name: "Verse Ogen",
    description: "Eerste persoon die een verse voorraad meldt",
    icon: "star",
    earned: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
  },
  {
    id: "badge-3",
    name: "Vijf Updates",
    description: "5 broodautomaten bijgewerkt",
    icon: "award",
    earned: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 12)
  },
  {
    id: "badge-4",
    name: "Tien Updates",
    description: "10 broodautomaten bijgewerkt",
    icon: "award",
    earned: false
  },
  {
    id: "badge-5",
    name: "Broodexpert",
    description: "25 broodautomaten bijgewerkt",
    icon: "trophy",
    earned: false
  },
  {
    id: "badge-6",
    name: "Fotograaf",
    description: "Eerste foto van een broodautomaat",
    icon: "star",
    earned: false
  }
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("map");
  const [machines, setMachines] = useState<VendingMachine[]>([]);
  const [closestMachines, setClosestMachines] = useState<VendingMachine[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<VendingMachine | null>(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Mock user stats
  const [userPoints, setUserPoints] = useState(135);
  const [contributionCount, setContributionCount] = useState(5);

  useEffect(() => {
    const loadAllMachines = async () => {
      try {
        const allMachines = getVendingMachines();
        setMachines(allMachines);
        
        const nearest = await getClosestVendingMachines(5);
        setClosestMachines(nearest);
      } catch (error) {
        console.error("Error loading vending machines:", error);
        toast.error("Er is een fout opgetreden bij het laden van de automaten");
      } finally {
        setLoading(false);
      }
    };

    loadAllMachines();
  }, []);

  const refreshMachines = async (location?: { lat: number; lng: number }) => {
    try {
      setLoading(true);
      
      if (location) {
        setUserLocation(location);
      }
      
      const allMachines = await getVendingMachinesInRadius(20, location?.lat, location?.lng);
      setMachines(allMachines);
      
      const nearest = await getClosestVendingMachines(5);
      setClosestMachines(nearest);
      
      toast.success("Automaten bijgewerkt");
    } catch (error) {
      console.error("Error refreshing machines:", error);
      toast.error("Kon de automaten niet bijwerken");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationFound = (location: { lat: number; lng: number }) => {
    refreshMachines(location);
  };

  const handleAddMachine = () => {
    refreshMachines();
    setActiveTab("map");
    
    // Add points for contributing a new machine
    setUserPoints(prev => prev + 50);
    setContributionCount(prev => prev + 1);
  };

  const handleStatusChange = (machine: VendingMachine) => {
    setMachines(prev => 
      prev.map(m => m.id === machine.id ? machine : m)
    );
    
    setClosestMachines(prev => 
      prev.map(m => m.id === machine.id ? machine : m)
    );
    
    if (selectedMachine?.id === machine.id) {
      setSelectedMachine(machine);
    }
    
    // Add points for updating status
    setUserPoints(prev => prev + 10);
    setContributionCount(prev => prev + 1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="container px-4 py-6 flex-1 flex flex-col md:py-8">
        <section className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-medium tracking-tight md:text-4xl mb-3">
            Vind de dichtstbijzijnde broodautomaat
          </h1>
          <p className="text-muted-foreground max-w-2xl mb-6">
            Ontdek broodautomaten in je buurt, bekijk of ze nog gevuld zijn, 
            of voeg nieuwe automaten toe om anderen te helpen.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="md:col-span-3">
              <LocationSearch 
                onLocationFound={handleLocationFound}
              />
            </div>
            <div className="md:col-span-1">
              <UserProfile 
                username="BroodLiefhebber"
                points={userPoints}
                contributionCount={contributionCount}
                level={Math.floor(userPoints / 100) + 1}
                badges={MOCK_USER_BADGES}
              />
            </div>
          </div>
          
          {/* Auto-suggest nearest machine */}
          <div className="mb-6">
            <NearbyMachineSuggestion 
              onSelectMachine={(machine) => {
                setSelectedMachine(machine);
                setActiveTab("map");
              }}
            />
          </div>
          
          <div className="mt-6">
            <div className="flex items-center mb-4 cursor-pointer" onClick={() => handleLocationFound(userLocation || { lat: 52.3676, lng: 4.9041 })}>
              <Navigation className="mr-2 h-5 w-5 text-blue-500" />
              <h2 className="text-xl font-medium">Dichtst bij jou</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <div 
                    key={i} 
                    className="h-24 bg-gray-100 animate-pulse rounded-xl"
                  />
                ))
              ) : closestMachines.length === 0 ? (
                <div className="col-span-full py-12 text-center text-muted-foreground">
                  <p>Geen automaten gevonden in de buurt</p>
                </div>
              ) : (
                closestMachines.map((machine) => (
                  <VendingMachineCard 
                    key={machine.id} 
                    machine={machine}
                    compact={true}
                    className="h-full"
                    onStatusChange={handleStatusChange}
                    onSelectMachine={() => {
                      setSelectedMachine(machine);
                      setActiveTab("map");
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </section>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col"
        >
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="map" className="flex items-center">
                <MapIcon className="mr-2 h-4 w-4" />
                <span>Kaart</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center">
                <ListFilter className="mr-2 h-4 w-4" />
                <span>Lijst</span>
              </TabsTrigger>
              <TabsTrigger value="add" className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                <span>Toevoegen</span>
              </TabsTrigger>
            </TabsList>
            
            <Button 
              variant="outline"
              size="sm"
              onClick={() => refreshMachines()}
              disabled={loading}
              className="hidden sm:flex"
            >
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              <span>Vernieuwen</span>
            </Button>
          </div>
          
          <TabsContent 
            value="map" 
            className="flex-1 mt-0 rounded-xl border overflow-hidden shadow-subtle"
          >
            <Map 
              machines={machines}
              selectedMachine={selectedMachine}
              onSelectMachine={setSelectedMachine}
              className="h-[calc(100vh-400px)] min-h-[400px]"
            />
          </TabsContent>
          
          <TabsContent 
            value="list" 
            className="flex-1 mt-0 overflow-hidden rounded-xl border bg-white shadow-subtle"
          >
            <VendingMachineList 
              onSelectMachine={(machine) => {
                setSelectedMachine(machine);
                setActiveTab("map");
              }}
            />
          </TabsContent>
          
          <TabsContent 
            value="add" 
            className="flex-1 mt-0 overflow-hidden rounded-xl border bg-white shadow-subtle p-6"
          >
            <AddMachineForm onSuccess={handleAddMachine} />
          </TabsContent>
        </Tabs>
      </div>
      
      <footer className="border-t py-6 bg-white">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 BroodBot - Vind eenvoudig broodautomaten in je buurt</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
