
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { products, orders } from "@/data/mockData";
import { AreaChart, Area, LineChart, Line } from "recharts";

export default function ProductionOverview() {
  // Transform product data for chart display
  const productChartData = products.map(product => ({
    name: product.name,
    "Stock Actuel": product.currentStock,
    "Quantité Commandée": product.orderedQuantity,
    "Niveau Minimum": product.minStockLevel,
  }));

  // Find products that need attention (stock below orders)
  const needsAttention = products.filter(p => p.currentStock < p.orderedQuantity);
  
  // Generate order impact data
  const ordersByProduct = orders.reduce((acc, order) => {
    const product = products.find(p => p.id === order.productId);
    if (!product) return acc;
    
    if (!acc[product.name]) {
      acc[product.name] = {
        name: product.name,
        pending: 0,
        inProduction: 0,
        completed: 0
      };
    }
    
    if (order.status === "Pending") acc[product.name].pending += order.quantity;
    else if (order.status === "In Production") acc[product.name].inProduction += order.quantity;
    else if (order.status === "Completed") acc[product.name].completed += order.quantity;
    
    return acc;
  }, {} as Record<string, { name: string; pending: number; inProduction: number; completed: number; }>);
  
  const orderImpactData = Object.values(ordersByProduct);

  // Generate trend data (mock)
  const trendData = [
    { name: "Semaine 1", production: 1250, commandes: 1100 },
    { name: "Semaine 2", production: 1320, commandes: 1200 },
    { name: "Semaine 3", production: 1400, commandes: 1500 },
    { name: "Semaine 4", production: 1280, commandes: 1380 },
    { name: "Cette Semaine", production: 1220, commandes: 1420 },
    { name: "Prochaine Semaine", production: 1150, commandes: 1500 },
  ];

  return (
    <section id="overview" className="space-y-6">
      <h2 className="text-2xl font-bold">Vue d'ensemble de la Production</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Quantité à Produire vs Stock Disponible</CardTitle>
            <CardDescription>
              Comparaison entre les stocks actuels et les quantités commandées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [`${value} unités`, name]}
                    labelFormatter={label => `Produit: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="Stock Actuel" fill="#1A73E8" />
                  <Bar dataKey="Quantité Commandée" fill="#FFA000">
                    {productChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry["Stock Actuel"] < entry["Quantité Commandée"] ? "#F44336" : "#FFA000"} 
                      />
                    ))}
                  </Bar>
                  <Bar dataKey="Niveau Minimum" fill="#78909C" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertes de Stock</CardTitle>
            <CardDescription>
              Produits nécessitant une attention immédiate
            </CardDescription>
          </CardHeader>
          <CardContent>
            {needsAttention.length > 0 ? (
              <div className="space-y-4">
                {needsAttention.map(product => (
                  <div key={product.id} className="bg-orange-50 border border-orange-200 p-4 rounded-md">
                    <h4 className="font-semibold text-orange-800">{product.name}</h4>
                    <div className="mt-2 text-sm">
                      <div className="flex justify-between">
                        <span>Stock Actuel:</span>
                        <span className="font-medium">{product.currentStock} unités</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Commandé:</span>
                        <span className="font-medium">{product.orderedQuantity} unités</span>
                      </div>
                      <div className="flex justify-between text-red-600 font-medium">
                        <span>Déficit:</span>
                        <span>{product.orderedQuantity - product.currentStock} unités</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 p-4 rounded-md">
                <p className="text-green-800">Tous les produits ont un stock suffisant pour les commandes actuelles.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Impact des Commandes sur la Production</CardTitle>
            <CardDescription>
              Répartition des commandes par statut et produit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orderImpactData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="pending" name="En Attente" stackId="a" fill="#FFA000" />
                  <Bar dataKey="inProduction" name="En Production" stackId="a" fill="#1A73E8" />
                  <Bar dataKey="completed" name="Terminé" stackId="a" fill="#4CAF50" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendance de Production vs Commandes</CardTitle>
            <CardDescription>
              Évolution hebdomadaire et prévisions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="production" 
                    name="Production" 
                    stroke="#1A73E8" 
                    fill="#1A73E8" 
                    fillOpacity={0.3} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="commandes" 
                    name="Commandes" 
                    stroke="#F44336" 
                    fill="#F44336" 
                    fillOpacity={0.3} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
