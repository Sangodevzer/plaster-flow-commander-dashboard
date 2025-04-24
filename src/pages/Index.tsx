
import Layout from "@/components/Layout";
import ProductionOverview from "@/components/ProductionOverview";
import ProductionScenarios from "@/components/ProductionScenarios";
import DowntimeRisk from "@/components/DowntimeRisk";
import CostCalculator from "@/components/CostCalculator";
import ResourceAvailability from "@/components/ResourceAvailability";
import Simulator from "@/components/Simulator";
import AlertBanner from "@/components/AlertBanner";

const Index = () => {
  return (
    <Layout>
      <ProductionOverview />
      <ProductionScenarios />
      <DowntimeRisk />
      <CostCalculator />
      <ResourceAvailability />
      <Simulator />
      <AlertBanner />
    </Layout>
  );
};

export default Index;
