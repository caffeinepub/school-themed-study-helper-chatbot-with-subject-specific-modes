import { Mode } from '../backend';
import { BookOpen, Calculator, FlaskConical, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface HomePageProps {
  onModeSelect: (mode: Mode) => void;
}

const modeCards = [
  {
    mode: Mode.mathHelp,
    title: 'Math Help',
    description: 'Step-by-step problem solving and equation guidance',
    icon: Calculator,
    color: 'from-blue-500 to-blue-600',
    bgAccent: 'bg-blue-50 dark:bg-blue-950/30',
  },
  {
    mode: Mode.socialStudiesHelp,
    title: 'Social Studies Help',
    description: 'Timelines, key events, and historical analysis',
    icon: Globe,
    color: 'from-amber-500 to-amber-600',
    bgAccent: 'bg-amber-50 dark:bg-amber-950/30',
  },
  {
    mode: Mode.scienceHelp,
    title: 'Science Help',
    description: 'Hypotheses, experiments, and scientific method',
    icon: FlaskConical,
    color: 'from-green-500 to-green-600',
    bgAccent: 'bg-green-50 dark:bg-green-950/30',
  },
  {
    mode: Mode.languageArtsHelp,
    title: 'Language Arts Help',
    description: 'Writing, grammar, thesis development, and revision',
    icon: BookOpen,
    color: 'from-purple-500 to-purple-600',
    bgAccent: 'bg-purple-50 dark:bg-purple-950/30',
  },
];

export default function HomePage({ onModeSelect }: HomePageProps) {
  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-5xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Welcome to Study Helper
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose your subject and get personalized help with your homework. Each mode is designed to guide you through your learning journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {modeCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.mode}
                className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] border-2"
                onClick={() => onModeSelect(card.mode)}
              >
                <CardHeader className={card.bgAccent}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} text-white`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{card.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardDescription className="text-base">{card.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
