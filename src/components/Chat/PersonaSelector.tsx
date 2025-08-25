import { Persona } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PersonaSelectorProps {
  personas: Persona[];
  selectedPersona: Persona;
  onPersonaChange: (persona: Persona) => void;
}

export function PersonaSelector({ personas, selectedPersona, onPersonaChange }: PersonaSelectorProps) {
  return (
    <div className="w-[20rem] bg-background-secondary border-r border-border p-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">Kirdaar</h2>
        <p className="text-sm text-foreground/70">Choose who you'd like to talk with</p>
      </div>
      
      <div className="space-y-3">
        {personas.map((persona) => (
          <Card
            key={persona.id}
            className={cn(
              "p-4 cursor-pointer transition-all duration-200 ease-smooth hover:scale-[1.02]",
              "border border-card-border bg-card hover:bg-card/80",
              selectedPersona.id === persona.id && "ring-2 ring-primary bg-card shadow-glow"
            )}
            onClick={() => onPersonaChange(persona)}
          >
            <div className="flex items-start gap-3">
              <img 
                  src={persona.avatar} 
                  alt={persona.name}
                  className="w-16 h-16 rounded-full mx-auto ring-4 ring-primary/20 shadow-glow"
                />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-card-foreground truncate">{persona.name}</h3>
                </div>
                <p className="text-xs text-card-foreground/70 line-clamp-2 mb-2">
                  {persona.description}
                </p>
          
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}