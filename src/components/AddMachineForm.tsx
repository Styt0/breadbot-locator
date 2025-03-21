
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, MapPin, Plus } from "lucide-react";
import { addVendingMachine, getUserLocation } from "@/utils/vendingMachines";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

// Define form schema
const formSchema = z.object({
  name: z.string().min(3, "Naam moet minstens 3 karakters bevatten"),
  address: z.string().min(5, "Adres moet minstens 5 karakters bevatten"),
  city: z.string().min(2, "Stad moet minstens 2 karakters bevatten"),
});

type FormValues = z.infer<typeof formSchema>;

interface AddMachineFormProps {
  onSuccess?: () => void;
  className?: string;
}

const AddMachineForm: React.FC<AddMachineFormProps> = ({ onSuccess, className }) => {
  const [submitting, setSubmitting] = useState(false);
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "Amsterdam",
    },
  });

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    try {
      setSubmitting(true);
      
      // Get current user location for the vending machine
      const location = await getUserLocation();
      
      // Add the new vending machine
      await addVendingMachine({
        name: data.name,
        address: data.address,
        city: data.city,
        isStocked: true, // Assume new machines are stocked
        location: location,
      });
      
      // Show success message
      toast.success("Broodautomaat succesvol toegevoegd!");
      
      // Reset form
      form.reset();
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error adding vending machine:", error);
      toast.error("Er is een fout opgetreden bij het toevoegen van de automaat");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center mb-6">
        <Plus className="w-5 h-5 mr-2 text-blue-500" />
        <h2 className="text-xl font-medium">Nieuwe broodautomaat toevoegen</h2>
      </div>
      
      <div className="p-4 mb-6 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-start">
          <MapPin className="w-5 h-5 mr-3 text-blue-500 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800 font-medium">Locatie</p>
            <p className="text-sm text-blue-600 mt-1">
              De automaat wordt toegevoegd op je huidige locatie. Zorg ervoor dat 
              je op de juiste plaats staat voordat je de automaat toevoegt.
            </p>
          </div>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Naam automaat</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Bijv. Bakkerij Janssen"
                    {...field}
                    disabled={submitting}
                  />
                </FormControl>
                <FormDescription>
                  Geef de automaat een herkenbare naam.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adres</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Bijv. Dorpstraat 12"
                    {...field}
                    disabled={submitting}
                  />
                </FormControl>
                <FormDescription>
                  Voeg een duidelijke adresbeschrijving toe.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stad</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Bijv. Utrecht"
                    {...field}
                    disabled={submitting}
                  />
                </FormControl>
                <FormDescription>
                  In welke stad staat de automaat?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Toevoegen...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Broodautomaat toevoegen
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddMachineForm;
