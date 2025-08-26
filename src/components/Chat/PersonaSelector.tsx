import { useNavigate } from "react-router-dom";
import { Persona } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { PanelRight, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect } from "react";

interface PersonaSelectorProps {
  personas: Persona[];
  selectedPersona: Persona;
  onPersonaChange: (persona: Persona) => void;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}


export function PersonaSelector({
  personas,
  selectedPersona,
  onPersonaChange,
  sidebarOpen,
  setSidebarOpen
}: PersonaSelectorProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile()


useEffect(() => {
  if(isMobile){
    setSidebarOpen(false)
  }
}, [isMobile])




  return (
    <div className="w-[20rem] fixed top-0 left-0 z-50  border-r border-border p-6 overflow-y-auto">
      <div className="mb-6 relative">
        <h2 className="text-xl font-semibold text-foreground mb-2 hover:text-primary transition-colors duration-300 cursor-pointer transform">
          <span
            onClick={(e) => {
              e.stopPropagation();
              navigate("/");
            }}
            className="cursor-pointer"
          >
            Kirdaar
          </span>
        </h2>
        <p className="text-sm text-foreground/70">
          Choose who you'd like to talk with
        </p>
        <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(prev=> !prev)}
              className="text-foreground/60 md:hidden absolute -top-1 -right-2 hover:text-foreground hover:bg-primary/10 transition-all duration-300"
            >
              {sidebarOpen ? <PanelRight size={32} /> : <PanelLeft size={32} />}
            </Button>
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
                <img
                  src={persona.avatar}
                  alt={persona.name}
                  className={cn(
                    "w-10 h-10 ring-2 ring-primary/30 shadow-lg flex flex-shrink-0 rounded-full transition-all duration-300",
                    isSelected
                      ? "border-primary scale-110"
                      : "border-transparent group-hover:border-primary/30 group-hover:scale-105"
                  )}
                />
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
