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
import { ArrowLeft, Bot } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pet, setPet] = useState<Pet | null>(null);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const auth = getAuth();

  const petId = searchParams.get('petId');

  useEffect(() => {
    const fetchPet = async () => {
      if (!petId) return;

      try {
        const token = await auth.currentUser?.getIdToken();
        const response = await fetch(`${API_URL}/api/pets/${petId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) throw new Error('Failed to fetch pet');
        
        const data = await response.json();
        setPet(data);
      } catch (error) {
        console.error('Error fetching pet:', error);
        router.push('/pets');
      }
    };

    if (auth.currentUser) {
      fetchPet();
    }
  }, [auth.currentUser, petId, router]);

  const sendMessage = async (content: string) => {
    try {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content,
        role: 'user',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, userMessage]);
      setIsAiResponding(true);

      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          message: content,
          petId: petId || undefined,
          ownerId: auth.currentUser?.uid,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      setMessages(prev => [...prev, data.message]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsAiResponding(false);
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-50 py-6">
      <div className="w-full max-w-4xl bg-white shadow-xl flex flex-col h-[calc(100vh-3rem)] mx-4">
        <div className="p-4 border-b bg-white sticky top-0 z-10 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(petId ? '/pets' : '/')}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="font-semibold text-lg">
              {petId ? (pet ? `Chat about ${pet.name}` : 'Loading...') : 'General Pet Health Chat'}
            </h2>
            {pet && (
              <p className="text-sm text-gray-500">
                {pet.species} • {pet.age} years old • {pet.weight} kg
              </p>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-3 max-w-sm mx-auto p-6 rounded-lg bg-gray-50">
                <Bot className="w-12 h-12 mx-auto text-gray-400" />
                <h3 className="font-medium text-gray-900">
                  {petId ? (
                    pet ? `Ask anything about ${pet.name}'s health and well-being` : 'Loading...'
                  ) : (
                    'Welcome to Vet AI Assistant'
                  )}
                </h3>
                <p className="text-sm text-gray-500">
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
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                <Bot className="w-5 h-5 text-blue-500" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t bg-white">
          <ChatInput onSendMessage={sendMessage} />
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