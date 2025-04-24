import { useState } from "react";
import ProductionChart from "./ProductionChart";
import EnhancedSimulator from "./EnhancedSimulator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { BarChart, Calculator, Bell } from "lucide-react";

export default function DashboardV2() {
  const [activeTab, setActiveTab] = useState("overview");
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Pénurie possible de gypse cette semaine", read: false },
    { id: 2, message: "Maintenance du Four 2 prévue demain", read: false },
    { id: 3, message: "3 commandes urgentes de Plâtre A à traiter", read: false }
  ]);
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {notifications.some(n => !n.read) && (
        <Alert className="bg-amber-50 border-amber-200">
          <Bell className="h-4 w-4 text-amber-500 mr-2" />
          <AlertDescription className="flex justify-between items-center">
            <span>
              Vous avez {notifications.filter(n => !n.read).length} notifications non lues
            </span>
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Tout marquer comme lu
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" /> Aperçu
          </TabsTrigger>
          <TabsTrigger value="simulator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" /> Simulateur
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="overview">
            <ProductionChart />
          </TabsContent>
          
          <TabsContent value="simulator">
            <EnhancedSimulator />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
