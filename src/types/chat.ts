
export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'agent';
  timestamp: Date;
}
