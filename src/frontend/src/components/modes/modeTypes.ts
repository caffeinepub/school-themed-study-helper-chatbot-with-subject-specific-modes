import { Mode } from '../../backend';

export interface ModeMetadata {
  title: string;
  subtitle: string;
  description: string;
  welcomeMessage: string;
}

export function getModeMetadata(mode: Mode): ModeMetadata {
  switch (mode) {
    case Mode.mathHelp:
      return {
        title: 'Math Help',
        subtitle: 'Step-by-step problem solving',
        description: 'I will guide you through math problems with clear steps and explanations.',
        welcomeMessage: 'Ready to solve some math problems?',
      };
    case Mode.socialStudiesHelp:
      return {
        title: 'Social Studies Help',
        subtitle: 'History, geography, and civics',
        description: 'Let me help you understand historical events, timelines, and key concepts.',
        welcomeMessage: 'Let\'s explore history together!',
      };
    case Mode.scienceHelp:
      return {
        title: 'Science Help',
        subtitle: 'Scientific method and experiments',
        description: 'I will help you form hypotheses, analyze evidence, and understand scientific concepts.',
        welcomeMessage: 'Ready to discover science?',
      };
    case Mode.languageArtsHelp:
      return {
        title: 'Language Arts Help',
        subtitle: 'Writing, reading, and grammar',
        description: 'I will assist with writing, thesis development, grammar, and literary analysis.',
        welcomeMessage: 'Let\'s improve your writing!',
      };
  }
}

export function getQuickPrompts(mode: Mode): string[] {
  switch (mode) {
    case Mode.mathHelp:
      return [
        'Explain this step-by-step',
        'Help me solve this equation',
        'Show me how to check my work',
        'What formula should I use?',
      ];
    case Mode.socialStudiesHelp:
      return [
        'Create a timeline',
        'Explain the causes and effects',
        'Compare and contrast',
        'What are the key terms?',
      ];
    case Mode.scienceHelp:
      return [
        'Help me form a hypothesis',
        'Explain the scientific method',
        'What variables should I test?',
        'How do I analyze this data?',
      ];
    case Mode.languageArtsHelp:
      return [
        'Help me write a thesis',
        'Improve my paragraph',
        'Check my grammar',
        'Create an outline',
      ];
  }
}
