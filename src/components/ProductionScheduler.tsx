
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, Clock, Gauge, Settings } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult 
} from "@hello-pangea/dnd";

// Mock data for plaster products
const plasterProducts = [
  { id: "plaster-a", name: "Plâtre A", available: 1200, ordered: 950, minStock: 500, priority: "Élevée" },
  { id: "plaster-b", name: "Plâtre B", available: 800, ordered: 1200, minStock: 400, priority: "Moyenne" },
  { id: "plaster-c", name: "Plâtre C", available: 1500, ordered: 1000, minStock: 600, priority: "Basse" },
  { id: "plaster-d", name: "Plâtre D", available: 300, ordered: 600, minStock: 300, priority: "Élevée" }
];

// Mock data for kiln status
const kilnStatus = {
  currentTemp: 180,
  targetTemp: 200,
  status: "En fonctionnement",
  nextMaintenance: "2025-05-10",
  plannedDowntime: [
    { start: "2025-04-25 08:00", end: "2025-04-25 12:00", reason: "Maintenance préventive" },
    { start: "2025-04-28 14:00", end: "2025-04-28 16:00", reason: "Nettoyage" }
  ],
  unplannedDowntime: [
    { date: "2025-04-22", duration: "3h", reason: "Panne électrique" }
  ]
};

// Mock data for materials
const materialsData = [
  { id: "gypsum", name: "Gypse", available: 2500, required: 2000, status: "Suffisant" },
  { id: "additives", name: "Additifs", available: 800, required: 750, status: "Suffisant" },
  { id: "retarder", name: "Retardateur", available: 200, required: 250, status: "Faible" },
  { id: "accelerator", name: "Accélérateur", available: 150, required: 180, status: "Critique" }
];

// Mock data for operators
const operatorsData = [
  { id: "op1", name: "Jean Dupont", status: "Présent", role: "Chef d'équipe" },
  { id: "op2", name: "Marie Lambert", status: "Absent", role: "Opérateur", return: "2025-04-26" },
  { id: "op3", name: "Pierre Martin", status: "Présent", role: "Technicien" }
];

