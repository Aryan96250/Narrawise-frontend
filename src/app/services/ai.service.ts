import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AIModel, AI_MODELS } from '../models/ai-model.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AIService {
  private selectedModel: AIModel = AI_MODELS[0];
  public sidebarOpenSubject = new BehaviorSubject<boolean>(false);
  public sidebarOpen$ = this.sidebarOpenSubject.asObservable();
  constructor(private http: HttpClient) { }

  getAIModels(): AIModel[] {
    return AI_MODELS;
  }
  
  getSelectedModel(): AIModel {
    return this.selectedModel;
  }
  
  setSelectedModel(modelId: string): void {
    const model = AI_MODELS.find(m => m.id === modelId);
    if (model) {
      this.selectedModel = model;
      document.documentElement.style.setProperty('--color-primary', `var(${model.colorVariable})`);
    }
  }

  postChat(data:any) :Observable <any>{
    let baseUrl = `http://172.171.242.84:5000/chat/`
    return this.http.post(baseUrl, data);
  }

  // getStreamChat(text:any, chatId?:any, user_id?:any, firstMessage?:boolean, type?:any,deviceId?:any,agentId?:any,style?:any,image?:any): Observable <any> {
  //   let body:any = { user_message: text, user_id:user_id,deviceId:deviceId,agentId:agentId,style:style == 'No Styles' ? null : style,image:image,title:""};
  //   if(type) body.type = type; 
  //   firstMessage ? body.title = '' :'';
  //   const req = new HttpRequest('POST', `http://192.168.1.21:8000/chat`, body, {
  //   reportProgress: true,
  //   responseType: 'text'
  //   });
    
  //   return this.http.request(req);
  //   }
  
  // Mock response generation based on selected AI model
  generateResponse(prompt: string): Observable<string> {
    const responses: { [key: string]: string[] } = {
      'chatgpt': [
        "I'd be happy to help with that. Here's what you need to know...",
        "That's an interesting question. Let me explain...",
        "Based on my knowledge, the answer is..."
      ],
      'gemini': [
        "Great question! From my analysis, I can tell you that...",
        "Looking at this from multiple perspectives, I think...",
        "I've examined this in detail, and here's what I found..."
      ],
      'claude': [
        "I appreciate you asking about this. From my understanding...",
        "Let me think through this carefully...",
        "Thank you for your question. Here's my response..."
      ],
      'other': [
        "Processing your request. Here's what I've found...",
        "Analyzing the information available to me...",
        "Based on my current configuration, I believe..."
      ]
    };
    
    // Get random response for the selected model
    const modelResponses = responses[this.selectedModel.id] || responses['chatgpt'];
    const randomIndex = Math.floor(Math.random() * modelResponses.length);
    const baseResponse = modelResponses[randomIndex];
    
    // Add some contextual information based on the prompt
    let fullResponse = baseResponse;
    if (prompt.toLowerCase().includes('hello') || prompt.toLowerCase().includes('hi')) {
      fullResponse += " It's nice to chat with you today. How can I assist you further?";
    } else if (prompt.toLowerCase().includes('?')) {
      fullResponse += " Does that answer your question? Feel free to ask for clarification if needed.";
    } else {
      fullResponse += " Is there anything specific you'd like me to elaborate on?";
    }
    
    // Simulate network delay (1-2 seconds)
    const responseDelay = 1000 + Math.random() * 1000;
    return of(fullResponse).pipe(delay(responseDelay));
  }
}