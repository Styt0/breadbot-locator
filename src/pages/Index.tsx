import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Navigation, Map as MapIcon, ListFilter, MapPin, Plus, Sparkles } from "lucide-react";
import NavBar from "@/components/NavBar";
import Map from "@/components/Map";
import VendingMachineList from "@/components/VendingMachineList";
import VendingMachineCard from "@/components/VendingMachineCard";
import AddMachineForm from "@/components/AddMachineForm";
import { 
  VendingMachine, 
  getVendingMachines, 
  getClosestVendingMachines,
  getVendingMachinesInRadius,
  updateVendingMachineStatus
} from "@/utils/vendingMachines";
import { toast } from "sonner";

const Index = () => {
  const [activeTab, setActiveTab] = useState("map");
  const [machines, setMachines] = useState<VendingMachine[]>([]);
  const [closestMachines, setClosestMachines] = useState<VendingMachine[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<VendingMachine | null>(null);
  const [loading, setLoading] = useState(true);

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

  const refreshMachines = async () => {
    try {
      setLoading(true);
      
      const allMachines = await getVendingMachinesInRadius(20);
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

  const handleAddMachine = () => {
    refreshMachines();
    setActiveTab("map");
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
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="container px-4 py-6 flex-1 flex flex-col md:py-8">
        <section className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-medium tracking-tight md:text-4xl mb-3">
            Vind de dichtstbijzijnde broodautomaat
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Ontdek broodautomaten in je buurt, bekijk of ze nog gevuld zijn, 
            of voeg nieuwe automaten toe om anderen te helpen.
          </p>
          
          <div className="mt-6">
            <div className="flex items-center mb-4">
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
                    onSelect={() => {
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
              onClick={refreshMachines}
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
          <p>© 2023 BroodBot Locator - Vind eenvoudig broodautomaten in je buurt</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