// Production Schedule Component
export default function ProductionScheduler() {
  const [activeTab, setActiveTab] = useState("schedule");
  const [scheduledItems, setScheduledItems] = useState([
    { id: "prod-1", product: "Plâtre A", quantity: 500, startTime: "08:00", endTime: "12:00", kiln: "Four 1" },
    { id: "prod-2", product: "Plâtre B", quantity: 300, startTime: "12:30", endTime: "15:00", kiln: "Four 1" },
    { id: "prod-3", product: "Plâtre C", quantity: 600, startTime: "15:30", endTime: "19:00", kiln: "Four 2" }
  ]);
  
  const [simProducts, setSimProducts] = useState([
    { id: "sim-1", product: "Plâtre A", quantity: 500, priority: 1 },
    { id: "sim-2", product: "Plâtre B", quantity: 300, priority: 2 },
    { id: "sim-3", product: "Plâtre C", quantity: 600, priority: 3 }
  ]);

  const [scheduleGenerated, setScheduleGenerated] = useState(false);
  const [declarationSent, setDeclarationSent] = useState(false);

  // Handle drag and drop for production order
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(simProducts);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update priorities based on new order
    const updatedItems = items.map((item, index) => ({
      ...item,
      priority: index + 1
    }));
    
    setSimProducts(updatedItems);
  };

  // Generate production schedule based on simulation
  const generateSchedule = () => {
    // In a real app, this would generate actual schedule based on constraints
    // For demo, we'll just update the status
    setScheduleGenerated(true);
  };

  // Send production declaration
  const sendDeclaration = () => {
    // In a real app, this would send the declaration to backend
    setDeclarationSent(true);
    
    // Reset after 3 seconds for demo purposes
    setTimeout(() => {
      setDeclarationSent(false);
    }, 3000);
  };

  return (
    <section id="production-scheduler" className="space-y-6 mt-12 pt-6 border-t">
      <h2 className="text-2xl font-bold">Planification de Production</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="schedule">Calendrier</TabsTrigger>
          <TabsTrigger value="simulate">Simuler</TabsTrigger>
          <TabsTrigger value="constraints">Contraintes</TabsTrigger>
          <TabsTrigger value="declaration">Déclaration</TabsTrigger>
        </TabsList>
        
        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarDays className="h-5 w-5 mr-2 text-factory-blue" />
                Calendrier de Production
              </CardTitle>
              <CardDescription>
                Vue d'ensemble des productions planifiées pour la journée et la semaine
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Productions du Jour</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produit</TableHead>
                        <TableHead>Quantité (kg)</TableHead>
                        <TableHead>Début</TableHead>
                        <TableHead>Fin</TableHead>
                        <TableHead>Four</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scheduledItems.map(item => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.product}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.startTime}</TableCell>
                          <TableCell>{item.endTime}</TableCell>
                          <TableCell>{item.kiln}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">Modifier</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Aperçu des Stocks et Commandes</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produit</TableHead>
                        <TableHead>Stock Disponible (kg)</TableHead>
                        <TableHead>Commandé (kg)</TableHead>
                        <TableHead>Niveau Min (kg)</TableHead>
                        <TableHead>Priorité</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {plasterProducts.map(product => (
                        <TableRow key={product.id} className={product.available < product.ordered ? "bg-red-50" : ""}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.available}</TableCell>
                          <TableCell>{product.ordered}</TableCell>
                          <TableCell>{product.minStock}</TableCell>
                          <TableCell>
                            <Badge className={
                              product.priority === "Élevée" 
                                ? "bg-factory-red text-white" 
                                : product.priority === "Moyenne"
                                ? "bg-factory-amber text-white"
                                : "bg-factory-green text-white"
                            }>
                              {product.priority}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Semaine Précédente</Button>
              <Button variant="outline">Semaine Suivante</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Simulate Tab */}
        <TabsContent value="simulate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Simulateur de Production</CardTitle>
              <CardDescription>
                Définissez les produits et quantités à produire, puis organisez l'ordre de production
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Produits à Produire</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="product-select">Sélectionner un Produit</Label>
                        <Select defaultValue="plaster-a">
                          <SelectTrigger id="product-select">
                            <SelectValue placeholder="Choisir un produit" />
                          </SelectTrigger>
                          <SelectContent>
                            {plasterProducts.map(product => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantité (kg)</Label>
                        <Input 
                          id="quantity" 
                          type="number" 
                          defaultValue="500"
                          min="100"
                          step="100"
                        />
                      </div>
                      
                      <Button className="bg-factory-blue hover:bg-factory-darkBlue">
                        Ajouter à la Production
                      </Button>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-md">
                      <h4 className="font-medium text-blue-800 mb-2">Informations sur le Produit</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span>Temps de production moyen:</span>
                          <span className="font-medium">4h / 1000kg</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Température requise:</span>
                          <span className="font-medium">180°C</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Matières premières nécessaires:</span>
                          <span className="font-medium">Gypse (80%), Additifs (20%)</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Opérateurs requis:</span>
                          <span className="font-medium">2</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Ordre de Production</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Faites glisser les éléments pour réorganiser l'ordre de production
                  </p>
                  
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="production-order">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-2"
                        >
                          {simProducts.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="bg-white border rounded-md p-4 flex justify-between items-center"
                                >
                                  <div className="flex items-center space-x-4">
                                    <div className="bg-blue-100 text-blue-800 font-medium h-8 w-8 rounded-full flex items-center justify-center">
                                      {item.priority}
                                    </div>
                                    <div>
                                      <div className="font-medium">{item.product}</div>
                                      <div className="text-sm text-muted-foreground">{item.quantity} kg</div>
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="sm">×</Button>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-factory-blue hover:bg-factory-darkBlue"
                onClick={generateSchedule}
              >
                Générer le Calendrier de Production
              </Button>
            </CardFooter>
          </Card>
          
          {scheduleGenerated && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription>
                Calendrier de production généré avec succès. Veuillez consulter l'onglet Calendrier pour voir les détails.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
        
        {/* Constraints Tab */}
        <TabsContent value="constraints" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kiln Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gauge className="h-5 w-5 mr-2 text-factory-blue" />
                  État des Fours
                </CardTitle>
                <CardDescription>
                  Statut actuel et planification des arrêts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-md">
                    <div className="text-sm text-blue-800">Température Actuelle</div>
                    <div className="text-2xl font-bold">{kilnStatus.currentTemp}°C</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-md">
                    <div className="text-sm text-blue-800">Température Cible</div>
                    <div className="text-2xl font-bold">{kilnStatus.targetTemp}°C</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-md">
                    <div className="text-sm text-blue-800">Statut</div>
                    <div className="font-medium">{kilnStatus.status}</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-md">
                    <div className="text-sm text-blue-800">Prochaine Maintenance</div>
                    <div className="font-medium">{new Date(kilnStatus.nextMaintenance).toLocaleDateString('fr-FR')}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Arrêts Planifiés</h4>
                  <div className="space-y-2">
                    {kilnStatus.plannedDowntime.map((downtime, index) => (
                      <div key={index} className="bg-amber-50 p-3 rounded-md">
                        <div className="flex justify-between">
                          <span className="font-medium">{new Date(downtime.start).toLocaleDateString('fr-FR')}</span>
                          <span>{`${downtime.start.split(' ')[1]} - ${downtime.end.split(' ')[1]}`}</span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{downtime.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Arrêts Non Planifiés Récents</h4>
                  <div className="space-y-2">
                    {kilnStatus.unplannedDowntime.map((downtime, index) => (
                      <div key={index} className="bg-red-50 p-3 rounded-md">
                        <div className="flex justify-between">
                          <span className="font-medium">{new Date(downtime.date).toLocaleDateString('fr-FR')}</span>
                          <span>Durée: {downtime.duration}</span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{downtime.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Materials Availability */}
            <Card>
              <CardHeader>
                <CardTitle>Disponibilité des Matières</CardTitle>
                <CardDescription>
                  État des stocks de matières premières
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Matière</TableHead>
                      <TableHead>Disponible (kg)</TableHead>
                      <TableHead>Requis (kg)</TableHead>
                      <TableHead>État</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materialsData.map(material => {
                      const ratio = material.available / material.required;
                      let statusColor = "bg-green-100 text-green-800";
                      if (ratio < 0.9) statusColor = "bg-amber-100 text-amber-800";
                      if (ratio < 0.8) statusColor = "bg-red-100 text-red-800";
                      
                      return (
                        <TableRow key={material.id}>
                          <TableCell className="font-medium">{material.name}</TableCell>
                          <TableCell>{material.available}</TableCell>
                          <TableCell>{material.required}</TableCell>
                          <TableCell>
                            <Badge className={statusColor}>
                              {material.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Personnel Disponible</h4>
                  <div className="space-y-3">
                    {operatorsData.map(operator => (
                      <div 
                        key={operator.id} 
                        className={`flex justify-between items-center p-3 rounded-md ${
                          operator.status === "Présent" ? "bg-green-50" : "bg-red-50"
                        }`}
                      >
                        <div>
                          <div className="font-medium">{operator.name}</div>
                          <div className="text-sm text-gray-600">{operator.role}</div>
                        </div>
                        <div>
                          <Badge className={operator.status === "Présent" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {operator.status}
                          </Badge>
                          {operator.status === "Absent" && operator.return && (
                            <div className="text-xs text-gray-600 mt-1">
                              Retour: {new Date(operator.return).toLocaleDateString('fr-FR')}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Declaration Tab */}
        <TabsContent value="declaration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Déclaration de Production</CardTitle>
              <CardDescription>
                Finalisez et envoyez votre déclaration de production
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
                  <h3 className="text-lg font-medium text-blue-800 mb-2">Résumé de la Production</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Nombre total de produits:</span>
                      <span>3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Quantité totale à produire:</span>
                      <span>1,400 kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Durée estimée:</span>
                      <span>11 heures</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Fours utilisés:</span>
                      <span>2</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Détails de la Production</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produit</TableHead>
                        <TableHead>Quantité (kg)</TableHead>
                        <TableHead>Début</TableHead>
                        <TableHead>Fin</TableHead>
                        <TableHead>Four</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scheduledItems.map(item => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.product}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.startTime}</TableCell>
                          <TableCell>{item.endTime}</TableCell>
                          <TableCell>{item.kiln}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optionnel)</Label>
                  <textarea 
                    id="notes"
                    className="w-full h-24 p-2 border border-gray-300 rounded-md"
                    placeholder="Ajoutez des notes ou commentaires concernant cette production..."
                  ></textarea>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline">Exporter en PDF</Button>
              <Button 
                className="bg-factory-blue hover:bg-factory-darkBlue"
                onClick={sendDeclaration}
              >
                {declarationSent ? "Envoyé !" : "Envoyer la Déclaration"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
