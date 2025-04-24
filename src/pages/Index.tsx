import Layout from "@/components/Layout";
import ProductionOverview from "@/components/ProductionOverview";
import ProductionScenarios from "@/components/ProductionScenarios";
import DowntimeRisk from "@/components/DowntimeRisk";
import CostCalculator from "@/components/CostCalculator";
import ResourceAvailability from "@/components/ResourceAvailability";
import Simulator from "@/components/Simulator";
import AlertBanner from "@/components/AlertBanner";
import ProductionScheduler from "@/components/ProductionScheduler";
import { useVersion } from "@/contexts/VersionContext";

const Index = () => {
  const { version } = useVersion();
  
  if (version === "v1") {
    return (
      <Layout>
        <ProductionOverview />
        <ProductionScheduler />
        <ProductionScenarios />
        <DowntimeRisk />
        <CostCalculator />
        <ResourceAvailability />
        <Simulator />
        <AlertBanner />
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="p-4 rounded-lg border bg-white">
          <h1 className="text-2xl font-bold text-saint-gobain-blue mb-6">Tableau de bord Saint-Gobain 2025</h1>
          <p className="text-gray-600">
            Bienvenue dans la nouvelle version du tableau de bord de gestion de production.
            Cette interface sera développée pour inclure:
          </p>
          <ul className="list-disc ml-6 mt-3 space-y-1 text-gray-600">
            <li>Graphique en colonnes empilées pour les données produits</li>
            <li>Simulateur de production amélioré</li>
            <li>Calculateur de coûts intégré</li>
            <li>Système de notifications</li>
            <li>Onglet statistiques</li>
            <li>Tutoriel interactif</li>
          </ul>
          <div className="mt-6">
            <p className="bg-blue-50 p-3 rounded-md text-blue-700 text-sm">
              ⚙️ Version en développement - Plus de fonctionnalités à venir
            </p>
          </div>
        </div>
        
        {/* Placeholder for V2 components */}
        {/* <ProductionOverviewV2 /> */}
        {/* Other V2 components will be added here */}
      </div>
    </Layout>
  );
};

export default Index;
