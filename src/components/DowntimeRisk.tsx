
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { machineRisks } from "@/data/mockData";
import { CircleAlert, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export default function DowntimeRisk() {
  const getRiskColor = (risk: number) => {
    if (risk > 25) return "text-factory-red";
    if (risk > 15) return "text-factory-amber";
    return "text-factory-green";
  };

  const getRiskBg = (risk: number) => {
    if (risk > 25) return "bg-red-50";
    if (risk > 15) return "bg-amber-50";
    return "bg-green-50";
  };

  const getMaintenanceStatus = (dueDate: string | null) => {
    if (!dueDate) return { text: "Aucune Prévue", color: "bg-green-100 text-green-800" };
    
    const due = new Date(dueDate);
    const today = new Date();
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return { text: "En Retard", color: "bg-factory-red text-white" };
    if (diffDays <= 7) return { text: `Dans ${diffDays} jours`, color: "bg-factory-amber text-white" };
    return { text: `Dans ${diffDays} jours`, color: "bg-blue-100 text-blue-800" };
  };

  return (
    <section id="risks" className="space-y-6 mt-12 pt-6 border-t">
      <h2 className="text-2xl font-bold">Évaluation des Risques d'Arrêt</h2>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tableau des Risques de Panne Machine</CardTitle>
            <CardDescription>
              Analyse des risques d'arrêt basée sur les données historiques et la charge actuelle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Machine</TableHead>
                  <TableHead className="text-center">Risque d'Arrêt</TableHead>
                  <TableHead className="text-center">Heures Avant Panne</TableHead>
                  <TableHead className="text-center">Maintenance Prévue</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {machineRisks.map((machine) => {
                  const maintenanceStatus = getMaintenanceStatus(machine.maintenanceDue);
                  
                  return (
                    <TableRow key={machine.machineId} className={getRiskBg(machine.downtimeRisk)}>
                      <TableCell className="font-medium">{machine.machineName}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center">
                          <div className={`text-lg font-bold ${getRiskColor(machine.downtimeRisk)}`}>
                            {machine.downtimeRisk}%
                          </div>
                          <Progress 
                            value={machine.downtimeRisk} 
                            className="h-2 w-20"
                            indicatorClassName={
                              machine.downtimeRisk > 25 ? "bg-factory-red" : 
                              machine.downtimeRisk > 15 ? "bg-factory-amber" : 
                              "bg-factory-green"
                            }
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                          <Clock className="h-4 w-4 mr-1 text-factory-blue" />
                          <span className="font-medium">
                            {machine.hoursBeforeFailure}h
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={maintenanceStatus.color}>
                          {maintenanceStatus.text}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          Détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Évolution du Temps Avant Panne</CardTitle>
              <CardDescription>
                Tendance historique pour chaque machine
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      allowDuplicatedCategory={false}
                      type="category"
                    />
                    <YAxis label={{ value: 'Heures', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    {machineRisks.map((machine, index) => (
                      <Line
                        key={machine.machineId}
                        data={machine.historyData}
                        type="monotone"
                        dataKey="hours"
                        name={machine.machineName}
                        stroke={
                          index === 0 ? "#1A73E8" : 
                          index === 1 ? "#F44336" : 
                          "#4CAF50"
                        }
                        activeDot={{ r: 8 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="text-sm text-gray-500">
              Les tendances à la baisse indiquent une détérioration progressive.
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Résumé des Risques</CardTitle>
              <CardDescription>
                Points d'attention pour la planification de la production
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {machineRisks.map(machine => {
                // Determine risk level indicators
                let icon = <CheckCircle2 className="h-5 w-5 text-factory-green" />;
                let riskClass = "bg-green-50 border-green-200";
                
                if (machine.downtimeRisk > 25) {
                  icon = <CircleAlert className="h-5 w-5 text-factory-red" />;
                  riskClass = "bg-red-50 border-red-200";
                } else if (machine.downtimeRisk > 15) {
                  icon = <AlertTriangle className="h-5 w-5 text-factory-amber" />;
                  riskClass = "bg-amber-50 border-amber-200";
                }
                
                const urgentMaintenance = machine.maintenanceDue && 
                  new Date(machine.maintenanceDue) <= new Date();
                
                return (
                  <div 
                    key={machine.machineId} 
                    className={`p-4 border rounded-md ${riskClass}`}
                  >
                    <div className="flex items-start">
                      {icon}
                      <div className="ml-3">
                        <h4 className="font-semibold">{machine.machineName}</h4>
                        <div className="mt-2 text-sm space-y-1">
                          <p>
                            {machine.downtimeRisk > 20
                              ? "Risque élevé de panne, prévoir une intervention."
                              : machine.downtimeRisk > 10
                              ? "Risque modéré, surveillance recommandée."
                              : "Faible risque, fonctionnement normal."
                            }
                          </p>
                          
                          {urgentMaintenance && (
                            <p className="text-factory-red font-medium">
                              Maintenance urgente requise !
                            </p>
                          )}
                          
                          <p>
                            Disponibilité estimée: <span className="font-medium">{machine.hoursBeforeFailure}h</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-factory-blue hover:bg-factory-darkBlue">
                Planifier la Maintenance
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
