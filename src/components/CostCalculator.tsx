
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { scenarios, products, costBreakdowns } from "@/data/mockData";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

export default function CostCalculator() {
  const [selectedScenario1, setSelectedScenario1] = useState(scenarios[0].id);
  const [selectedScenario2, setSelectedScenario2] = useState(scenarios[1].id);
  const [selectedProduct, setSelectedProduct] = useState(products[0].id);
  
  const getScenario = (id: string) => scenarios.find(s => s.id === id);
  const getProduct = (id: string) => products.find(p => p.id === id);
  const getCostBreakdown = (id: string) => costBreakdowns.find(c => c.scenarioId === id);
  
  const scenario1 = getScenario(selectedScenario1);
  const scenario2 = getScenario(selectedScenario2);
  const product = getProduct(selectedProduct);
  
  const costBreakdown1 = getCostBreakdown(selectedScenario1);
  const costBreakdown2 = getCostBreakdown(selectedScenario2);
  
  // Cost breakdown for pie charts
  const getPieData = (breakdown: typeof costBreakdown1) => {
    if (!breakdown) return [];
    return [
      { name: "Machine", value: breakdown.machineCost },
      { name: "Matière", value: breakdown.materialCost },
      { name: "Main d'œuvre", value: breakdown.laborCost },
      { name: "Frais généraux", value: breakdown.overheadCost },
    ];
  };
  
  // Cost comparison for bar chart
  const getComparisonData = () => {
    if (!scenario1 || !scenario2 || !product) return [];
    
    return [
      {
        name: scenario1.name.split(" - ")[0],
        cost: scenario1.costPerUnit[product.id] || 0,
      },
      {
        name: scenario2.name.split(" - ")[0],
        cost: scenario2.costPerUnit[product.id] || 0,
      },
    ];
  };
  
  // Colors for pie chart
  const COLORS = ["#1A73E8", "#F44336", "#4CAF50", "#FFA000"];

  return (
    <section id="costs" className="space-y-6 mt-12 pt-6 border-t">
      <h2 className="text-2xl font-bold">Calcul des Coûts de Production</h2>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Comparaison des Coûts par Scénario</CardTitle>
              <CardDescription>
                Analyse comparative des coûts de production entre différents scénarios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Label>Scénario 1</Label>
                  <Select 
                    value={selectedScenario1} 
                    onValueChange={(value) => setSelectedScenario1(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un scénario" />
                    </SelectTrigger>
                    <SelectContent>
                      {scenarios.map(scenario => (
                        <SelectItem key={scenario.id} value={scenario.id}>
                          {scenario.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  <Label>Scénario 2</Label>
                  <Select 
                    value={selectedScenario2} 
                    onValueChange={(value) => setSelectedScenario2(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un scénario" />
                    </SelectTrigger>
                    <SelectContent>
                      {scenarios.map(scenario => (
                        <SelectItem key={scenario.id} value={scenario.id}>
                          {scenario.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <Label>Produit</Label>
                <RadioGroup 
                  className="flex space-x-4 flex-wrap"
                  value={selectedProduct}
                  onValueChange={setSelectedProduct}
                >
                  {products.map(product => (
                    <div key={product.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={product.id} id={product.id} />
                      <Label htmlFor={product.id}>{product.name}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div className="h-80 pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={getComparisonData()} 
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Coût (€ par unité)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`${value} €`, "Coût par unité"]} />
                    <Legend />
                    <Bar 
                      dataKey="cost" 
                      name="Coût par unité"
                      fill="#1A73E8"
                      label={{ 
                        position: 'top', 
                        formatter: (val: number) => `${val.toFixed(2)} €` 
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                {scenario1 && scenario2 && product && (
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Analyse de Coût</h4>
                      <p className="text-sm text-gray-600">
                        Comparaison pour {product.name}
                      </p>
                    </div>
                    <div>
                      {scenario1.costPerUnit[product.id] < scenario2.costPerUnit[product.id] ? (
                        <div className="text-green-600 font-medium">
                          Économie de {(scenario2.costPerUnit[product.id] - scenario1.costPerUnit[product.id]).toFixed(2)} € par unité avec {scenario1.name.split(" - ")[0]}
                        </div>
                      ) : (
                        <div className="text-green-600 font-medium">
                          Économie de {(scenario1.costPerUnit[product.id] - scenario2.costPerUnit[product.id]).toFixed(2)} € par unité avec {scenario2.name.split(" - ")[0]}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Répartition des Coûts</CardTitle>
              <CardDescription>
                Détail des composantes de coût par scénario
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="scenario1">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="scenario1">
                    {scenario1?.name.split(" - ")[0] || "Scénario 1"}
                  </TabsTrigger>
                  <TabsTrigger value="scenario2">
                    {scenario2?.name.split(" - ")[0] || "Scénario 2"}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="scenario1" className="mt-4">
                  <div className="h-64">
                    {costBreakdown1 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getPieData(costBreakdown1)}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {getPieData(costBreakdown1).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} €`, "Coût"]} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">Pas de données disponibles</p>
                      </div>
                    )}
                  </div>
                  
                  {costBreakdown1 && (
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Coût Total par Unité:</span>
                        <span className="font-bold">
                          {product && scenario1 ? 
                            `${scenario1.costPerUnit[product.id].toFixed(2)} €` : 
                            "N/A"}
                        </span>
                      </div>
                      <Separator />
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Machine:</span>
                          <span>{costBreakdown1.machineCost.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Matière première:</span>
                          <span>{costBreakdown1.materialCost.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Main d'œuvre:</span>
                          <span>{costBreakdown1.laborCost.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Frais généraux:</span>
                          <span>{costBreakdown1.overheadCost.toFixed(2)} €</span>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="scenario2" className="mt-4">
                  <div className="h-64">
                    {costBreakdown2 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getPieData(costBreakdown2)}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {getPieData(costBreakdown2).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} €`, "Coût"]} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">Pas de données disponibles</p>
                      </div>
                    )}
                  </div>
                  
                  {costBreakdown2 && (
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Coût Total par Unité:</span>
                        <span className="font-bold">
                          {product && scenario2 ? 
                            `${scenario2.costPerUnit[product.id].toFixed(2)} €` : 
                            "N/A"}
                        </span>
                      </div>
                      <Separator />
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Machine:</span>
                          <span>{costBreakdown2.machineCost.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Matière première:</span>
                          <span>{costBreakdown2.materialCost.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Main d'œuvre:</span>
                          <span>{costBreakdown2.laborCost.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Frais généraux:</span>
                          <span>{costBreakdown2.overheadCost.toFixed(2)} €</span>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
