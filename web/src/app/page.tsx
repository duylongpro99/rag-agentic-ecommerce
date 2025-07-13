'use client';

import ChatInterface from './components/ChatInterface';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Sparkles, MessageCircle } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <ShoppingBag className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">
                AI Product Search
              </h1>
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <p className="text-lg text-muted-foreground mb-6">
              Ask me anything about our products - I'll help you find exactly what you need!
            </p>
            
            {/* Feature Badges */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <Badge variant="secondary" className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                Conversational Search
              </Badge>
              <Badge variant="secondary">Smart Recommendations</Badge>
              <Badge variant="secondary">Real-time Results</Badge>
            </div>
          </div>
          
          {/* Chat Interface Card */}
          <Card className="shadow-lg">
            <CardContent className="p-0">
              <ChatInterface />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}