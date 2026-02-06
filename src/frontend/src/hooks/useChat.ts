import { useState, useEffect, useCallback } from 'react';
import { useActor } from './useActor';
import { Mode, ChatRequest } from '../backend';
import { useInternetIdentity } from './useInternetIdentity';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function useChat(mode: Mode) {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRequest, setLastRequest] = useState<string | null>(null);

  // Load history for authenticated users when mode changes
  useEffect(() => {
    if (isAuthenticated && actor) {
      loadHistory();
    } else {
      // Clear messages for guest users when mode changes
      setMessages([]);
    }
  }, [mode, isAuthenticated, actor]);

  const loadHistory = async () => {
    if (!actor || !isAuthenticated) return;
    
    try {
      // Send an empty message to get the current history
      const request: ChatRequest = {
        mode,
        message: '',
        context: undefined,
      };
      
      const response = await actor.chat(request);
      
      // Convert history to messages
      const historyMessages: Message[] = [];
      for (const [userMsg, botMsg] of response.history) {
        if (userMsg) {
          historyMessages.push({ role: 'user', content: userMsg });
        }
        if (botMsg) {
          historyMessages.push({ role: 'assistant', content: botMsg });
        }
      }
      
      setMessages(historyMessages);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const sendMessage = async (message: string) => {
    if (!actor) {
      setError('Not connected to backend');
      return;
    }

    if (!isAuthenticated) {
      setError('Please login to use the chat');
      return;
    }

    setIsLoading(true);
    setError(null);
    setLastRequest(message);

    // Optimistically add user message
    const userMessage: Message = { role: 'user', content: message };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const request: ChatRequest = {
        mode,
        message,
        context: undefined,
      };

      const response = await actor.chat(request);

      // Add assistant response
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
      // Remove optimistic user message on error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const retry = () => {
    if (lastRequest) {
      sendMessage(lastRequest);
    }
  };

  const clearConversation = useCallback(() => {
    setMessages([]);
    setError(null);
    setLastRequest(null);
    
    // For authenticated users, we clear by reloading (backend will have empty history after next message)
    if (isAuthenticated && actor) {
      // The backend doesn't have a dedicated clear method, so we just clear locally
      // The next message will start a fresh conversation
    }
  }, [isAuthenticated, actor]);

  return {
    messages,
    sendMessage,
    clearConversation,
    isLoading,
    error,
    retry,
  };
}
