import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { defaultPersonas } from '@/data/personas';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function LandingPage() {
  const navigate = useNavigate();
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);

  const handleStartChatting = () => {
    if (selectedPersonaId) {
      navigate(`/chat/${selectedPersonaId}`);
    }
  };

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger the animation on mount
    setIsVisible(true);
  }, []);

  return (
    <div className="animate-fade-in min-h-screen bg-gradient-primary flex flex-col items-center justify-center p-6">
      <div className="max-w-5xl w-full mx-auto text-center">
        <div className="animate-slide-down">
          <h1 className="text-3xl lg:text-5xl font-bold mb-6 text-white">
           Kirdaar
          </h1>
        </div>
        <p className="animate-slide-down text-xl font-light text-foreground/80 mb-16 max-w-6xl mx-auto">
          Chat with different AI personas, each with their own unique personality and knowledge. 
          Select a persona below to start your conversation!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {defaultPersonas.map((persona, index) => (
            <div 
              key={persona.id}
              className={cn(
                " border rounded-xl p-6 cursor-pointer transition-all duration-300 ease-smooth hover:-translate-y-1",
                selectedPersonaId === persona.id 
                  ? "border-primary bg-primary/10 shadow-lg shadow-primary/20" 
                  : "border-border hover:border-primary/50 hover:bg-primary/5"
              )}
            
              onClick={() => setSelectedPersonaId(persona.id)}
            >
              <div className="flex items-center gap-4 mb-4 active:scale-[0.98] transition-transform">
                <img 
                  src={persona.avatar} 
                  alt={persona.name}
                  className="w-16 h-16 rounded-full border-2 border-primary/30 hover:scale-105 transition-transform duration-300"
                />
                <div className="text-left">
                  <h3 className="text-xl font-semibold">{persona.name}</h3>
                </div>
              </div>
              <p className="text-foreground/80 text-sm text-left">{persona.description}</p>
            </div>
            ))}
        </div>

        <div className={`  ${
          selectedPersonaId ? 'opacity-100' : 'opacity-50'
        }`}>
          <Button 
            size="lg" 
            disabled={!selectedPersonaId}
            onClick={handleStartChatting}
            className={`px-8 py-6 text-lg transition-all duration-300 ${
              selectedPersonaId 
                ? 'bg-white shadow-lg shadow-primary/30 hover:scale-105 active:scale-95' 
                : ''
            }`}
          >
            {selectedPersonaId ? 'Start Chatting' : 'Select a Persona'}
          </Button>
        </div>
      </div>
    </div>
  );
}
