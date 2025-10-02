import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { Conversation } from '../../models/conversation.model';
import { AIService } from '../../services/ai.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  conversations: Conversation[] = [];
  currentConversationId: string | null = null;
  private subscriptions: Subscription = new Subscription();

  constructor(private chatService: ChatService,private aiservice: AIService) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.chatService.conversations$.subscribe(conversations => {
        this.conversations = conversations;
      })
    );

    this.subscriptions.add(
      this.chatService.currentConversation$.subscribe(conversation => {
        this.currentConversationId = conversation?.id || null;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  selectConversation(conversationId: string): void {
    this.chatService.switchConversation(conversationId);

    if (window.innerWidth <= 768) {
      document.body.classList.remove('sidebar-open');
    }
  }

  deleteConversation(conversationId: string, event: Event): void {
    event.stopPropagation();
    this.chatService.deleteConversation(conversationId);
  }

  isActiveConversation(conversationId: string): boolean {
    return this.currentConversationId === conversationId;
  }

  getFormattedDate(date: Date): string {
    const now = new Date();
    const messageDate = new Date(date);

    const isToday = messageDate.toDateString() === now.toDateString();
    const isThisYear = messageDate.getFullYear() === now.getFullYear();

    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric' };
    const dateOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const fullOptions: Intl.DateTimeFormatOptions = { ...dateOptions, year: 'numeric' };

    if (isToday) {
      return `Today, ${messageDate.toLocaleTimeString(undefined, timeOptions)}`;
    } else if (isThisYear) {
      return messageDate.toLocaleDateString(undefined, dateOptions);
    } else {
      return messageDate.toLocaleDateString(undefined, fullOptions);
    }
  }

  toggleSidebar(): void {
    const sidebarEl = document.querySelector('app-sidebar');
    if (sidebarEl) {
      sidebarEl.classList.toggle('open');
      const isSidebarOpen = sidebarEl?.classList.contains('open');
      this.aiservice.sidebarOpenSubject.next(isSidebarOpen)
    }
  }

  startNewChat(): void {
    this.chatService.createNewConversation();
  }
}