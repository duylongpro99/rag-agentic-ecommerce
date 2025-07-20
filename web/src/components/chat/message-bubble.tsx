'use client';

import { Message } from '@/lib/dal/conversation.dal';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div 
      className={cn(
        "p-4 rounded-lg max-w-[80%]",
        isUser 
          ? "bg-primary text-primary-foreground ml-auto" 
          : "bg-secondary text-secondary-foreground"
      )}
    >
      {message.content}
    </div>
  );
};