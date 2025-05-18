
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FlaskConical, Clock, Coins, AlertTriangle } from "lucide-react";

// Mock data for products
const products = [
  { id: "plaster-a", name: "Plâtre A", baseTime: 4, temp: 180, cost: 12.50 },
  { id: "plaster-b", name: "Plâtre B", baseTime: 5, temp: 190, cost: 14.75 },
  { id: "plaster-c", name: "Plâtre C", baseTime: 3, temp: 175, cost: 11.25 },
  { id: "plaster-d", name: "Plâtre D", baseTime: 6, temp: 200, cost: 15.90 }
];

export default function EnhancedSimulator({ onFinalizeProduction }) {
  // State for simulation parameters
  const [selectedTab, setSelectedTab] = useState("setup");
  const [selectedProducts, setSelectedProducts] = useState([
    { id: "plaster-a", name: "Plâtre A", quantity: 1000, priority: 1 }
  ]);
  const [absenceFactor, setAbsenceFactor] = useState(10); // percentage
  const [machineFactor, setMachineFactor] = useState(15); // percentage
  const [materialShortage, setMaterialShortage] = useState(5); // percentage
  
  // State for simulation results
  const [simulationRun, setSimulationRun] = useState(false);
  const [scenarios, setScenarios] = useState([]);
  const [recommendedScenario, setRecommendedScenario] = useState(null);
  
  // Add a product to the simulation
  const addProduct = () => {
    if (selectedProducts.length < 4) {
      const newProduct = {
        id: `plaster-${String.fromCharCode(97 + selectedProducts.length)}`, 
        name: `Plâtre ${String.fromCharCode(65 + selectedProducts.length)}`,
        quantity: 500,
        priority: selectedProducts.length + 1
      };
      
      setSelectedProducts([...selectedProducts, newProduct]);
    }
  };
  
  // Remove a product from the simulation
  const removeProduct = (index) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts.splice(index, 1);
    
    // Update priorities
    const reorderedProducts = updatedProducts.map((product, idx) => ({
      ...product,
      priority: idx + 1
    }));
    
    setSelectedProducts(reorderedProducts);
  };
  
  // Update product quantity
  const updateQuantity = (index, quantity) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index] = {
      ...updatedProducts[index],
      quantity: Number(quantity)
    };
    setSelectedProducts(updatedProducts);
  };
  
  // Run simulation function
  const runSimulation = () => {
    // Generate mock scenarios based on inputs
    const mockScenarios = [
      {
        id: "scenario-1",
        name: "Scénario Optimal",
        time: Math.round(10 + (absenceFactor/100 * 2) + (machineFactor/100 * 3)),
        cost: Math.round(120 + (materialShortage/100 * 30)),
        risk: Math.round(15 + (machineFactor/100 * 20)),
        recommended: true
      },
      {
        id: "scenario-2",
        name: "Scénario Rapide",
        time: Math.round(8 + (absenceFactor/100 * 1.5) + (machineFactor/100 * 2)),
        cost: Math.round(150 + (materialShortage/100 * 40)),
        risk: Math.round(25 + (machineFactor/100 * 30)),
        recommended: false
      },
      {
        id: "scenario-3",
        name: "Scénario Économique",
        time: Math.round(14 + (absenceFactor/100 * 3) + (machineFactor/100 * 4)),
        cost: Math.round(100 + (materialShortage/100 * 20)),
        risk: Math.round(10 + (machineFactor/100 * 15)),
        recommended: false
      }
    ];
    
    setScenarios(mockScenarios);
    setRecommendedScenario(mockScenarios.find(s => s.recommended));
    setSimulationRun(true);
    setSelectedTab("results");
  };
  
  // Reset simulation
  const resetSimulation = () => {
    setSimulationRun(false);
    setScenarios([]);
    setRecommendedScenario(null);
    setSelectedTab("setup");
  };

  // Handle finalize production
  const handleFinalize = () => {
    if (onFinalizeProduction && typeof onFinalizeProduction === 'function') {
      onFinalizeProduction();
    }
  };
  
  // Get comparison chart data
  const getComparisonChartData = () => {
    return scenarios.map(scenario => ({
      name: scenario.name.split(" ")[1],
      temps: scenario.time,
      cout: scenario.cost,
      risque: scenario.risk
    }));
  };
  
  // Get cost breakdown data
  const getCostBreakdownData = () => {
    if (!recommendedScenario) return [];
    
    return [
      { name: "Main d'œuvre", value: Math.round(recommendedScenario.cost * 0.4) },
      { name: "Matières", value: Math.round(recommendedScenario.cost * 0.35) },
      { name: "Énergie", value: Math.round(recommendedScenario.cost * 0.15) },
      { name: "Maintenance", value: Math.round(recommendedScenario.cost * 0.1) }
    ];
  };
  
  // Get time series data
  const getTimeSeriesData = () => {
    if (!recommendedScenario) return [];
    
    const baseTime = recommendedScenario.time;
    return [
      { hour: "1h", production: Math.round(baseTime * 0.1) },
      { hour: "2h", production: Math.round(baseTime * 0.25) },
      { hour: "3h", production: Math.round(baseTime * 0.4) },
      { hour: "4h", production: Math.round(baseTime * 0.55) },
      { hour: "5h", production: Math.round(baseTime * 0.7) },
      { hour: "6h", production: Math.round(baseTime * 0.85) },
      { hour: "7h", production: Math.round(baseTime * 1) }
    ];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-saint-gobain-blue">
          <FlaskConical className="h-5 w-5 mr-2" />
          Simulateur de Production Avancé
        </CardTitle>
        <CardDescription>
          Testez différentes configurations pour optimiser votre production
        </CardDescription>
      </CardHeader>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="setup">Configuration</TabsTrigger>
            <TabsTrigger value="results" disabled={!simulationRun}>Résultats</TabsTrigger>
            <TabsTrigger value="costs" disabled={!simulationRun}>Coûts</TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="p-6">
          {/* Setup Tab */}
          <TabsContent value="setup" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Products Selection */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Produits à Simuler</h3>
                  
                  {selectedProducts.map((product, index) => (
                    <div key={index} className="flex space-x-2 items-end">
                      <div className="flex-1 space-y-2">
                        <Label>Produit {index + 1}</Label>
                        <Select 
                          value={product.id} 
                          onValueChange={(value) => {
                            const updatedProducts = [...selectedProducts];
                            const selectedProduct = products.find(p => p.id === value);
                            updatedProducts[index] = {
                              ...updatedProducts[index],
                              id: selectedProduct.id,
                              name: selectedProduct.name
                            };
                            setSelectedProducts(updatedProducts);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un produit" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map(p => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <Label>Quantité (kg)</Label>
                        <Input 
                          type="number" 
                          value={product.quantity} 
                          onChange={(e) => updateQuantity(index, e.target.value)}
                          min={100}
                          step={100}
                        />
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="mb-0.5"
                        onClick={() => removeProduct(index)}
                        disabled={selectedProducts.length === 1}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={addProduct}
                    disabled={selectedProducts.length >= 4}
                  >
                    + Ajouter un Produit
                  </Button>
                </div>
              </div>
              
              {/* Risk Factors */}
              <div className="space-y-5">
                <h3 className="text-lg font-medium">Facteurs de Risque</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="absence-factor">Taux d'Absence</Label>
                    <span className="text-sm font-medium">{absenceFactor}%</span>
                  </div>
                  <Slider 
                    id="absence-factor"
                    value={[absenceFactor]}
                    onValueChange={(value) => setAbsenceFactor(value[0])}
                    min={0}
                    max={30}
                    step={1}
                  />
                  <p className="text-xs text-gray-500">
                    Impact des absences sur le temps de production
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="machine-factor">Risque de Panne Machine</Label>
                    <span className="text-sm font-medium">{machineFactor}%</span>
                  </div>
                  <Slider 
                    id="machine-factor"
                    value={[machineFactor]}
                    onValueChange={(value) => setMachineFactor(value[0])}
                    min={0}
                    max={50}
                    step={1}
                  />
                  <p className="text-xs text-gray-500">
                    Probabilité d'arrêt machine et impact sur le temps de production
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="material-shortage">Pénurie de Matières</Label>
                    <span className="text-sm font-medium">{materialShortage}%</span>
                  </div>
                  <Slider 
                    id="material-shortage"
                    value={[materialShortage]}
                    onValueChange={(value) => setMaterialShortage(value[0])}
                    min={0}
                    max={40}
                    step={1}
                  />
                  <p className="text-xs text-gray-500">
                    Impact sur les coûts de production
                  </p>
                </div>
                
                <div className="pt-4">
                  <Button 
                    className="w-full bg-saint-gobain-blue hover:bg-blue-700"
                    onClick={runSimulation}
                  >
                    Lancer la Simulation
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            {simulationRun && (
              <>
                <Alert className="bg-green-50 border-green-200">
                  <AlertDescription>
                    <div className="font-medium">Simulation terminée avec succès</div>
                    <div className="text-sm text-gray-600">
                      {selectedProducts.length} produits, {selectedProducts.reduce((sum, p) => sum + p.quantity, 0)} kg total
                    </div>
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Scénario Recommandé</h3>
                    {recommendedScenario && (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex justify-between items-center mb-3">
                          <div className="font-bold text-xl">{recommendedScenario.name}</div>
                          <Badge className="bg-green-500">Recommandé</Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-white p-3 rounded-md text-center">
                            <Clock className="h-5 w-5 mx-auto text-blue-600" />
                            <div className="mt-1 text-sm font-medium">Temps</div>
                            <div className="text-xl font-bold">{recommendedScenario.time}h</div>
                          </div>
                          <div className="bg-white p-3 rounded-md text-center">
                            <Coins className="h-5 w-5 mx-auto text-amber-600" />
                            <div className="mt-1 text-sm font-medium">Coût</div>
                            <div className="text-xl font-bold">{recommendedScenario.cost}€</div>
                          </div>
                          <div className="bg-white p-3 rounded-md text-center">
                            <AlertTriangle className="h-5 w-5 mx-auto text-red-600" />
                            <div className="mt-1 text-sm font-medium">Risque</div>
                            <div className="text-xl font-bold">{recommendedScenario.risk}%</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Comparaison des Scénarios</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getComparisonChartData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis yAxisId="left" orientation="left" stroke="#1A73E8" />
                          <YAxis yAxisId="right" orientation="right" stroke="#F44336" />
                          <Tooltip />
                          <Legend />
                          <Bar yAxisId="left" dataKey="temps" name="Temps (h)" fill="#1A73E8" />
                          <Bar yAxisId="left" dataKey="cout" name="Coût (€)" fill="#FFA000" />
                          <Bar yAxisId="right" dataKey="risque" name="Risque (%)" fill="#F44336" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Progression de Production</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={getTimeSeriesData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="hour" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="production" name="Production (%)" stroke="#8B5CF6" activeDot={{ r: 8 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Détails des Produits</h3>
                      <div className="space-y-3">
                        {selectedProducts.map((product, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-md">
                            <div className="flex justify-between">
                              <div className="font-medium">{product.name}</div>
                              <div>{product.quantity} kg</div>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              Priorité: {product.priority}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
          
          {/* Costs Tab */}
          <TabsContent value="costs" className="space-y-6">
            {simulationRun && (
              <>
                <div>
                  <h3 className="text-lg font-medium mb-3">Répartition des Coûts</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getCostBreakdownData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Coût (€)" fill="#D946EF" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Coût Total par Produit</h3>
                    <div className="space-y-3">
                      {selectedProducts.map((product, index) => {
                        const productCost = products.find(p => p.id === product.id)?.cost || 10;
                        const quantity = product.quantity;
                        const totalCost = productCost * quantity / 100;
                        
                        return (
                          <div key={index} className="bg-gray-50 p-3 rounded-md">
                            <div className="flex justify-between items-center">
                              <div className="font-medium">{product.name}</div>
                              <Badge className="bg-purple-100 text-purple-800">
                                {totalCost.toLocaleString('fr-FR')} €
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {product.quantity} kg × {productCost} €/100kg
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Analyse des Coûts</h3>
                    <div className="space-y-3">
                      {scenarios.map((scenario, index) => (
                        <div key={index} className={`p-3 rounded-md ${scenario.recommended ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                          <div className="flex justify-between items-center">
                            <div className="font-medium">{scenario.name}</div>
                            <div className="text-lg font-bold">{scenario.cost} €</div>
                          </div>
                          <div className="flex justify-between text-sm text-gray-500 mt-1">
                            <div>Coût unitaire moyen</div>
                            <div>
                              {(scenario.cost / selectedProducts.reduce((sum, p) => sum + p.quantity, 0) * 100).toFixed(2)} €/100kg
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6">
                      <Alert className="bg-amber-50 border-amber-200">
                        <AlertDescription>
                          <div className="font-medium">Impact des pénuries de matières</div>
                          <div className="text-sm">
                            Une pénurie de {materialShortage}% augmente les coûts d'environ {Math.round(materialShortage * 1.2)}%.
                          </div>
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </CardContent>
        
        <CardFooter className="flex justify-between px-6 pb-6">
          {simulationRun ? (
            <>
              <Button variant="outline" onClick={resetSimulation}>
                Modifier les Paramètres
              </Button>
              <Button 
                className="bg-saint-gobain-blue hover:bg-blue-700"
                onClick={handleFinalize}
              >
                Finaliser et Déclarer la Production
              </Button>
            </>
          ) : (
            <div className="text-sm text-gray-500 text-center w-full">
              Configurez les paramètres de simulation puis cliquez sur "Lancer la Simulation" pour voir les résultats
            </div>
          )}
        </CardFooter>
      </Tabs>
    </Card>
  );
}
