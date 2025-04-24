
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Info, AlertTriangle, Droplet } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Updated mock data with minimum thresholds and alerts
const initialData = [
  { 
    name: "Plâtre A", 
    disponible: 1200, 
    commandes: 950,
    manquant: 0,
    stockMin: 500,
    alert: Math.random() > 0.85
  },
  { 
    name: "Plâtre B", 
    disponible: 800, 
    commandes: 1200,
    manquant: 400,
    stockMin: 400,
    alert: Math.random() > 0.85
  },
  { 
    name: "Plâtre C", 
    disponible: 1500, 
    commandes: 1000,
    manquant: 0,
    stockMin: 600,
    alert: Math.random() > 0.85
  },
  { 
    name: "Plâtre D", 
    disponible: 300, 
    commandes: 600,
    manquant: 300,
    stockMin: 300,
    alert: Math.random() > 0.85
  }
];

const rawMaterials = [
  { name: "Gypse", disponible: 85 },
  { name: "Diluant A", disponible: 92 },
  { name: "Diluant B", disponible: 67 },
];

export default function ProductionChart() {
  const [searchTerm, setSearchTerm] = useState("");
  const [chartData, setChartData] = useState(initialData);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Filter data based on search term
  const filteredData = chartData.filter(
    item => item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSimulate = (product: string, quantity: number) => {
    toast({
      title: "Simulation lancée",
      description: `Préparation de la simulation pour ${product} (${quantity} unités)`,
    });
    navigate("/simulator");
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-saint-gobain-blue flex items-center">
          Vue d'ensemble de la Production
        </CardTitle>
        <CardDescription>
          Analyse des quantités à produire basée sur les commandes actuelles
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Rechercher un produit..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Raw Materials Status */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <h3 className="font-medium flex items-center gap-2">
            <Droplet className="h-4 w-4 text-blue-500" />
            Disponibilité des Matières Premières
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {rawMaterials.map((material) => (
              <div key={material.name} className="bg-white p-3 rounded-md">
                <div className="text-sm font-medium">{material.name}</div>
                <div className={`text-lg font-bold ${material.disponible < 70 ? 'text-red-500' : 'text-green-500'}`}>
                  {material.disponible}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        {filteredData.filter(item => item.alert).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
            <div className="font-medium flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-4 w-4" />
              Alertes de Stock
            </div>
            {filteredData.filter(item => item.alert).map((item) => (
              <div key={item.name} className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-sm text-red-600 ml-2">
                    Stock en dessous du seuil minimum ({item.stockMin} unités)
                  </span>
                </div>
                <Button 
                  variant="destructive"
                  onClick={() => handleSimulate(item.name, item.stockMin - item.disponible)}
                >
                  Simuler la Production
                </Button>
              </div>
            ))}
          </div>
        )}
        
        <div className="h-80 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar name="Stock Disponible" dataKey="disponible" stackId="a" fill="#8B5CF6" />
              <Bar name="Commandes" dataKey="commandes" stackId="b" fill="#0EA5E9" />
              <Bar name="Quantité Manquante" dataKey="manquant" stackId="c" fill="#F97316" />
              <ReferenceLine y={400} stroke="#10B981" strokeDasharray="3 3" label="Seuil Minimum" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-purple-50 p-3 rounded-lg text-center relative">
            <HoverCard>
              <HoverCardTrigger>
                <Info className="h-4 w-4 absolute right-2 top-2 text-purple-600 cursor-help" />
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <p>Représente la quantité totale de produits actuellement disponibles en stock. Ce KPI est crucial pour la gestion des approvisionnements et la planification de la production.</p>
              </HoverCardContent>
            </HoverCard>
            <div className="text-sm font-medium text-purple-800">Stock Total</div>
            <div className="text-xl font-bold">3,800 kg</div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg text-center relative">
            <HoverCard>
              <HoverCardTrigger>
                <Info className="h-4 w-4 absolute right-2 top-2 text-blue-600 cursor-help" />
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <p>Indique le volume total des commandes en cours. Permet d'anticiper la production nécessaire et d'identifier les pics de demande.</p>
              </HoverCardContent>
            </HoverCard>
            <div className="text-sm font-medium text-blue-800">Commandes</div>
            <div className="text-xl font-bold">3,750 kg</div>
          </div>
          
          <div className="bg-orange-50 p-3 rounded-lg text-center relative">
            <HoverCard>
              <HoverCardTrigger>
                <Info className="h-4 w-4 absolute right-2 top-2 text-orange-600 cursor-help" />
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <p>Représente la différence entre les commandes et le stock disponible. Un indicateur clé pour prioriser la production et éviter les ruptures.</p>
              </HoverCardContent>
            </HoverCard>
            <div className="text-sm font-medium text-orange-800">Manquant</div>
            <div className="text-xl font-bold">700 kg</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
