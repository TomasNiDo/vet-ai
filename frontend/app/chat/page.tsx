'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChatMessage } from '@/types/chat';
import { Pet } from '@/types/pet';
import { ChatInput } from '@/components/chat/chat-input';
import { Message } from '@/components/chat/message';
import { AuthWrapper } from '@/components/auth/auth-wrapper';
import { getAuth } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bot, AlertCircle } from 'lucide-react';
import axios from '@/lib/axios';
import { isAxiosError } from 'axios';

function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pet, setPet] = useState<Pet | null>(null);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const auth = getAuth();

  const petId = searchParams.get('petId');

  useEffect(() => {
    const initializeChat = async () => {
      if (!auth.currentUser) return;

      try {
        if (petId) {
          const { data: petData } = await axios.get(`/api/pets/${petId}`);
          setPet(petData);
        }

        setIsAiResponding(true);
        setError(null);
        const { data } = await axios.post('/api/chat', {
          message: '',
          petId: petId || undefined,
          ownerId: auth.currentUser.uid,
        });

        setMessages([{
          id: data.message.id,
          content: data.message.content,
          role: 'assistant',
          timestamp: data.message.timestamp,
        }]);
      } catch (error) {
        if (petId) {
          console.error('Error fetching pet:', error);
          router.push('/pets');
        } else {
          handleError(error);
        }
      } finally {
        setIsAiResponding(false);
      }
    };

    initializeChat();
  }, [auth.currentUser, petId, router]);

  const handleError = (error: unknown) => {
    if (isAxiosError(error)) {
      if (error.response?.status === 429) {
        setError("I'm currently handling too many requests. Please wait a moment and try again.");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } else {
      setError("An unexpected error occurred. Please try again.");
    }
    
    setTimeout(() => setError(null), 5000);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    try {
      setError(null);
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content,
        role: 'user',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, userMessage]);
      setIsAiResponding(true);

      const { data } = await axios.post('/api/chat', {
        message: content,
        petId: petId || undefined,
        ownerId: auth.currentUser?.uid,
      });

      setMessages(prev => [...prev, data.message]);
    } catch (error) {
      handleError(error);
    } finally {
      setIsAiResponding(false);
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-background py-6">
      <div className="w-full max-w-4xl bg-card shadow-xl flex flex-col h-[calc(100vh-3rem)] mx-4 rounded-xl border border-border">
        <div className="p-4 border-b border-border bg-card sticky top-0 z-10 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(petId ? '/pets' : '/')}
            className="hover:bg-secondary/10"
          >
            <ArrowLeft className="h-4 w-4 text-primary" />
          </Button>
          <div>
            <h2 className="font-semibold text-lg text-foreground">
              {petId ? (pet ? `Chat about ${pet.name}` : 'Loading...') : 'General Pet Health Chat'}
            </h2>
            {pet && (
              <p className="text-sm text-muted-foreground">
                {pet.species} • {pet.age} years old • {pet.weight} kg
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 border-b border-destructive/20">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-3 max-w-sm mx-auto p-6 rounded-lg bg-secondary/5">
                <Bot className="w-12 h-12 mx-auto text-secondary" />
                <h3 className="font-medium text-foreground">
                  {petId ? (
                    pet ? `Ask anything about ${pet.name}'s health and well-being` : 'Loading...'
                  ) : (
                    'Welcome to FurSure AI Assistant'
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {petId ? (
                    pet ? `I'll consider ${pet.name}'s profile and medical history in my responses` : ''
                  ) : (
                    'Ask any general questions about pet health and care'
                  )}
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <Message key={message.id} message={message} />
            ))
          )}
          {isAiResponding && (
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary/20">
                <Bot className="w-5 h-5 text-secondary" />
              </div>
              <div className="bg-secondary/5 rounded-2xl px-4 py-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border bg-card">
          <ChatInput onSendMessage={sendMessage} disabled={!!error || isAiResponding} />
        </div>
      </div>
    </div>
  );
}

export default function ProtectedChatPage() {
  return (
    <AuthWrapper>
      <ChatPage />
    </AuthWrapper>
  );
} 