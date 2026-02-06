import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SchoolLayout from './components/layout/SchoolLayout';
import HomePage from './pages/HomePage';
import ChatPage from './components/chat/ChatPage';
import ProfileSetupModal from './components/auth/ProfileSetupModal';
import { Mode } from './backend';

const queryClient = new QueryClient();

function AppContent() {
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null);

  const handleModeSelect = (mode: Mode) => {
    setSelectedMode(mode);
  };

  const handleBackToHome = () => {
    setSelectedMode(null);
  };

  return (
    <SchoolLayout>
      <ProfileSetupModal />
      {selectedMode === null ? (
        <HomePage onModeSelect={handleModeSelect} />
      ) : (
        <ChatPage mode={selectedMode} onBackToHome={handleBackToHome} />
      )}
    </SchoolLayout>
  );
}

export default function App() {
  return <AppContent />;
}
