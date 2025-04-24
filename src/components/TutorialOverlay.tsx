
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, HelpCircle, ChevronRight, ChevronLeft } from "lucide-react";

interface TutorialStep {
  title: string;
  description: string;
  targetElement?: string;
  position?: "top" | "right" | "bottom" | "left";
}

const tutorialSteps: TutorialStep[] = [
  {
    title: "Bienvenue au Tutoriel",
    description: "Ce tutoriel vous guidera à travers les fonctionnalités principales du tableau de bord. Cliquez sur 'Suivant' pour commencer.",
  },
  {
    title: "Vue d'Ensemble",
    description: "Cette section affiche les quantités à produire pour chaque produit, basées sur les commandes actuelles et futures.",
    targetElement: "#overview",
    position: "bottom"
  },
  {
    title: "Planification de Production",
    description: "Gérez votre calendrier de production et simulez différents scénarios ici.",
    targetElement: "#production-scheduler",
    position: "bottom"
  },
  {
    title: "Simulateur",
    description: "Testez différents paramètres pour optimiser votre production.",
    targetElement: "#simulator",
    position: "right"
  },
  {
    title: "Terminé!",
    description: "Vous avez maintenant une meilleure compréhension du tableau de bord. Vous pouvez accéder à ce tutoriel à tout moment via le bouton d'aide.",
  }
];

export default function TutorialOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const startTutorial = () => {
    setCurrentStep(0);
    setIsVisible(true);
  };
  
  const closeTutorial = () => {
    setIsVisible(false);
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
  
  const currentTutorialStep = tutorialSteps[currentStep];
  
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
      {isVisible && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-saint-gobain-blue">
                {currentTutorialStep.title}
              </h3>
              <Button variant="ghost" size="sm" onClick={closeTutorial} className="h-8 w-8 p-0">
                <X size={18} />
              </Button>
            </div>
            
            <p className="text-gray-600 mb-6">
              {currentTutorialStep.description}
            </p>
            
            <div className="flex justify-between">
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
                onClick={nextStep}
                className="bg-saint-gobain-blue hover:bg-saint-gobain-darkBlue flex items-center"
              >
                {currentStep === tutorialSteps.length - 1 ? "Terminer" : "Suivant"}
                {currentStep !== tutorialSteps.length - 1 && <ChevronRight size={16} className="ml-1" />}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
