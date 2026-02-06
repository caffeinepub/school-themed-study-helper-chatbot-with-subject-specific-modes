import { Mode } from '../../backend';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatThreadProps {
  messages: Message[];
  mode: Mode;
}

export default function ChatThread({ messages }: ChatThreadProps) {
  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          {message.role === 'assistant' && (
            <Avatar className="w-8 h-8 mt-1">
              <AvatarImage src="/assets/generated/school-mascot.dim_512x512.png" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
          )}
          <div
            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              message.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground border'
            }`}
          >
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          </div>
          {message.role === 'user' && (
            <Avatar className="w-8 h-8 mt-1">
              <AvatarFallback>
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      ))}
    </div>
  );
}
