
import { useState } from "react";
import ProductionChart from "./ProductionChart";
import EnhancedSimulator from "./EnhancedSimulator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { BarChart, Calculator, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DashboardV2() {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Pénurie possible de gypse cette semaine", read: false },
    { id: 2, message: "Maintenance du Four 2 prévue demain", read: false },
    { id: 3, message: "3 commandes urgentes de Plâtre A à traiter", read: false }
  ]);
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // Function to show success toast for production declaration
  const handleProductionDeclaration = () => {
    toast({
      title: "Production déclarée",
      description: "La déclaration de production a été effectuée avec succès",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Notification Alert */}
      {notifications.some(n => !n.read) && (
        <Alert className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 rounded-xl shadow-sm">
          <Bell className="h-5 w-5 text-amber-500 mr-2" />
          <AlertDescription className="flex justify-between items-center">
            <span className="text-amber-800 font-medium">
              Vous avez {notifications.filter(n => !n.read).length} notifications non lues
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-amber-700 hover:text-amber-900 hover:bg-amber-100"
            >
              Tout marquer comme lu
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-100 rounded-xl">
          <TabsTrigger 
            value="overview" 
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-800 data-[state=active]:shadow-sm"
          >
            <BarChart className="h-4 w-4" /> Aperçu
          </TabsTrigger>
          <TabsTrigger 
            value="simulator" 
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-800 data-[state=active]:shadow-sm"
          >
            <Calculator className="h-4 w-4" /> Simulateur
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="overview">
            <ProductionChart setActiveTab={setActiveTab} />
          </TabsContent>
          
          <TabsContent value="simulator">
            <EnhancedSimulator onFinalizeProduction={handleProductionDeclaration} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
