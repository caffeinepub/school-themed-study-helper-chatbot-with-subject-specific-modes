import { useState, useEffect, useRef } from 'react';
import { Mode } from '../../backend';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import ChatThread from './ChatThread';
import ChatComposer from './ChatComposer';
import QuickPrompts from './QuickPrompts';
import { useChat } from '../../hooks/useChat';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getModeMetadata } from '../modes/modeTypes';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

interface ChatPageProps {
  mode: Mode;
  onBackToHome: () => void;
}

export default function ChatPage({ mode, onBackToHome }: ChatPageProps) {
  const [inputValue, setInputValue] = useState('');
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    sendMessage,
    clearConversation,
    isLoading,
    error,
    retry,
  } = useChat(mode);

  const modeMetadata = getModeMetadata(mode);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;
    const message = inputValue.trim();
    setInputValue('');
    await sendMessage(message);
  };

  const handleQuickPromptClick = (promptText: string) => {
    setInputValue(promptText);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear this conversation?')) {
      clearConversation();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBackToHome}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/school-mascot.dim_512x512.png"
              alt="Study Helper Mascot"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h2 className="text-lg font-semibold">{modeMetadata.title}</h2>
              <p className="text-sm text-muted-foreground">{modeMetadata.subtitle}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isAuthenticated && (
            <span className="text-xs text-muted-foreground px-3 py-1 bg-muted rounded-full">
              Guest Mode
            </span>
          )}
          {messages.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleClear}>
              Clear Chat
            </Button>
          )}
        </div>
      </div>

      {/* Quick Prompts */}
      {messages.length === 0 && (
        <div className="p-4 border-b bg-muted/30">
          <QuickPrompts mode={mode} onPromptClick={handleQuickPromptClick} />
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <img
              src="/assets/generated/school-mascot.dim_512x512.png"
              alt="Study Helper Mascot"
              className="w-24 h-24"
            />
            <div>
              <h3 className="text-xl font-semibold mb-2">{modeMetadata.welcomeMessage}</h3>
              <p className="text-muted-foreground max-w-md">{modeMetadata.description}</p>
            </div>
          </div>
        ) : (
          <ChatThread messages={messages} mode={mode} />
        )}
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Thinking...</span>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 pb-2">
          <Alert variant="destructive">
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={retry}>
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t bg-card">
        <ChatComposer
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          disabled={isLoading}
          placeholder={`Ask a ${modeMetadata.title.toLowerCase()} question...`}
        />
      </div>
    </div>
  );
}
