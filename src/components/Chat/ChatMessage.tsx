import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
}

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn(
      "flex mb-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-300",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[70%] rounded-lg px-4 py-3 relative",
        "transition-all duration-200 ease-smooth",
        isUser 
          ? "bg-message-user text-message-user-foreground ml-12" 
          : "bg-message-assistant text-message-assistant-foreground mr-12 border border-card-border"
      )}>
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          <span className={cn(
            "transition-all duration-200 ease-out",
            isStreaming && "animate-in fade-in-0 slide-in-from-left-2"
          )}>
            {message.content}
          </span>
          {isStreaming && (
            <span className="inline-block w-0.5 h-4 bg-primary animate-pulse ml-1 rounded-sm" />
          )}
        </div>
        
        {/* Message timestamp */}
        <div className={cn(
          "text-xs mt-2 opacity-60",
          isUser ? "text-message-user-foreground" : "text-message-assistant-foreground"
        )}>
          {message.timestamp && new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
        
        {/* Message tail */}
        <div className={cn(
          "absolute top-4 w-3 h-3 rotate-45",
          isUser 
            ? "bg-message-user -right-1" 
            : "bg-message-assistant border-r border-b border-card-border -left-1"
        )} />
      </div>
    </div>
  );
}