
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, HelpCircle, ChevronRight, ChevronLeft, PlayCircle, PauseCircle } from "lucide-react";
import { useVersion } from "@/contexts/VersionContext";

interface TutorialStep {
  title: string;
  description: string;
  targetElement?: string;
  position?: "top" | "right" | "bottom" | "left";
  version?: "v1" | "v2" | "both";
}

// Common tutorial steps for both versions
const commonTutorialSteps: TutorialStep[] = [
  {
    title: "Bienvenue au Tutoriel",
    description: "Ce tutoriel vous guidera à travers les fonctionnalités principales du tableau de bord. Cliquez sur 'Suivant' pour commencer.",
    version: "both"
  }
];

// V1 specific tutorial steps
const v1TutorialSteps: TutorialStep[] = [
  {
    title: "Vue d'Ensemble",
    description: "Cette section affiche les quantités à produire pour chaque produit, basées sur les commandes actuelles et futures.",
    targetElement: "#overview",
    position: "bottom",
    version: "v1"
  },
  {
    title: "Planification de Production",
    description: "Gérez votre calendrier de production et simulez différents scénarios ici.",
    targetElement: "#production-scheduler",
    position: "bottom",
    version: "v1"
  },
  {
    title: "Simulateur",
    description: "Testez différents paramètres pour optimiser votre production.",
    targetElement: "#simulator",
    position: "right",
    version: "v1"
  }
];

// V2 specific tutorial steps
const v2TutorialSteps: TutorialStep[] = [
  {
    title: "Interface V2",
    description: "Bienvenue dans la nouvelle interface V2! Elle est plus simple et optimisée pour une expérience utilisateur améliorée.",
    version: "v2"
  },
  {
    title: "Onglets Principaux",
    description: "Naviguez entre l'Aperçu de production, le Simulateur avancé et les Statistiques grâce à ces onglets.",
    targetElement: ".tabs-list",
    position: "bottom",
    version: "v2"
  },
  {
    title: "Graphique Empilé",
    description: "Ce graphique consolidé vous montre les quantités disponibles, commandées, et le stock minimal pour chaque produit.",
    targetElement: ".recharts-wrapper",
    position: "top",
    version: "v2"
  },
  {
    title: "Simulateur Avancé",
    description: "Un simulateur entièrement repensé vous permet d'ajouter plusieurs produits et de visualiser des scénarios comparatifs.",
    version: "v2"
  },
  {
    title: "Onglet Statistiques",
    description: "Consultez les statistiques détaillées de production, ventes et l'impact sur le marché.",
    version: "v2"
  }
];

// Final step for both versions
const finalStep: TutorialStep = {
  title: "Terminé!",
  description: "Vous avez maintenant une meilleure compréhension du tableau de bord. Vous pouvez accéder à ce tutoriel à tout moment via le bouton d'aide.",
  version: "both"
};

export default function TutorialOverlay() {
  const { version } = useVersion();
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [tutorialSteps, setTutorialSteps] = useState<TutorialStep[]>([]);
  
  // Create the appropriate tutorial steps based on the current version
  useEffect(() => {
    let steps = [...commonTutorialSteps];
    
    if (version === "v1") {
      steps = [...steps, ...v1TutorialSteps];
    } else {
      steps = [...steps, ...v2TutorialSteps];
    }
    
    steps = [...steps, finalStep];
    setTutorialSteps(steps);
  }, [version]);
  
  // Handle auto-play functionality
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (autoPlay && currentStep < tutorialSteps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 5000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [autoPlay, currentStep, tutorialSteps.length]);
  
  const startTutorial = () => {
    setCurrentStep(0);
    setIsVisible(true);
  };
  
  const closeTutorial = () => {
    setIsVisible(false);
    setAutoPlay(false);
  };
  
  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      closeTutorial();
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const toggleAutoPlay = () => {
    setAutoPlay(!autoPlay);
  };
  
  const currentTutorialStep = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;
  
  return (
    <>
      {/* Tutorial trigger button */}
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 rounded-full w-10 h-10 p-0 flex items-center justify-center shadow-lg"
        onClick={startTutorial}
      >
        <HelpCircle size={20} />
      </Button>
      
      {/* Tutorial overlay */}
      {isVisible && currentTutorialStep && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-saint-gobain-blue">
                {currentTutorialStep.title}
              </h3>
              <Button variant="ghost" size="sm" onClick={closeTutorial} className="h-8 w-8 p-0">
                <X size={18} />
              </Button>
            </div>
            
            <Progress value={progress} className="h-2 mb-4" />
            
            <p className="text-gray-600 mb-6">
              {currentTutorialStep.description}
            </p>
            
            <div className="flex justify-between">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center"
                >
                  <ChevronLeft size={16} className="mr-1" />
                  Précédent
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={toggleAutoPlay}
                  className="flex items-center"
                >
                  {autoPlay ? (
                    <>
                      <PauseCircle size={16} className="mr-1" />
                      Pause
                    </>
                  ) : (
                    <>
                      <PlayCircle size={16} className="mr-1" />
                      Auto
                    </>
                  )}
                </Button>
              </div>
              
              <Button 
                onClick={nextStep}
                className="bg-saint-gobain-blue hover:bg-saint-gobain-blue/90 flex items-center"
              >
                {currentStep === tutorialSteps.length - 1 ? "Terminer" : "Suivant"}
                {currentStep !== tutorialSteps.length - 1 && <ChevronRight size={16} className="ml-1" />}
              </Button>
            </div>
            
            <div className="mt-4 text-xs text-center text-gray-500">
              Étape {currentStep + 1} sur {tutorialSteps.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
