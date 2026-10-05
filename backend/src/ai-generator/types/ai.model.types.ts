export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIChoice {
  index: number;
  message: AIMessage;
  finish_reason: string;
}

export interface AIUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface AIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: AIChoice[];
  usage: AIUsage;
}
