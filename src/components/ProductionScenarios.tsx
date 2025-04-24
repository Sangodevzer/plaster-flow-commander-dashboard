
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { scenarios, resources, products } from "@/data/mockData";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, Clock, AlertTriangle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function ProductionScenarios() {
  const [activeTab, setActiveTab] = useState(scenarios[0].id);
  
  const getResourceName = (resourceId: string) => {
    const resource = resources.find(r => r.id === resourceId);
    return resource ? resource.name : resourceId;
  };
  
  const getProductNames = () => {
    return products.map(p => p.name).join(", ");
  };

  return (
    <section id="scenarios" className="space-y-6 mt-12 pt-6 border-t">
      <h2 className="text-2xl font-bold">Scénarios de Production</h2>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Comparaison des Scénarios de Production</CardTitle>
            <CardDescription>
              Évaluez différentes stratégies de production pour optimiser votre planification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                {scenarios.map(scenario => (
                  <TabsTrigger 
                    key={scenario.id} 
                    value={scenario.id}
                    className="relative"
                  >
                    {scenario.name.split(" - ")[0]}
                    {scenario.recommended && (
                      <Badge className="absolute -top-2 -right-2 bg-factory-green">
                        Recommandé
                      </Badge>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {scenarios.map(scenario => (
                <TabsContent key={scenario.id} value={scenario.id} className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg">{scenario.name}</h3>
                    <p className="text-gray-600">{scenario.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md flex items-center">
                          <Clock className="mr-2 h-5 w-5 text-factory-blue" />
                          Temps de Production
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{scenario.productionTime}h</div>
                        <p className="text-sm text-gray-500">Pour: {getProductNames()}</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md flex items-center">
                          <AlertTriangle className="mr-2 h-5 w-5 text-factory-amber" />
                          Risque d'Arrêt
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-end space-x-2">
                          <div className="text-3xl font-bold">{scenario.machineDowntimeRisk}%</div>
                          <div className="text-sm text-gray-500">de risque</div>
                        </div>
                        <Progress 
                          value={scenario.machineDowntimeRisk} 
                          className="h-2 mt-2"
                          indicatorClassName={
                            scenario.machineDowntimeRisk > 20 ? "bg-factory-red" : 
                            scenario.machineDowntimeRisk > 10 ? "bg-factory-amber" : 
                            "bg-factory-green"
                          }
                        />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md flex items-center">
                          <AlertCircle className="mr-2 h-5 w-5 text-factory-blue" />
                          Temps avant Panne
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{scenario.timeBeforeFailure}h</div>
                        <p className="text-sm text-gray-500">Estimation basée sur l'historique</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Ressources Nécessaires</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {scenario.resourceRequirements.map(req => {
                          const resource = resources.find(r => r.id === req.resourceId);
                          const isAvailable = resource && resource.available >= req.requiredAmount;
                          
                          return (
                            <div key={req.resourceId} className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium">{getResourceName(req.resourceId)}</h4>
                                <p className="text-sm text-gray-500">
                                  Requis: {req.requiredAmount} {resource?.unit || "unités"}
                                </p>
                              </div>
                              <div className="flex items-center">
                                {resource && (
                                  <span className="text-sm mr-2">
                                    Disponible: {resource.available} {resource.unit}
                                  </span>
                                )}
                                {isAvailable ? (
                                  <CheckCircle2 className="h-5 w-5 text-factory-green" />
                                ) : (
                                  <AlertTriangle className="h-5 w-5 text-factory-red" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {scenario.recommended && (
                    <Alert className="bg-green-50 border-factory-green">
                      <CheckCircle2 className="h-4 w-4 text-factory-green" />
                      <AlertTitle>Scénario Recommandé</AlertTitle>
                      <AlertDescription>
                        Basé sur vos contraintes actuelles, ce scénario de production offre le meilleur équilibre entre temps, risque et ressources.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="flex justify-end space-x-4 pt-4">
                    <Button variant="outline">Comparer</Button>
                    <Button className="bg-factory-blue hover:bg-factory-darkBlue">
                      Sélectionner ce Scénario
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
