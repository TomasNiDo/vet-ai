import { ChatMessage } from '@/types/chat';
import ReactMarkdown from 'react-markdown';
import { Bot, User } from 'lucide-react';

export function Message({ message }: { message: ChatMessage }) {
  const isAi = message.role === 'assistant';
  
  return (
    <div className={`flex items-start gap-3 ${isAi ? 'justify-start' : 'flex-row-reverse'}`}>
      <div className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${
        isAi ? 'bg-secondary/20' : 'bg-primary'
      }`}>
        {isAi ? (
          <Bot className="w-5 h-5 text-secondary" />
        ) : (
          <User className="w-5 h-5 text-primary-foreground" />
        )}
      </div>
      <div 
        className={`relative inline-block max-w-[80%] rounded-2xl px-4 py-3 ${
          isAi 
            ? 'bg-secondary/5 text-foreground' 
            : 'bg-primary text-primary-foreground'
        }`}
      >
        {/* Arrow for chat bubble */}
        <div className={`absolute top-4 ${isAi ? '-left-2' : '-right-2'} w-0 h-0 
          border-solid border-4 ${
            isAi 
              ? 'border-l-transparent border-t-transparent border-b-transparent border-r-secondary/5' 
              : 'border-r-transparent border-t-transparent border-b-transparent border-l-primary'
          }`}
        />
        
        {isAi ? (
          <ReactMarkdown
            className="prose prose-sm max-w-none prose-p:leading-normal prose-pre:my-2"
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
              li: ({ children }) => <li className="mb-1">{children}</li>,
              code: ({ children }) => <span>{children}</span>,
              pre: ({ children }) => <span>{children}</span>,
            }}
          >
            {message.content}
          </ReactMarkdown>
        ) : (
          <div className="whitespace-pre-wrap break-words text-sm">{message.content}</div>
        )}
      </div>
    </div>
  );
} 