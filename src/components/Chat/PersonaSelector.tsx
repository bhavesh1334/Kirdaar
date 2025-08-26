import { useNavigate } from "react-router-dom";
import { Persona } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

interface PersonaSelectorProps {
  personas: Persona[];
  selectedPersona: Persona;
  onPersonaChange: (persona: Persona) => void;
}

export function PersonaSelector({
  personas,
  selectedPersona,
  onPersonaChange,
}: PersonaSelectorProps) {
  const navigate = useNavigate();

  return (
    <div className="w-[20rem] bg-background-secondary border-r border-border p-6 overflow-y-auto">
      <div className="mb-6">
        <h2
          className="text-xl font-semibold text-foreground mb-2 hover:text-primary transition-colors duration-300 cursor-pointer transform"
          onClick={(e) => {
            e.stopPropagation();
            navigate("/");
          }}
        >
       <span className="cursor-pointer">Kirdaar</span>
        </h2>
        <p className="text-sm text-foreground/70">
          Choose who you'd like to talk with
        </p>
      </div>

      <div className="space-y-3">
        {personas.map((persona, index) => {
          const isSelected = selectedPersona.id === persona.id;
          return (
            <Card
              key={persona.id}
              className={cn(
                "group p-4 cursor-pointer transition-all duration-300 ease-smooth",
                "border border-card-border bg-card hover:bg-card/80",
                isSelected
                  ? "ring-2 ring-primary bg-card/90 shadow-lg shadow-primary/10"
                  : "hover:translate-x-1 hover:shadow-md"
              )}
              style={{
                animationDelay: `${0.1 + index * 0.05}s`,
                opacity: isSelected ? 1 : 0.9,
              }}
              onClick={() => onPersonaChange(persona)}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={persona.avatar}
                    alt={persona.name}
                    className={cn(
                      "w-30 rounded-full transition-all duration-300",
                      isSelected
                        ? "border-primary scale-110"
                        : "border-transparent group-hover:border-primary/30 group-hover:scale-105"
                    )}
                  />
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-medium transition-colors duration-300 group-hover:text-primary">
                    {persona.name}
                  </h3>
                  <p className="text-xs text-foreground/60 line-clamp-1 transition-colors duration-300 group-hover:text-foreground/80">
                    {persona.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
