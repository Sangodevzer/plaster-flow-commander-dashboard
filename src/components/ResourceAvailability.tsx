
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { resources } from "@/data/mockData";
import { AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function ResourceAvailability() {
  // Calculate percentage of resource availability compared to threshold
  const getResourcePercentage = (resource: typeof resources[0]) => {
    return (resource.available / resource.threshold) * 100;
  };
  
  // Get appropriate color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Critical":
        return "text-factory-red";
      case "Warning":
        return "text-factory-amber";
      default:
        return "text-factory-green";
    }
  };
  
  // Get appropriate icon based on status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Critical":
        return <AlertCircle className="h-4 w-4 text-factory-red" />;
      case "Warning":
        return <AlertTriangle className="h-4 w-4 text-factory-amber" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-factory-green" />;
    }
  };
  
  // Group resources by type
  const resourcesByType = resources.reduce((acc, resource) => {
    if (!acc[resource.type]) {
      acc[resource.type] = [];
    }
    acc[resource.type].push(resource);
    return acc;
  }, {} as Record<string, typeof resources>);
  
  // Translate resource type to French
  const translateType = (type: string) => {
    switch (type) {
      case "RawMaterial":
        return "Matière Première";
      case "Machine":
        return "Machine";
      case "Personnel":
        return "Personnel";
      default:
        return type;
    }
  };

  return (
    <section id="resources" className="space-y-6 mt-12 pt-6 border-t">
      <h2 className="text-2xl font-bold">Disponibilité des Ressources</h2>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contraintes et Disponibilité des Ressources</CardTitle>
            <CardDescription>
              État actuel des ressources disponibles pour la production
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {Object.entries(resourcesByType).map(([type, resources]) => (
              <div key={type} className="space-y-4">
                <h3 className="text-lg font-semibold">{translateType(type)}</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ressource</TableHead>
                      <TableHead>Disponible</TableHead>
                      <TableHead>Seuil Critique</TableHead>
                      <TableHead className="text-center">Statut</TableHead>
                      <TableHead className="text-right">Niveau</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resources.map(resource => {
                      const percentage = getResourcePercentage(resource);
                      
                      return (
                        <TableRow key={resource.id}>
                          <TableCell className="font-medium">{resource.name}</TableCell>
                          <TableCell>
                            {resource.available} {resource.unit}
                          </TableCell>
                          <TableCell>
                            {resource.threshold} {resource.unit}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              className={
                                resource.status === "Critical" ? "bg-factory-red" :
                                resource.status === "Warning" ? "bg-factory-amber" :
                                "bg-factory-green"
                              }
                            >
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(resource.status)}
                                <span>{resource.status}</span>
                              </div>
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <span className={`text-sm font-medium ${getStatusColor(resource.status)}`}>
                                {Math.min(percentage, 200).toFixed(0)}%
                              </span>
                              <Progress 
                                value={Math.min(percentage, 100)} 
                                className="w-24 h-2"
                                indicatorClassName={
                                  resource.status === "Critical" ? "bg-factory-red" :
                                  resource.status === "Warning" ? "bg-factory-amber" :
                                  "bg-factory-green"
                                }
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(resourcesByType).map(([type, typeResources]) => {
            // Count resources by status
            const statusCounts = typeResources.reduce((acc, resource) => {
              acc[resource.status] = (acc[resource.status] || 0) + 1;
              return acc;
            }, {} as Record<string, number>);
            
            // Determine overall status
            const hasCritical = statusCounts["Critical"] > 0;
            const hasWarning = statusCounts["Warning"] > 0;
            
            const bgColor = hasCritical ? "bg-red-50 border-red-200" : 
                           hasWarning ? "bg-amber-50 border-amber-200" : 
                           "bg-green-50 border-green-200";
            
            const statusIcon = hasCritical ? <AlertCircle className="h-5 w-5 text-factory-red" /> :
                              hasWarning ? <AlertTriangle className="h-5 w-5 text-factory-amber" /> :
                              <CheckCircle2 className="h-5 w-5 text-factory-green" />;
            
            const statusColor = hasCritical ? "text-factory-red" :
                               hasWarning ? "text-factory-amber" :
                               "text-factory-green";
            
            const statusText = hasCritical ? "Attention Requise" :
                              hasWarning ? "À Surveiller" :
                              "Disponibilité Normale";
            
            return (
              <Card key={type} className={`border ${bgColor}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between">
                    {translateType(type)}
                    {statusIcon}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Statut:</span>
                    <span className={`font-bold ${statusColor}`}>{statusText}</span>
                  </div>
                  
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Ressources Critiques:</span>
                      <span className="font-medium">{statusCounts["Critical"] || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ressources en Alerte:</span>
                      <span className="font-medium">{statusCounts["Warning"] || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ressources Normales:</span>
                      <span className="font-medium">{statusCounts["Normal"] || 0}</span>
                    </div>
                  </div>
                  
                  {hasCritical && (
                    <div className="pt-2 text-sm text-factory-red font-medium">
                      Action requise immédiatement!
                    </div>
                  )}
                  
                  {!hasCritical && hasWarning && (
                    <div className="pt-2 text-sm text-factory-amber font-medium">
                      Surveillance recommandée
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
