export interface AIModel {
  id: string;
  name: string;
  colorVariable: string;
  logoUrl: string;
  description: string;
  isAvailable: boolean;
}

export const AI_MODELS: AIModel[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    colorVariable: '--color-chatgpt',
    logoUrl: 'assets/chatgpt-logo.svg',
    description: 'Developed by OpenAI, known for creative and detailed responses.',
    isAvailable: true
  },
  {
    id: 'gemini',
    name: 'Gemini',
    colorVariable: '--color-gemini',
    logoUrl: 'assets/gemini-logo.svg',
    description: 'Google\'s multimodal AI with strong reasoning abilities.',
    isAvailable: true
  },
  {
    id: 'claude',
    name: 'Claude',
    colorVariable: '--color-claude',
    logoUrl: 'assets/claude-logo.svg',
    description: 'Anthropic\'s AI assistant focused on helpfulness and safety.',
    isAvailable: true
  },
  {
    id: 'other',
    name: 'Custom AI',
    colorVariable: '--color-other',
    logoUrl: 'assets/custom-logo.svg',
    description: 'Configure your own AI model settings.',
    isAvailable: true
  }
];