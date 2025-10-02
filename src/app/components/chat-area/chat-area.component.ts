import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { AIService } from '../../services/ai.service';
import { Message } from '../../models/message.model';
import { Conversation } from '../../models/conversation.model';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.scss'],
  standalone: true,
  imports: [CommonModule,FormsModule,HeaderComponent],
})
export class ChatAreaComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  currentConversation: Conversation | null = null;
  isLoading: boolean = false;
  messageText: string = '';
  private subscriptions: Subscription = new Subscription();
  private shouldScrollToBottom: boolean = true;
  constructor(
    private chatService: ChatService,
    private aiService: AIService,
    private sanitizer: DomSanitizer
  ) {}
  
  ngOnInit(): void {
    // Subscribe to current conversation updates
    this.subscriptions.add(
      this.chatService.currentConversation$.subscribe(conversation => {
        this.currentConversation = conversation;
        console.log(this.currentConversation);
        
        this.shouldScrollToBottom = true;
      })
    );
    
    // Subscribe to loading state
    this.subscriptions.add(
      this.chatService.loading$.subscribe(isLoading => {
        this.isLoading = isLoading;
        this.shouldScrollToBottom = true;
      })
    );
  }

  renderMarkdown(content: string): SafeHtml {
    let html :any= marked(content);
  
    // Add download button after each <img> tag
    html = html.replace(/<img src="([^"]+)" alt="([^"]*)"\s*\/?>/g, (_match: string, src: string, alt: string) => {
      const downloadButton = `<button class="custom-download-btn" data-src="${src}" style="display:inline-block;margin:10px 0;border:1px solid #000;padding:5px 10px;border-radius:5px;background:#fff;cursor:pointer;">Download Image</button>`;
      return `<div class="markdown-image"><img src="${src}" alt="${alt}" /><br/>${downloadButton}</div>`;
    });
  
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  handleDownloadClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('custom-download-btn')) {
      const url = target.getAttribute('data-src');
      const filename = url?.split('/').pop()?.split('?')[0] || 'image.png';
      if (url) {
        this.downloadImage(url);
      }
    }
  }

  downloadImage(url: string, filename: string = 'dabur_gpt_image.png') {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(blobUrl);
      })
      .catch(err => {
        console.error('Image download failed:', err);
      });
  }
  
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  
  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }
  
  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const container = this.messagesContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    }
  }
  
  getFormattedTime(timestamp: Date): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
  
  getAIName(message: Message): string {
    if (!message.aiModel) return this.getSelectedAIName();
    
    const aiModel = this.aiService.getAIModels().find(model => model.id === message.aiModel);
    return aiModel ? aiModel.name : 'AI';
  }
  
  getAIInitial(message: Message): string {
    if (!message.aiModel) return this.getSelectedAIInitial();
    
    const aiModel = this.aiService.getAIModels().find(model => model.id === message.aiModel);
    return aiModel ? aiModel.name.charAt(0) : 'A';
  }
  
  getSelectedAIName(): string {
    return this.aiService.getSelectedModel().name;
  }
  
  getSelectedAIInitial(): string {
    return this.aiService.getSelectedModel().name.charAt(0);
  }

  get canSendMessage(): boolean {
    return this.messageText.trim().length > 0;
  }
  
  sendMessage(): void {
    if (!this.canSendMessage || this.isLoading) return;
    
    const message = this.messageText.trim();
    this.messageText = '';
    
    this.chatService.sendMessage(message);
  }
  
  handleEnterKey(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter' && !keyboardEvent.shiftKey) {
      keyboardEvent.preventDefault();
      this.sendMessage();
    }
  }
}