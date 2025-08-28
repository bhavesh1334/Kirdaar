import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Extend the SpeechRecognition interface to include onspeechend
declare global {
  interface SpeechRecognition extends EventTarget {
    onspeechend: (() => void) | null;
  }
}

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSendMessage, disabled, placeholder = "Type your message..." }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = false; // Only final results to avoid duplicates
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.maxAlternatives = 1; // Only get the best result

    let finalTranscript = '';

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      // Get the most recent result
      const lastResult = event.results[event.results.length - 1];
      if (lastResult.isFinal) {
        // Only update with final results to avoid duplicates
        const transcript = lastResult[0].transcript;
        setMessage(prev => prev ? `${prev} ${transcript}` : transcript);
      }
    };

    recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error', event.error);
      if (event.error !== 'no-speech') { // Ignore 'no-speech' errors
        toast.error(`Error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognitionRef.current.onspeechend = () => {
      // Auto-stop after a brief silence
      if (isListening) {
        setTimeout(() => {
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }
        }, 1500);
      }
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.log('Error stopping recognition:', e);
        }
      }
    };
  }, []); // Remove isListening from dependencies to prevent re-creation

  const toggleListening = async () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast.error('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {
        console.log('Error stopping recognition:', e);
      }
      setIsListening(false);
      
    } else {
      try {
        // Clear any previous state
        setMessage(prev => prev.trim());
        await recognitionRef.current?.abort();
        await recognitionRef.current?.start();
        setIsListening(true);
       
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setIsListening(false);
    
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {
        console.log('Error stopping recognition:', e);
      }
      setIsListening(false);
    }
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-border bg-background-secondary rounded-lg p-4">
      <form onSubmit={handleSubmit} className="flex gap-3 items-end">
        <div className="flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "min-h-[44px] max-h-32 resize-none transition-all duration-200",
              "bg-background border-input focus:border-ring focus:ring-1 focus:ring-ring",
              "placeholder:text-foreground/50"
            )}
            rows={1}
          />
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={toggleListening}
            disabled={disabled}
            className={cn(
              "h-11 w-11 p-0 rounded-xl transition-all duration-200",
              isListening 
                ? "bg-destructive " 
                : "bg-primary hover:bg-primary-hover",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "shadow-md hover:shadow-lg hover:scale-105",
              
            )}
          >
            {isListening ? (
              <div className="relative">
                <Mic className="w-4 h-4 animate-pulse" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
              </div>
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </Button>
          <Button
            type="submit"
            disabled={!message.trim() || disabled}
            className={cn(
              "h-11 w-11 p-0 rounded-xl transition-all duration-200",
              "bg-primary hover:bg-primary-hover",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "shadow-md hover:shadow-lg hover:scale-105"
            )}
          >
            {disabled ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}