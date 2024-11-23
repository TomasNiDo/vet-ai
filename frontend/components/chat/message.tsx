import { ChatMessage } from '@/types/chat';
import ReactMarkdown from 'react-markdown';

export function Message({ message }: { message: ChatMessage }) {
  const isAi = message.role === 'assistant';
  
  return (
    <div className={`flex ${isAi ? 'justify-start' : 'justify-end'}`}>
      <div 
        className={`max-w-[80%] rounded-lg p-4 ${
          isAi 
            ? 'bg-gray-100 rounded-tl-none prose prose-sm max-w-none' 
            : 'bg-blue-500 text-white rounded-tr-none'
        }`}
      >
        {isAi ? (
          <ReactMarkdown
            components={{
              // Style markdown elements
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
              li: ({ children }) => <li className="mb-1">{children}</li>,
              code: ({ children }) => (
                <code className="bg-gray-200 rounded px-1 py-0.5">{children}</code>
              ),
              pre: ({ children }) => (
                <pre className="bg-gray-800 text-white p-3 rounded-md my-2 overflow-x-auto">
                  {children}
                </pre>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        ) : (
          <div className="whitespace-pre-wrap">{message.content}</div>
        )}
      </div>
    </div>
  );
} 