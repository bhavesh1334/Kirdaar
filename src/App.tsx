import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { ChatInterface } from "./components/Chat/ChatInterface";
import NotFound from "./pages/NotFound";
import { useEffect } from 'react';

const queryClient = new QueryClient();

// Wrapper component to handle route parameters
const ChatRoute = () => {
  const { personaId } = useParams<{ personaId: string }>();
  
  useEffect(() => {
    console.log('ChatRoute mounted with personaId:', personaId);
  }, [personaId]);

  if (!personaId) {
    console.error('No personaId provided in route');
    return <div>Error: No persona selected</div>;
  }

  return <ChatInterface />;
};

const App = () => {
  console.log('App rendering');
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/chat/:personaId" element={<ChatRoute />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
