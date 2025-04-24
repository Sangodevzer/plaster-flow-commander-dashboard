
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { X, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { alerts } from "@/data/mockData";

export default function AlertBanner() {
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  
  // Filter to show only unread critical and warning alerts
  const activeAlerts = alerts.filter(
    alert => !alert.read && 
    !dismissedAlerts.includes(alert.id) && 
    (alert.type === "Critical" || alert.type === "Warning")
  );
  
  const getIcon = (type: string) => {
    switch(type) {
      case "Critical": 
        return <AlertCircle className="h-5 w-5 text-white" />;
      case "Warning": 
        return <AlertTriangle className="h-5 w-5 text-white" />;
      default: 
        return <Info className="h-5 w-5 text-white" />;
    }
  };
  
  const getBgColor = (type: string) => {
    switch(type) {
      case "Critical": 
        return "bg-factory-red";
      case "Warning": 
        return "bg-factory-amber";
      default: 
        return "bg-factory-blue";
    }
  };
  
  const dismissAlert = (id: string) => {
    setDismissedAlerts([...dismissedAlerts, id]);
  };
  
  if (activeAlerts.length === 0) return null;
  
  return (
    <div id="alerts" className="fixed bottom-4 right-4 z-50 space-y-3 max-w-lg w-full">
      {activeAlerts.map((alert) => (
        <Alert 
          key={alert.id} 
          className={`${getBgColor(alert.type)} text-white shadow-lg animate-pulse-alert`}
        >
          <div className="flex justify-between items-start w-full">
            <div className="flex items-start">
              {getIcon(alert.type)}
              <div className="ml-3">
                <AlertTitle className="text-white">{alert.title}</AlertTitle>
                <AlertDescription className="text-white/90 mt-1">
                  {alert.description}
                </AlertDescription>
                <div className="text-xs text-white/80 mt-1">
                  {new Date(alert.timestamp).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 rounded-full text-white/80 hover:text-white hover:bg-white/20"
              onClick={() => dismissAlert(alert.id)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fermer</span>
            </Button>
          </div>
        </Alert>
      ))}
    </div>
  );
}
