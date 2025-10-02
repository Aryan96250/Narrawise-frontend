import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from '../models/message.model';
import { Conversation } from '../models/conversation.model';
import { AIService } from './ai.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private conversations: Conversation[] = [];
  private currentConversationId: string | null = null;
  
  private conversationsSubject = new BehaviorSubject<Conversation[]>([]);
  private currentConversationSubject = new BehaviorSubject<Conversation | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  
  conversations$ = this.conversationsSubject.asObservable();
  currentConversation$ = this.currentConversationSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor(private aiService: AIService) {
    // Initialize with a new conversation
    this.createNewConversation();
  }
  
  getCurrentConversation(): Conversation | null {
    return this.currentConversationSubject.value;
  }
  
  createNewConversation(): Conversation {
    const existingEmptyConversation = this.conversations.find(c => c.messages.length === 0);
  
    if (existingEmptyConversation) {
      this.currentConversationId = existingEmptyConversation.id;
      this.currentConversationSubject.next(existingEmptyConversation);
      return existingEmptyConversation;
    }
  
    const newId = this.generateId();
    const selectedModel = this.aiService.getSelectedModel();
  
    const newConversation: Conversation = {
      id: newId,
      title: 'New conversation',
      messages: [],
      aiModel: selectedModel.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  
    this.conversations = [newConversation, ...this.conversations];
    this.currentConversationId = newId;
  
    this.conversationsSubject.next(this.conversations);
    this.currentConversationSubject.next(newConversation);
  
    return newConversation;
  }
  
  
  
  switchConversation(conversationId: string): void {
    const conversation = this.conversations.find(c => c.id === conversationId);
    if (conversation) {
      this.currentConversationId = conversationId;
      this.currentConversationSubject.next(conversation);
      
      // Also set the AI model associated with this conversation
      this.aiService.setSelectedModel(conversation.aiModel);
    }
  }
  
  deleteConversation(conversationId: string): void {
    this.conversations = this.conversations.filter(c => c.id !== conversationId);
    this.conversationsSubject.next(this.conversations);
    
    // If we deleted the current conversation, switch to the first available one or create a new one
    if (this.currentConversationId === conversationId) {
      if (this.conversations.length > 0) {
        this.switchConversation(this.conversations[0].id);
      } else {
        this.createNewConversation();
      }
    }
  }
  
  async sendMessage(content: string): Promise<void> {
    console.log(content);
    
    if (!content.trim() || !this.currentConversationId) return;
    
    const currentConversation = this.getCurrentConversation();
    if (!currentConversation) return;
    
    const selectedModel = this.aiService.getSelectedModel();
    
    // Create user message
    const userMessage: Message = {
      id: this.generateId(),
      content: content,
      isUser: true,
      timestamp: new Date()
    };
    
    // Add user message to conversation
    this.addMessageToConversation(userMessage);
    
    // Update conversation title if it's the first message
    if (currentConversation.messages.length === 1) {
      this.updateConversationTitle(currentConversation.id, content);
    }
    
    // Set loading state
    this.loadingSubject.next(true);
    
    // Generate AI response
    let payload = {
      "input" : content
    }
    this.aiService.postChat(payload).subscribe(
      (response) => {
        console.log(response);
        let combinedContent = '';

        if (response.output) {
          combinedContent += `<b style="font-size: 10px;">Text Response - ${response.output.model}</b><br>${response.output.output}<br><br>`;
        }

        if (response.content) {
          combinedContent += `<b style="font-size: 10px;">Text Response - ${response.content.model}</b><br>${response.content.output}<br><br>`;
        }
    
        if (response.web_search) {
          combinedContent += `<b style="font-size: 10px;">Web Search - ${response.web_search.model}</b><br>${response.web_search.output}<br><br>`;
        }
    
        if (response.image?.output) {
          combinedContent += `<b style="font-size: 10px;">Image - ${response.image.model}</b><br><img src="data:image/png;base64,${response.image.output}" alt="AI generated image"/><br><br>`;
        }
        // Create AI message
        const aiMessage: Message = {
          id: this.generateId(),
          content: combinedContent,
          isUser: false,
          timestamp: new Date(),
          aiModel: selectedModel.id
        };
        
        // Add AI message to conversation
        this.addMessageToConversation(aiMessage);
        this.loadingSubject.next(false);
      },
      (error) => {
        console.error('Error generating AI response:', error);
        
        // Create error message
        const errorMessage: Message = {
          id: this.generateId(),
          content: 'Sorry, I encountered an error while processing your request. Please try again.',
          isUser: false,
          timestamp: new Date(),
          aiModel: selectedModel.id
        };
        
        // Add error message to conversation
        this.addMessageToConversation(errorMessage);
        this.loadingSubject.next(false);
      }
    );
  }
  
  private addMessageToConversation(message: Message): void {
    if (!this.currentConversationId) return;
    
    // Find and update the current conversation
    const updatedConversations = this.conversations.map(conversation => {
      if (conversation.id === this.currentConversationId) {
        return {
          ...conversation,
          messages: [...conversation.messages, message],
          updatedAt: new Date(),
          aiModel: this.aiService.getSelectedModel().id // Update the AI model
        };
      }
      return conversation;
    });
    
    this.conversations = updatedConversations;
    this.conversationsSubject.next(this.conversations);
    
    // Update the current conversation
    const currentConversation = this.conversations.find(c => c.id === this.currentConversationId);
    if (currentConversation) {
      this.currentConversationSubject.next(currentConversation);
    }
  }
  
  private updateConversationTitle(conversationId: string, content: string): void {
    // Create a title from the first message (limit to 30 characters)
    let title = content.substring(0, 30);
    if (content.length > 30) {
      title += '...';
    }
    
    // Update the conversation title
    const updatedConversations = this.conversations.map(conversation => {
      if (conversation.id === conversationId) {
        return { ...conversation, title };
      }
      return conversation;
    });
    
    this.conversations = updatedConversations;
    this.conversationsSubject.next(this.conversations);
    
    // Update the current conversation if needed
    if (this.currentConversationId === conversationId) {
      const currentConversation = this.conversations.find(c => c.id === conversationId);
      if (currentConversation) {
        this.currentConversationSubject.next(currentConversation);
      }
    }
  }
  
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
}