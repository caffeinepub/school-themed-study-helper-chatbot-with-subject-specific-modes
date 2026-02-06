import { ReactNode } from 'react';
import LoginButton from '../auth/LoginButton';
import { SiCoffeescript } from 'react-icons/si';
import { Heart } from 'lucide-react';

interface SchoolLayoutProps {
  children: ReactNode;
}

export default function SchoolLayout({ children }: SchoolLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header with banner */}
      <header className="relative border-b shadow-sm">
        <div
          className="h-32 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/assets/generated/school-header.dim_1600x500.png)',
          }}
        >
          <div className="h-full bg-gradient-to-r from-black/60 to-black/40 flex items-center justify-between px-6">
            <div className="text-white">
              <h1 className="text-3xl font-bold tracking-tight">Study Helper</h1>
              <p className="text-sm text-white/90">Your personal learning assistant</p>
            </div>
            <LoginButton />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 relative">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'url(/assets/generated/notebook-texture.dim_1024x1024.png)',
            backgroundRepeat: 'repeat',
          }}
        />
        <div className="relative z-10">{children}</div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 px-6 bg-card">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p className="flex items-center gap-1">
            © 2026. Built with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-xs">Your friendly study companion for all subjects</p>
        </div>
      </footer>
    </div>
  );
}
