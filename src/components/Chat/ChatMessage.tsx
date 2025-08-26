import { Message } from "@/types/chat";
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const components = {
  h1: ({ node, ...props }: any) => <h1 className="text-2xl font-bold my-4 text-foreground" {...props} />,
  h2: ({ node, ...props }: any) => <h2 className="text-xl font-semibold my-3 text-foreground" {...props} />,
  h3: ({ node, ...props }: any) => <h3 className="text-lg font-medium my-2 text-foreground" {...props} />,
  p: ({ node, ...props }: any) => <p className="my-3 leading-relaxed text-foreground/90" {...props} />,
  a: ({ node, ...props }: any) => (
    <a 
      href={props.href} 
      className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors"
      target="_blank"
      rel="noopener noreferrer"
    >
      {props.children}
    </a>
  ),
  ul: ({ node, ...props }: any) => <ul className="list-disc pl-6 my-2 space-y-1" {...props} />,
  ol: ({ node, ...props }: any) => <ol className="list-decimal pl-6 my-2 space-y-1" {...props} />,
  li: ({ node, ...props }: any) => <li className="my-1 pl-1" {...props} />,
  code({ node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <div className="rounded-lg overflow-hidden my-4">
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          className="!bg-gray-800 !p-4 text-sm rounded-lg"
          showLineNumbers={false}
          wrapLines={true}
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    ) : (
      <code className="bg-gray-800 text-amber-400 px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    );
  },
  blockquote: ({ node, ...props }: any) => (
    <blockquote className="border-l-4 border-gray-600 pl-4 my-4 text-gray-300 italic" {...props} />
  ),
  table: ({ node, ...props }: any) => (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full border border-gray-700 rounded-lg overflow-hidden" {...props} />
    </div>
  ),
  thead: ({ node, ...props }: any) => <thead className="bg-gray-800" {...props} />,
  tbody: ({ node, ...props }: any) => <tbody className="divide-y divide-gray-700" {...props} />,
  tr: ({ node, ...props }: any) => <tr className="hover:bg-gray-800/50" {...props} />,
  th: ({ node, ...props }: any) => <th className="px-4 py-2 text-left font-medium text-gray-200 bg-gray-800" {...props} />,
  td: ({ node, ...props }: any) => <td className="px-4 py-2 border-t border-gray-700" {...props} />,
  hr: ({ node, ...props }: any) => <hr className="my-4 border-gray-700" {...props} />,
};

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
        <div className="text-sm leading-relaxed">
          {isUser ? (
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : (
            <div className={cn(
              "prose prose-sm dark:prose-invert max-w-none",
              isStreaming && "animate-in fade-in-0 slide-in-from-left-2"
            )}>
              <div className="[&_pre]:!mt-0 [&_pre]:!mb-0 [&_pre]:!rounded-lg [&_pre]:!bg-gray-800 [&_pre]:!p-4 [&_pre]:overflow-x-auto">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={components}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          )}
          {isStreaming && !isUser && (
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