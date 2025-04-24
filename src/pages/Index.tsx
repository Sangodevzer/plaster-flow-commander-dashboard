
import Layout from "@/components/Layout";
import ProductionOverview from "@/components/ProductionOverview";
import ProductionScenarios from "@/components/ProductionScenarios";
import DowntimeRisk from "@/components/DowntimeRisk";
import CostCalculator from "@/components/CostCalculator";
import ResourceAvailability from "@/components/ResourceAvailability";
import Simulator from "@/components/Simulator";
import AlertBanner from "@/components/AlertBanner";
import ProductionScheduler from "@/components/ProductionScheduler";
import DashboardV2 from "@/components/v2/DashboardV2";
import { useVersion } from "@/contexts/VersionContext";

const Index = () => {
  const { version } = useVersion();
  
  return (
    <Layout>
      {version === "v1" ? (
        // V1 Dashboard Components
        <>
          <ProductionOverview />
          <ProductionScheduler />
          <ProductionScenarios />
          <DowntimeRisk />
          <CostCalculator />
          <ResourceAvailability />
          <Simulator />
          <AlertBanner />
        </>
      ) : (
        // V2 Dashboard
        <DashboardV2 />
      )}
    </Layout>
  );
};

export default Index;
