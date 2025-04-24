
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { scenarios, products } from "@/data/mockData";
import { FlaskConical, Clock, Coins, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Simulator() {
  // State for simulation parameters
  const [selectedProduct, setSelectedProduct] = useState(products[0].id);
  const [quantity, setQuantity] = useState(1000);
  const [absenceFactor, setAbsenceFactor] = useState(10); // percentage
  const [machineFactor, setMachineFactor] = useState(15); // percentage
  const [materialShortage, setMaterialShortage] = useState(5); // percentage
  
  // State for simulation results
  const [simulationRun, setSimulationRun] = useState(false);
  const [simulationResults, setSimulationResults] = useState<any>(null);
  
  const product = products.find(p => p.id === selectedProduct);
  
  // Run simulation function
  const runSimulation = () => {
    // In a real app, this would call an API or run complex calculations
    // For the demo, we'll create mock results based on inputs
    
    // Clone and adjust scenarios based on input parameters
    const simulatedScenarios = scenarios.map(scenario => {
      const adjustedTime = scenario.productionTime * (1 + absenceFactor/100) * (1 + machineFactor/100);
      const adjustedRisk = scenario.machineDowntimeRisk * (1 + machineFactor/100);
      
      const materialMultiplier = 1 + materialShortage/100;
      const baseCost = scenario.costPerUnit[selectedProduct] || 10;
      const adjustedCost = baseCost * materialMultiplier;
      
      return {
        ...scenario,
        adjustedTime,
        adjustedRisk,
        originalCost: baseCost,
        adjustedCost,
        costIncrease: adjustedCost - baseCost,
        totalCost: adjustedCost * quantity,
      };
    });
    
    // Find optimal scenario
    const optimalByTime = [...simulatedScenarios].sort((a, b) => a.adjustedTime - b.adjustedTime)[0];
    const optimalByCost = [...simulatedScenarios].sort((a, b) => a.adjustedCost - b.adjustedCost)[0];
    const optimalByRisk = [...simulatedScenarios].sort((a, b) => a.adjustedRisk - b.adjustedRisk)[0];
    
    const results = {
      scenarios: simulatedScenarios,
      optimalByTime,
      optimalByCost,
      optimalByRisk,
      recommended: optimalByCost, // Default recommendation prioritizes cost
    };
    
    setSimulationResults(results);
    setSimulationRun(true);
  };
  
  const resetSimulation = () => {
    setSimulationRun(false);
    setSimulationResults(null);
  };
  
  // Chart data for comparison
  const getComparisonChartData = () => {
    if (!simulationResults) return [];
    
    return simulationResults.scenarios.map((scenario: any) => ({
      name: scenario.name.split(" - ")[0],
      temps: scenario.adjustedTime,
      coût: scenario.adjustedCost,
      risque: scenario.adjustedRisk,
    }));
  };

  return (
    <section id="simulator" className="space-y-6 mt-12 pt-6 border-t">
      <h2 className="text-2xl font-bold">Simulateur de Scénarios</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FlaskConical className="h-5 w-5 mr-2 text-factory-blue" />
              Simulateur de Production
            </CardTitle>
            <CardDescription>
              Testez différentes hypothèses pour analyser l'impact sur votre production
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Simulation Parameters */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="product">Produit</Label>
                  <Select 
                    value={selectedProduct} 
                    onValueChange={setSelectedProduct}
                    disabled={simulationRun}
                  >
                    <SelectTrigger id="product">
                      <SelectValue placeholder="Sélectionnez un produit" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(product => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantité à produire</Label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      id="quantity" 
                      type="number" 
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      min={100}
                      max={10000}
                      step={100}
                      disabled={simulationRun}
                    />
                    <span className="text-sm text-gray-500">unités</span>
                  </div>
                </div>
                
                <div className="space-y-5">
                  <h3 className="font-semibold">Facteurs de Risque</h3>
                  
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
                      disabled={simulationRun}
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
                      disabled={simulationRun}
                    />
                    <p className="text-xs text-gray-500">
                      Probabilité d'arrêt machine et impact sur le temps de production
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="material-shortage">Pénurie de Matières Premières</Label>
                      <span className="text-sm font-medium">{materialShortage}%</span>
                    </div>
                    <Slider 
                      id="material-shortage"
                      value={[materialShortage]}
                      onValueChange={(value) => setMaterialShortage(value[0])}
                      min={0}
                      max={40}
                      step={1}
                      disabled={simulationRun}
                    />
                    <p className="text-xs text-gray-500">
                      Impact sur les coûts de production
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  {!simulationRun ? (
                    <Button 
                      className="w-full bg-factory-blue hover:bg-factory-darkBlue"
                      onClick={runSimulation}
                    >
                      Lancer la Simulation
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={resetSimulation}
                    >
                      Réinitialiser
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Simulation Results or Explanation */}
              <div>
                {!simulationRun ? (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 h-full flex flex-col justify-center">
                    <h3 className="font-semibold text-lg text-center mb-4">Simulateur de Production</h3>
                    <p className="text-center text-gray-600 mb-4">
                      Ajustez les paramètres pour simuler différents scénarios de production et voir leur impact sur:
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-factory-blue" />
                        <span>Temps de production estimé</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Coins className="h-5 w-5 text-factory-amber" />
                        <span>Coût de production par unité</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-5 w-5 text-factory-red" />
                        <span>Risques d'arrêt et de retard</span>
                      </div>
                    </div>
                    <p className="text-center text-gray-600 mt-4">
                      Le simulateur générera une recommandation basée sur vos contraintes.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <Alert className="bg-green-50 border-green-200">
                      <AlertDescription>
                        <div className="font-medium">Simulation terminée pour {product?.name}</div>
                        <div className="text-sm text-gray-600">
                          Quantité: {quantity} unités
                        </div>
                      </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Recommandation: {simulationResults.recommended.name}</h4>
                      <p className="text-sm text-gray-600">
                        Ce scénario offre le meilleur équilibre entre coût, temps et risque.
                      </p>
                      
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        <div className="bg-blue-50 p-3 rounded text-center">
                          <div className="text-xs text-gray-500">Temps</div>
                          <div className="font-medium">{Math.round(simulationResults.recommended.adjustedTime)}h</div>
                        </div>
                        <div className="bg-amber-50 p-3 rounded text-center">
                          <div className="text-xs text-gray-500">Coût</div>
                          <div className="font-medium">{simulationResults.recommended.adjustedCost.toFixed(2)}€</div>
                        </div>
                        <div className="bg-red-50 p-3 rounded text-center">
                          <div className="text-xs text-gray-500">Risque</div>
                          <div className="font-medium">{Math.round(simulationResults.recommended.adjustedRisk)}%</div>
                        </div>
                      </div>
                    </div>
                    
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
                          <Bar yAxisId="left" dataKey="coût" name="Coût (€)" fill="#FFA000" />
                          <Bar yAxisId="right" dataKey="risque" name="Risque (%)" fill="#F44336" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    {absenceFactor > 15 && (
                      <Alert className="bg-amber-50 border-amber-200">
                        <AlertTriangle className="h-4 w-4 text-factory-amber" />
                        <AlertDescription>
                          Attention: Taux d'absence élevé impactant fortement le temps de production
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {machineFactor > 25 && (
                      <Alert className="bg-red-50 border-red-200">
                        <AlertTriangle className="h-4 w-4 text-factory-red" />
                        <AlertDescription>
                          Alerte: Risque élevé de panne machine, prévoir une maintenance préventive
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="text-sm text-gray-500 flex justify-center">
            Les résultats sont des estimations basées sur les données historiques et les paramètres sélectionnés.
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
