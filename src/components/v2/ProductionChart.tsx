
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Search, ChevronDown } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

// Mock data for the stacked column chart
const initialData = [
  { 
    name: "Plâtre A", 
    disponible: 1200, 
    commandes: 950,
    manquant: 0,
    stockMin: 500 
  },
  { 
    name: "Plâtre B", 
    disponible: 800, 
    commandes: 1200,
    manquant: 400,
    stockMin: 400 
  },
  { 
    name: "Plâtre C", 
    disponible: 1500, 
    commandes: 1000,
    manquant: 0,
    stockMin: 600 
  },
  { 
    name: "Plâtre D", 
    disponible: 300, 
    commandes: 600,
    manquant: 300,
    stockMin: 300 
  }
];

export default function ProductionChart() {
  const [searchTerm, setSearchTerm] = useState("");
  const [timeRange, setTimeRange] = useState("semaine");
  const [chartData, setChartData] = useState(initialData);
  
  // Filter data based on search term
  const filteredData = chartData.filter(
    item => item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-saint-gobain-blue flex items-center">
          Vue d'ensemble de la Production
        </CardTitle>
        <CardDescription>
          Analyse des quantités à produire basée sur les commandes actuelles et futures
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
          <Select
            value={timeRange}
            onValueChange={setTimeRange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jour">Aujourd'hui</SelectItem>
              <SelectItem value="semaine">Cette Semaine</SelectItem>
              <SelectItem value="mois">Ce Mois</SelectItem>
              <SelectItem value="trimestre">Ce Trimestre</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            Filtres <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
        
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
              <Bar name="Stock Minimum" dataKey="stockMin" stackId="d" fill="#D946EF" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-purple-50 p-3 rounded-lg text-center">
            <div className="text-sm text-purple-800">Stock Total</div>
            <div className="text-xl font-bold">3,800 kg</div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-sm text-blue-800">Commandes</div>
            <div className="text-xl font-bold">3,750 kg</div>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg text-center">
            <div className="text-sm text-orange-800">Manquant</div>
            <div className="text-xl font-bold">700 kg</div>
          </div>
          <div className="bg-pink-50 p-3 rounded-lg text-center">
            <div className="text-sm text-pink-800">Stock Min. Total</div>
            <div className="text-xl font-bold">1,800 kg</div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            className="bg-saint-gobain-blue hover:bg-blue-700"
          >
            Accéder au Simulateur
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
