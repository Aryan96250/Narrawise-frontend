export interface Message {
  id: string;
  content: any;
  isUser: boolean;
  timestamp: Date;
  aiModel?: string;
  web_search?:any;
  output?:any;
}