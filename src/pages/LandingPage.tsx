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
    <div className="animate-fade-in min-h-screen bg-gradient-primary flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-5xl mx-auto text-center">
        <div className="animate-slide-down">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 sm:mb-6 text-white drop-shadow-md uppercase">
            Kirdaar
          </h1>
        </div>
        <p className="animate-slide-down text-base sm:text-lg md:text-xl font-light text-foreground/80 mb-8 sm:mb-12 md:mb-16 max-w-4xl mx-auto px-2">
          Chat with different AI Kirdaar (Character), each with their own unique personality and knowledge. 
          Select a Character below to start your conversation!
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {defaultPersonas.map((persona) => (
            <div 
              key={persona.id}
              className={cn(
                "border rounded-xl p-4 sm:p-6 bg-primary/10 cursor-pointer transition-all duration-300 ease-smooth hover:-translate-y-1",
                "flex flex-col h-full",
                selectedPersonaId === persona.id 
                  ? "border-primary shadow-lg shadow-primary/20" 
                  : "border-border hover:border-primary/50 hover:bg-primary/5"
              )}
              onClick={() => setSelectedPersonaId(persona.id)}
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <img 
                  src={persona.avatar} 
                  alt={persona.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-full border-2 border-primary/30 hover:scale-105 transition-transform duration-300 flex-shrink-0"
                />
                <div className="text-left">
                  <h3 className="text-lg sm:text-xl font-semibold line-clamp-1">{persona.name}</h3>
                </div>
              </div>
              <p className="text-foreground/80 text-xs sm:text-sm text-left mt-auto">{persona.description}</p>
            </div>
          ))}
        </div>

        <div className={`mb-8 sm:mb-12 ${
          selectedPersonaId ? 'opacity-100' : 'opacity-50'
        }`}>
          <Button 
            size="lg" 
            disabled={!selectedPersonaId}
            onClick={handleStartChatting}
            className={`w-full sm:w-auto px-6 py-5 sm:px-8 sm:py-6 text-base sm:text-lg transition-all duration-300 ${
              selectedPersonaId 
                ? 'bg-white text-black hover:bg-white/90 shadow-lg shadow-primary/30 hover:scale-105 active:scale-95' 
                : 'bg-white/20 text-white/70 cursor-not-allowed'
            }`}
          >
            {selectedPersonaId ? 'Start Chatting' : 'Select a Kirdaar'}
          </Button>
        </div>
      </div>
      
      <footer className="w-full py-4 text-center text-xs text-white/60 mt-8">
        Built with ❤️ by{' '}
        <a 
          href="https://github.com/bhavesh1334/Kirdaar" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-white/80 hover:text-white transition-colors hover:underline underline-offset-4 italic"
        >
          Bhavesh Chandrakar
        </a>
      </footer>
    </div>
  );
}
