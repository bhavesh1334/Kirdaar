import { useState, useRef, useEffect } from 'react';
import { PersonaSelector } from './PersonaSelector';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { useChat } from '@/hooks/useChat';
import { defaultPersonas } from '@/data/personas';
import { Persona } from '@/types/chat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {  RotateCcw, Menu, X, PanelLeft, PanelRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

export function ChatInterface() {
  const [selectedPersona, setSelectedPersona] = useState<Persona>(defaultPersonas[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    streamingState,
    sendMessage,
    clearMessages,
    setApiKey,
    isConfigured
  } = useChat();

  // Auto-set the provided API key on mount
  // TODO: change it later
  React.useEffect(() => {
    const apiKey = 'Your key';
    setApiKey(apiKey);
  }, [setApiKey]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingState.partialContent]);

  const handleSendMessage = async (content: string) => {
    await sendMessage(content, selectedPersona);
  };

  const handlePersonaChange = (persona: Persona) => {
    setSelectedPersona(persona);
  };


  return (
    <div className="flex h-screen bg-gradient-primary">
      {/* Persona Selector Sidebar */}
      <div className={cn(
        "border-r border-border bg-gradient-surface backdrop-blur-xl shadow-lg transition-all duration-300 ease-in-out",
        sidebarOpen ? "w-[20rem]" : "w-0 overflow-hidden"
      )}>
        <PersonaSelector
          personas={defaultPersonas}
          selectedPersona={selectedPersona}
          onPersonaChange={handlePersonaChange}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-6 px-4 border-b border-border bg-gradient-surface/30 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-foreground/60 hover:text-foreground hover:bg-primary/10 transition-all duration-300"
            >
              {sidebarOpen ? <PanelRight size={32} /> : <PanelLeft  size={32}/>}
            </Button>
            <img 
              src={selectedPersona.avatar} 
              alt={selectedPersona.name}
              className="w-12 h-12 rounded-full ring-2 ring-primary/30 shadow-lg"
            />
            <div>
              <h2 className="text-xl font-bold text-foreground">{selectedPersona.name}</h2>
              <p className="text-sm text-foreground/70 line-clamp-2">{selectedPersona.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearMessages}
              className="text-foreground/60 hover:text-foreground hover:bg-destructive/10 transition-all duration-300"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 bg-[#332f36]" ref={scrollAreaRef}>
          <div className="space-y-6 max-w-7xl mx-auto m-6">
            {messages.length === 0 ? (
              <div className="text-center text-foreground/50 mt-20 animate-fade-in">
                <img 
                  src={selectedPersona.avatar} 
                  alt={selectedPersona.name}
                  className="w-24 h-24 rounded-full mx-auto mb-6 ring-4 ring-primary/20 shadow"
                />
                <h3 className="text-2xl font-semibold mb-3 text-white">
                  Start a conversation with {selectedPersona.name}
                </h3>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {selectedPersona.personality.traits.map((trait) => (
                    <span key={trait} className="px-3 capitalize py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isStreaming={streamingState.currentMessageId === message.id}
                />
              ))
            )}
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="border-t border-border bg-[#332f36] backdrop-blur-xl rounded-lg p-6">
          <div className="max-w-7xl mx-auto">
            <ChatInput 
              onSendMessage={handleSendMessage}
              disabled={streamingState.isStreaming}
              placeholder={`Message ${selectedPersona.name}...`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}