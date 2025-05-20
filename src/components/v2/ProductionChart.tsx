
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Search, Filter, X } from "lucide-react";
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "@/components/ui/toggle-group";

// Données initiales pour le graphique
const initialData = [
  { 
    name: "Plâtre A", 
    disponible: 1200, 
    commandes: 950,
    stockMin: 500,
    enProduction: true
  },
  { 
    name: "Plâtre B", 
    disponible: 800, 
    commandes: 1200,
    stockMin: 400,
    enProduction: true
  },
  { 
    name: "Plâtre C", 
    disponible: 1500, 
    commandes: 1000,
    stockMin: 600,
    enProduction: false
  },
  { 
    name: "Plâtre D", 
    disponible: 300, 
    commandes: 600,
    stockMin: 300,
    enProduction: true
  }
];

export default function ProductionChart({ setActiveTab }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState(["enProduction"]);
  const [chartData, setChartData] = useState(initialData);
  const [filteredData, setFilteredData] = useState([]);
  
  // Filtre les données en fonction des termes de recherche et des filtres sélectionnés
  useEffect(() => {
    let filtered = [...chartData];
    
    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(
        item => item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Appliquer les filtres sélectionnés
    if (filters.length > 0) {
      if (filters.includes("enProduction")) {
        filtered = filtered.filter(item => item.enProduction);
      }
      
      if (filters.includes("commandes") && !filters.includes("enProduction")) {
        filtered = filtered.filter(item => item.commandes > 0);
      }
    }
    
    setFilteredData(filtered);
  }, [searchTerm, filters, chartData]);

  // Naviguer vers la page du simulateur
  const navigateToSimulator = () => {
    setActiveTab("simulator");
  };

  // Calculer les totaux pour le tableau récapitulatif
  const calculateTotals = () => {
    return {
      stockTotal: filteredData.reduce((sum, item) => sum + item.disponible, 0),
      commandesTotal: filteredData.reduce((sum, item) => sum + item.commandes, 0),
      stockMinTotal: filteredData.reduce((sum, item) => sum + item.stockMin, 0)
    };
  };

  const totals = calculateTotals();

  return (
    <Card className="w-full border-none shadow-lg bg-white rounded-xl overflow-hidden">
      <CardHeader className="space-y-1 bg-gradient-to-r from-blue-50 to-violet-50 pb-6">
        <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
          Vue d'ensemble de la Production
        </CardTitle>
        <CardDescription className="text-gray-600 text-base">
          Analyse des stocks et commandes pour les produits en production
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4 md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Rechercher un produit..."
              className="pl-10 border-gray-300 focus:border-violet-400 focus:ring-violet-300 h-11 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-500 hover:text-gray-700"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500 mr-1" />
            <ToggleGroup 
              type="multiple" 
              value={filters}
              onValueChange={(value) => {
                if (value.length === 0) {
                  // Si aucun filtre n'est sélectionné, ne rien faire
                  // ou définir un comportement par défaut
                  setFilters([]);
                } else {
                  setFilters(value);
                }
              }}
              className="flex"
            >
              <ToggleGroupItem value="enProduction" className="px-4 py-2 text-sm border-violet-200 data-[state=on]:bg-violet-100 data-[state=on]:text-violet-900">
                En production
              </ToggleGroupItem>
              <ToggleGroupItem value="commandes" className="px-4 py-2 text-sm border-violet-200 data-[state=on]:bg-violet-100 data-[state=on]:text-violet-900">
                Commandés
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        
        <div className="h-80 mt-6 bg-gray-50 p-4 rounded-xl">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barGap={8}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
              <YAxis tick={{ fill: '#6b7280' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
                  border: 'none' 
                }}
                formatter={(value, name) => {
                  let displayName = name;
                  if (name === 'disponible') displayName = 'Stock Disponible';
                  if (name === 'commandes') displayName = 'Commandes';
                  if (name === 'stockMin') displayName = 'Stock Minimum';
                  return [value + ' kg', displayName];
                }}
              />
              <Legend 
                formatter={(value) => {
                  if (value === 'disponible') return 'Stock Disponible';
                  if (value === 'commandes') return 'Commandes';
                  if (value === 'stockMin') return 'Stock Minimum';
                  return value;
                }}
              />
              <Bar name="disponible" dataKey="disponible" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar name="commandes" dataKey="commandes" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              <Bar name="stockMin" dataKey="stockMin" fill="#c084fc" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-gradient-to-br from-violet-50 to-purple-100 p-5 rounded-xl text-center transition-all hover:shadow-md">
            <div className="text-sm font-medium text-violet-700 mb-1">Stock Total</div>
            <div className="text-2xl font-bold text-violet-900">{totals.stockTotal.toLocaleString()} kg</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl text-center transition-all hover:shadow-md">
            <div className="text-sm font-medium text-blue-700 mb-1">Commandes</div>
            <div className="text-2xl font-bold text-blue-900">{totals.commandesTotal.toLocaleString()} kg</div>
          </div>
          <div className="bg-gradient-to-br from-violet-50 to-fuchsia-100 p-5 rounded-xl text-center transition-all hover:shadow-md">
            <div className="text-sm font-medium text-fuchsia-700 mb-1">Stock Min. Total</div>
            <div className="text-2xl font-bold text-fuchsia-900">{totals.stockMinTotal.toLocaleString()} kg</div>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button 
            className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white font-medium px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all"
            onClick={navigateToSimulator}
          >
            Accéder au Simulateur
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
