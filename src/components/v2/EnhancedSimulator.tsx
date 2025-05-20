
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FlaskConical, Clock, Coins, AlertTriangle, ArrowRight } from "lucide-react";

// Mock data for products
const products = [
  { id: "plaster-a", name: "Plâtre A", baseTime: 4, temp: 180, cost: 12.50 },
  { id: "plaster-b", name: "Plâtre B", baseTime: 5, temp: 190, cost: 14.75 },
  { id: "plaster-c", name: "Plâtre C", baseTime: 3, temp: 175, cost: 11.25 },
  { id: "plaster-d", name: "Plâtre D", baseTime: 6, temp: 200, cost: 15.90 }
];

// Scenario definitions
const scenarios = [
  { 
    id: "economique", 
    name: "Économique", 
    description: "Optimise les coûts de production mais prend plus de temps",
    timeMultiplier: 1.4,
    costMultiplier: 0.85,
    riskRate: 10
  },
  { 
    id: "optimal", 
    name: "Optimal", 
    description: "Équilibre entre temps et coût de production",
    timeMultiplier: 1.0,
    costMultiplier: 1.0,
    riskRate: 15
  },
  { 
    id: "rapide", 
    name: "Rapide", 
    description: "Production accélérée mais à coût plus élevé",
    timeMultiplier: 0.7,
    costMultiplier: 1.3,
    riskRate: 25
  }
];

