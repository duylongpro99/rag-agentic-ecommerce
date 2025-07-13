'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Bot, Send, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatResponse {
  response: string;
  conversation_id: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          conversation_id: conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data: ChatResponse = await response.json();
      
      if (!conversationId) {
        setConversationId(data.conversation_id);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-[600px] flex flex-col rounded-lg overflow-hidden">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground mt-8">
            <Bot className="h-12 w-12 mx-auto mb-4 text-primary" />
            <p className="mb-4 text-lg font-medium">Hi! I'm your AI shopping assistant.</p>
            <p className="text-sm mb-4">Try asking me:</p>
            <div className="space-y-2 text-sm">
              <p className="bg-muted/50 rounded-lg px-3 py-2 inline-block">"I need comfortable running shoes"</p>
              <p className="bg-muted/50 rounded-lg px-3 py-2 inline-block">"Show me Apple products under $500"</p>
              <p className="bg-muted/50 rounded-lg px-3 py-2 inline-block">"What headphones do you recommend?"</p>
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              </div>
            )}
            
            <div className={cn(
              "max-w-[80%] rounded-lg px-4 py-3",
              message.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted'
            )}>
              <p className="whitespace-pre-wrap text-sm">{message.content}</p>
              <p className={cn(
                "text-xs mt-2 opacity-70",
                message.role === 'user' ? 'text-primary-foreground' : 'text-muted-foreground'
              )}>
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
            
            {message.role === 'user' && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="bg-muted rounded-lg px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-muted-foreground/50 rounded-full" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-background p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about products..."
            className="flex-1 bg-background border border-input rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}