
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface VersionToggleProps {
  currentVersion: "v1" | "v2";
  onToggle: (version: "v1" | "v2") => void;
}

export default function VersionToggle({ currentVersion, onToggle }: VersionToggleProps) {
  const { toast } = useToast();
  
  const handleToggle = () => {
    const newVersion = currentVersion === "v1" ? "v2" : "v1";
    onToggle(newVersion);
    
    toast({
      title: `Version ${newVersion.toUpperCase()} activée`,
      description: newVersion === "v2" ? 
        "Nouvelle interface avec fonctionnalités améliorées" : 
        "Interface classique",
      duration: 3000
    });
  };
  
  return (
    <div className="flex items-center space-x-4 rounded-lg border border-gray-200 p-2 px-3 bg-white">
      <div className="flex items-center space-x-2">
        <Switch 
          id="version-toggle" 
          checked={currentVersion === "v2"}
          onCheckedChange={handleToggle}
        />
        <Label htmlFor="version-toggle" className="flex items-center space-x-2">
          <span className={currentVersion === "v1" ? "font-bold text-factory-blue" : "text-gray-500"}>V1</span>
          <span>/</span>
          <span className={currentVersion === "v2" ? "font-bold text-saint-gobain-blue" : "text-gray-500"}>V2</span>
        </Label>
      </div>
      <div className="text-xs rounded-full bg-gray-100 px-2 py-1">
        2025
      </div>
    </div>
  );
}