export default function EnhancedSimulator({ onFinalizeProduction }) {
  // State for simulation parameters
  const [selectedTab, setSelectedTab] = useState("setup");
  const [selectedProducts, setSelectedProducts] = useState([
    { id: "plaster-a", name: "Plâtre A", quantity: 1000, priority: 1 }
  ]);
  
  // State for selected scenarios
  const [selectedScenarios, setSelectedScenarios] = useState(["optimal"]);
  
  // State for simulation results
  const [simulationRun, setSimulationRun] = useState(false);
  const [simulationResults, setSimulationResults] = useState([]);
  
  // Add a product to the simulation
  const addProduct = () => {
    if (selectedProducts.length < 4) {
      // Find the first product not already selected
      const usedIds = selectedProducts.map(p => p.id);
      const availableProduct = products.find(p => !usedIds.includes(p.id));
      
      if (availableProduct) {
        const newProduct = {
          id: availableProduct.id,
          name: availableProduct.name,
          quantity: 500,
          priority: selectedProducts.length + 1
        };
        
        setSelectedProducts([...selectedProducts, newProduct]);
      }
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

  // Update product selection
  const updateProduct = (index, productId) => {
    const selectedProduct = products.find(p => p.id === productId);
    if (selectedProduct) {
      const updatedProducts = [...selectedProducts];
      updatedProducts[index] = {
        ...updatedProducts[index],
        id: selectedProduct.id,
        name: selectedProduct.name
      };
      setSelectedProducts(updatedProducts);
    }
  };
  
  // Toggle scenario selection
  const toggleScenario = (scenarioId) => {
    if (selectedScenarios.includes(scenarioId)) {
      // If already selected, remove it (unless it's the last one)
      if (selectedScenarios.length > 1) {
        setSelectedScenarios(selectedScenarios.filter(id => id !== scenarioId));
      }
    } else {
      // If not selected, add it
      setSelectedScenarios([...selectedScenarios, scenarioId]);
    }
  };
  
  // Run simulation function
  const runSimulation = () => {
    // Generate results for each selected scenario
    const results = selectedScenarios.map(scenarioId => {
      const scenario = scenarios.find(s => s.id === scenarioId);
      
      // Calculate production order and details
      const productionOrder = selectedProducts.map(product => {
        const productInfo = products.find(p => p.id === product.id);
        
        const baseTime = productInfo?.baseTime || 4;
        const baseCost = productInfo?.cost || 10;
        
        const productionTime = Math.round(baseTime * scenario.timeMultiplier * 10) / 10;
        const productionCost = Math.round(baseCost * scenario.costMultiplier * 100) / 100;
        const totalCost = Math.round(productionCost * product.quantity / 100);
        
        // Calculate machine stop impact
        const hasStopRisk = Math.random() < (scenario.riskRate / 100);
        const stopImpact = hasStopRisk ? {
          additionalTime: Math.round(productionTime * 0.3 * 10) / 10, // 30% more time
          additionalCost: Math.round(totalCost * 0.2), // 20% more cost
          reason: ["Panne four", "Pénurie matière", "Maintenance urgente"][Math.floor(Math.random() * 3)]
        } : null;
        
        return {
          ...product,
          productionTime,
          productionCost,
          totalCost,
          stopRisk: scenario.riskRate,
          stopImpact,
          totalTimeWithStop: stopImpact ? productionTime + stopImpact.additionalTime : productionTime,
          totalCostWithStop: stopImpact ? totalCost + stopImpact.additionalCost : totalCost
        };
      });
      
      // Sort by priority
      productionOrder.sort((a, b) => a.priority - b.priority);
      
      // Calculate totals
      const totalTime = productionOrder.reduce((sum, p) => sum + p.totalTimeWithStop, 0);
      const totalCost = productionOrder.reduce((sum, p) => sum + p.totalCostWithStop, 0);
      const hasAnyStop = productionOrder.some(p => p.stopImpact !== null);
      
      return {
        scenarioId,
        scenarioName: scenario.name,
        productionOrder,
        totalTime,
        totalCost,
        hasAnyStop,
        stopRiskRate: scenario.riskRate
      };
    });
    
    setSimulationResults(results);
    setSimulationRun(true);
    setSelectedTab("results");
  };
  
  // Reset simulation
  const resetSimulation = () => {
    setSimulationRun(false);
    setSimulationResults([]);
    setSelectedTab("setup");
  };

  // Handle finalize production
  const handleFinalize = () => {
    if (onFinalizeProduction && typeof onFinalizeProduction === 'function') {
      onFinalizeProduction();
    }
  };
  
  return (
    <Card className="w-full bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <CardTitle className="flex items-center text-indigo-900">
          <FlaskConical className="h-5 w-5 mr-2 text-indigo-600" />
          Simulateur de Production Avancé
        </CardTitle>
        <CardDescription className="text-indigo-700">
          Testez différentes configurations pour optimiser votre production
        </CardDescription>
      </CardHeader>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <div className="px-6 pt-4">
          <TabsList className="grid w-full grid-cols-2 bg-blue-50 p-1 rounded-xl">
            <TabsTrigger 
              value="setup" 
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm"
            >
              Configuration
            </TabsTrigger>
            <TabsTrigger 
              value="results" 
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm"
              disabled={!simulationRun}
            >
              Résultats
            </TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="p-6">
          {/* Setup Tab */}
          <TabsContent value="setup" className="space-y-6 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Products Selection */}
              <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100 space-y-5">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-indigo-900">Produits à Simuler</h3>
                  
                  {selectedProducts.map((product, index) => (
                    <div key={index} className="flex space-x-2 items-end bg-gray-50 p-3 rounded-lg">
                      <div className="flex-1 space-y-2">
                        <Label className="text-gray-700">Produit {index + 1}</Label>
                        <Select 
                          value={product.id} 
                          onValueChange={(value) => updateProduct(index, value)}
                        >
                          <SelectTrigger className="bg-white border-gray-200">
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
                        <Label className="text-gray-700">Quantité (kg)</Label>
                        <Input 
                          type="number" 
                          value={product.quantity} 
                          onChange={(e) => updateQuantity(index, e.target.value)}
                          min={100}
                          step={100}
                          className="bg-white border-gray-200"
                        />
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="mb-0.5 border-gray-300 text-gray-700 hover:bg-gray-100"
                        onClick={() => removeProduct(index)}
                        disabled={selectedProducts.length === 1}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-3 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                    onClick={addProduct}
                    disabled={selectedProducts.length >= 4}
                  >
                    + Ajouter un Produit
                  </Button>
                </div>
              </div>
              
              {/* Scenario Selection */}
              <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100 space-y-5">
                <h3 className="text-lg font-medium text-indigo-900">Choix des Scénarios</h3>
                <p className="text-sm text-gray-600">Sélectionnez un ou plusieurs scénarios pour comparer leurs effets sur la production</p>
                
                <div className="space-y-4 mt-4">
                  {scenarios.map((scenario) => (
                    <div 
                      key={scenario.id} 
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        selectedScenarios.includes(scenario.id) 
                          ? 'bg-indigo-50 border border-indigo-200' 
                          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                      }`}
                      onClick={() => toggleScenario(scenario.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex h-6 items-center">
                          <RadioGroup value={selectedScenarios.includes(scenario.id) ? "checked" : ""}>
                            <RadioGroupItem value="checked" id={`scenario-${scenario.id}`} />
                          </RadioGroup>
                        </div>
                        <div className="space-y-1.5">
                          <label 
                            htmlFor={`scenario-${scenario.id}`}
                            className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {scenario.name}
                          </label>
                          <p className="text-sm text-gray-500">
                            {scenario.description}
                          </p>
                          <div className="flex space-x-3 text-xs text-gray-600 mt-2">
                            <span className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1 text-blue-600" />
                              {scenario.timeMultiplier < 1 ? "Plus rapide" : "Plus lent"}
                            </span>
                            <span className="flex items-center">
                              <Coins className="h-3.5 w-3.5 mr-1 text-amber-600" />
                              {scenario.costMultiplier < 1 ? "Moins coûteux" : "Plus coûteux"}
                            </span>
                            <span className="flex items-center">
                              <AlertTriangle className="h-3.5 w-3.5 mr-1 text-red-600" />
                              Risque d'arrêt: {scenario.riskRate}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4">
                  <Button 
                    className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md"
                    onClick={runSimulation}
                  >
                    Lancer la Simulation
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6 mt-2">
            {simulationRun && (
              <>
                <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-sm">
                  <AlertDescription>
                    <div className="font-medium text-green-800">Simulation terminée avec succès</div>
                    <div className="text-sm text-green-700">
                      {selectedProducts.length} produits, {selectedProducts.reduce((sum, p) => sum + p.quantity, 0)} kg au total
                    </div>
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {/* Production Order */}
                  <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100 space-y-5">
                    <h3 className="text-lg font-medium text-indigo-900">Ordre de Production</h3>
                    
                    {/* Scenario tabs if multiple scenarios selected */}
                    {simulationResults.length > 1 && (
                      <Tabs defaultValue={simulationResults[0].scenarioId} className="w-full">
                        <TabsList className="w-full bg-gray-100 p-1 rounded-lg">
                          {simulationResults.map((result) => (
                            <TabsTrigger 
                              key={result.scenarioId} 
                              value={result.scenarioId}
                              className="flex-1 data-[state=active]:bg-white rounded-md"
                            >
                              {result.scenarioName}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        
                        {simulationResults.map((result) => (
                          <TabsContent key={result.scenarioId} value={result.scenarioId} className="mt-4 space-y-4">
                            {result.productionOrder.map((product, index) => (
                              <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center space-x-2">
                                    <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
                                      {index + 1}
                                    </Badge>
                                    <span className="font-medium">{product.name}</span>
                                  </div>
                                  <span className="text-gray-600">{product.quantity} kg</span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 mt-3">
                                  <div>
                                    <div className="text-sm text-gray-500">Temps de production</div>
                                    <div className="font-medium flex items-center">
                                      <Clock className="h-4 w-4 mr-1 text-blue-600" />
                                      {product.productionTime}h
                                      {product.stopImpact && (
                                        <span className="ml-1 text-red-600">
                                          + {product.stopImpact.additionalTime}h
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-gray-500">Coût unitaire</div>
                                    <div className="font-medium flex items-center">
                                      <Coins className="h-4 w-4 mr-1 text-amber-600" />
                                      {product.productionCost}€ /100kg
                                    </div>
                                  </div>
                                </div>
                                
                                {product.stopImpact && (
                                  <Alert className="mt-3 bg-red-50 border-red-200 py-2 px-3">
                                    <AlertTriangle className="h-4 w-4 text-red-600" />
                                    <AlertDescription className="text-sm text-red-700 ml-2">
                                      Risque d'arrêt machine: {product.stopImpact.reason}
                                    </AlertDescription>
                                  </Alert>
                                )}
                              </div>
                            ))}
                            
                            <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-lg border border-indigo-200 mt-4">
                              <div>
                                <div className="text-indigo-900 font-medium">Total</div>
                                <div className="text-sm text-indigo-700">
                                  Risque d'arrêt machine: {result.stopRiskRate}%
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium flex items-center justify-end">
                                  <Clock className="h-4 w-4 mr-1 text-blue-600" />
                                  {result.totalTime}h
                                </div>
                                <div className="font-medium flex items-center justify-end">
                                  <Coins className="h-4 w-4 mr-1 text-amber-600" />
                                  {result.totalCost}€
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>
                    )}
                    
                    {/* Direct display if only one scenario selected */}
                    {simulationResults.length === 1 && (
                      <div className="space-y-4">
                        {simulationResults[0].productionOrder.map((product, index) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-2">
                                <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
                                  {index + 1}
                                </Badge>
                                <span className="font-medium">{product.name}</span>
                              </div>
                              <span className="text-gray-600">{product.quantity} kg</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mt-3">
                              <div>
                                <div className="text-sm text-gray-500">Temps de production</div>
                                <div className="font-medium flex items-center">
                                  <Clock className="h-4 w-4 mr-1 text-blue-600" />
                                  {product.productionTime}h
                                  {product.stopImpact && (
                                    <span className="ml-1 text-red-600">
                                      + {product.stopImpact.additionalTime}h
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">Coût unitaire</div>
                                <div className="font-medium flex items-center">
                                  <Coins className="h-4 w-4 mr-1 text-amber-600" />
                                  {product.productionCost}€ /100kg
                                </div>
                              </div>
                            </div>
                            
                            {product.stopImpact && (
                              <Alert className="mt-3 bg-red-50 border-red-200 py-2 px-3">
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                                <AlertDescription className="text-sm text-red-700 ml-2">
                                  Risque d'arrêt machine: {product.stopImpact.reason}
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                        ))}
                        
                        <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-lg border border-indigo-200 mt-4">
                          <div>
                            <div className="text-indigo-900 font-medium">Total</div>
                            <div className="text-sm text-indigo-700">
                              Risque d'arrêt machine: {simulationResults[0].stopRiskRate}%
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium flex items-center justify-end">
                              <Clock className="h-4 w-4 mr-1 text-blue-600" />
                              {simulationResults[0].totalTime}h
                            </div>
                            <div className="font-medium flex items-center justify-end">
                              <Coins className="h-4 w-4 mr-1 text-amber-600" />
                              {simulationResults[0].totalCost}€
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Scenario Comparison */}
                  {simulationResults.length > 1 && (
                    <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100 space-y-5">
                      <h3 className="text-lg font-medium text-indigo-900">Comparaison des Scénarios</h3>
                      
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <h4 className="font-medium mb-3">Temps de production</h4>
                          {simulationResults.map((result, index) => (
                            <div key={index} className="mb-2 last:mb-0">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm">{result.scenarioName}</span>
                                <span className="font-medium">{result.totalTime}h</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-blue-600 h-2.5 rounded-full" 
                                  style={{ 
                                    width: `${(result.totalTime / Math.max(...simulationResults.map(r => r.totalTime))) * 100}%` 
                                  }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <h4 className="font-medium mb-3">Coût total</h4>
                          {simulationResults.map((result, index) => (
                            <div key={index} className="mb-2 last:mb-0">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm">{result.scenarioName}</span>
                                <span className="font-medium">{result.totalCost}€</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-amber-500 h-2.5 rounded-full" 
                                  style={{ 
                                    width: `${(result.totalCost / Math.max(...simulationResults.map(r => r.totalCost))) * 100}%` 
                                  }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <h4 className="font-medium mb-3">Risque d'arrêt machine</h4>
                          {simulationResults.map((result, index) => (
                            <div key={index} className="mb-2 last:mb-0">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm">{result.scenarioName}</span>
                                <span className="font-medium">{result.stopRiskRate}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-red-500 h-2.5 rounded-full" 
                                  style={{ 
                                    width: `${(result.stopRiskRate / Math.max(...simulationResults.map(r => r.stopRiskRate))) * 100}%` 
                                  }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <Alert className="bg-blue-50 border-blue-200">
                          <AlertDescription className="text-blue-800">
                            <span className="font-medium">Conseil de production</span>
                            <p className="text-sm mt-1">
                              {simulationResults.length > 1 ? (
                                <>
                                  Le scénario {simulationResults.sort((a, b) => a.totalCost - b.totalCost)[0].scenarioName} 
                                  offre le meilleur rapport coût/production, mais le scénario 
                                  {simulationResults.sort((a, b) => a.totalTime - b.totalTime)[0].scenarioName} 
                                  est le plus rapide.
                                </>
                              ) : (
                                `Le scénario ${simulationResults[0].scenarioName} a été simulé.`
                              )}
                            </p>
                          </AlertDescription>
                        </Alert>
                      </div>
                    </div>
                  )}
                  
                  {/* Details of Products */}
                  <div className={`rounded-xl bg-white p-5 shadow-sm border border-gray-100 space-y-5 ${simulationResults.length > 1 ? "xl:col-span-2" : ""}`}>
                    <h3 className="text-lg font-medium text-indigo-900">Détails des Produits</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedProducts.map((product, index) => {
                        const productInfo = products.find(p => p.id === product.id);
                        
                        return (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center">
                              <div className="font-medium text-gray-900">{product.name}</div>
                              <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                                {product.quantity} kg
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
                              <div className="text-sm">
                                <span className="text-gray-500">Température:</span>{" "}
                                <span className="text-gray-700">{productInfo?.temp || "-"}°C</span>
                              </div>
                              <div className="text-sm">
                                <span className="text-gray-500">Coût de base:</span>{" "}
                                <span className="text-gray-700">{productInfo?.cost || "-"}€ /100kg</span>
                              </div>
                              <div className="text-sm">
                                <span className="text-gray-500">Temps de base:</span>{" "}
                                <span className="text-gray-700">{productInfo?.baseTime || "-"}h</span>
                              </div>
                              <div className="text-sm">
                                <span className="text-gray-500">Priorité:</span>{" "}
                                <span className="text-gray-700">{product.priority}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
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
              <Button 
                variant="outline" 
                className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                onClick={resetSimulation}
              >
                Modifier les Paramètres
              </Button>
              <Button 
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md"
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
