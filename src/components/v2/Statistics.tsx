
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Badge } from "@/components/ui/badge";

// Mock data for statistics
const salesData = [
  { name: "Plâtre A", value: 45 },
  { name: "Plâtre B", value: 25 },
  { name: "Plâtre C", value: 20 },
  { name: "Plâtre D", value: 10 }
];

const productionData = [
  { name: "Jan", "Plâtre A": 400, "Plâtre B": 240, "Plâtre C": 320 },
  { name: "Fév", "Plâtre A": 300, "Plâtre B": 280, "Plâtre C": 350 },
  { name: "Mar", "Plâtre A": 500, "Plâtre B": 300, "Plâtre C": 280 },
  { name: "Avr", "Plâtre A": 450, "Plâtre B": 320, "Plâtre C": 290 },
  { name: "Mai", "Plâtre A": 470, "Plâtre B": 290, "Plâtre C": 310 },
  { name: "Jun", "Plâtre A": 480, "Plâtre B": 310, "Plâtre C": 300 },
];

const marketImpactData = [
  { factor: "Nouveau Contrat", impact: 85, status: "positif" },
  { factor: "Demande Marché", impact: 65, status: "positif" },
  { factor: "Compétition", impact: -40, status: "négatif" },
  { factor: "Prix Matériaux", impact: -25, status: "négatif" },
  { factor: "Inflation", impact: -30, status: "négatif" },
];

const COLORS = ["#8B5CF6", "#D946EF", "#F97316", "#0EA5E9"];

export default function Statistics() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-saint-gobain-blue">Statistiques de Production et Ventes</CardTitle>
          <CardDescription>
            Vue d'ensemble des statistiques clés pour la production et les ventes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Répartition des Ventes par Produit</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={salesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {salesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Production Mensuelle</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={productionData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Plâtre A" stackId="a" fill="#8B5CF6" />
                    <Bar dataKey="Plâtre B" stackId="a" fill="#D946EF" />
                    <Bar dataKey="Plâtre C" stackId="a" fill="#F97316" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Impact sur le Marché</h3>
            <div className="space-y-3">
              {marketImpactData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="font-medium">{item.factor}</div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          item.status === "positif" ? "bg-green-500" : "bg-red-500"
                        }`}
                        style={{ width: `${Math.abs(item.impact)}%` }}
                      ></div>
                    </div>
                    <Badge 
                      className={item.status === "positif" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {item.impact > 0 ? `+${item.impact}%` : `${item.impact}%`}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-blue-50">
              <CardContent className="pt-6">
                <div className="text-sm text-blue-800">Total Produit</div>
                <div className="text-2xl font-bold">7,250 kg</div>
                <div className="text-xs text-blue-600 mt-1">+8.2% par rapport au mois dernier</div>
              </CardContent>
            </Card>
            <Card className="bg-purple-50">
              <CardContent className="pt-6">
                <div className="text-sm text-purple-800">Efficacité de Production</div>
                <div className="text-2xl font-bold">92.5%</div>
                <div className="text-xs text-purple-600 mt-1">+3.1% par rapport au mois dernier</div>
              </CardContent>
            </Card>
            <Card className="bg-orange-50">
              <CardContent className="pt-6">
                <div className="text-sm text-orange-800">Temps d'Arrêt</div>
                <div className="text-2xl font-bold">14.2h</div>
                <div className="text-xs text-orange-600 mt-1">-5.7% par rapport au mois dernier</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
