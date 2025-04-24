
import { Bell, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { alerts } from "../data/mockData";

export default function Header() {
  const unreadAlerts = alerts.filter(alert => !alert.read).length;
  
  return (
    <header className="bg-white border-b border-gray-200 flex items-center justify-between px-6 py-3">
      <div>
        <h1 className="text-2xl font-bold text-factory-darkBlue">
          Tableau de Bord de Gestion de la Production
        </h1>
        <p className="text-gray-500">
          {new Date().toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>
      
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadAlerts > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-factory-red text-white">
                  {unreadAlerts}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {alerts.map(alert => (
              <DropdownMenuItem key={alert.id} className="py-3 cursor-default">
                <div>
                  <div className="flex justify-between items-center">
                    <p className={`font-semibold ${!alert.read && "text-factory-blue"}`}>
                      {alert.title}
                    </p>
                    <Badge variant={
                      alert.type === "Critical" ? "destructive" : 
                      alert.type === "Warning" ? "default" : 
                      "outline"
                    } className="ml-2">
                      {alert.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{alert.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(alert.timestamp).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profil</DropdownMenuItem>
            <DropdownMenuItem>Paramètres</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Déconnexion</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
