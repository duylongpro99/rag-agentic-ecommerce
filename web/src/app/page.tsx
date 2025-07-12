'use client';

import { useState } from 'react';
import ChatInterface from './components/ChatInterface';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🛍️ AI Product Search Assistant
            </h1>
            <p className="text-gray-600">
              Ask me anything about our products - I'll help you find exactly what you need!
            </p>
          </div>
          <ChatInterface />
        </div>
      </div>
    </main>
  );
}