import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chat.service';
import { ThemeService } from '../../services/theme.service';
import { AIService } from '../../services/ai.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isDarkMode: boolean;
  isSidebarOpen: boolean = false;

  constructor(
    private chatService: ChatService,
    private themeService: ThemeService,
    private aiservice : AIService
  ) {
    this.isDarkMode = this.themeService.isDarkMode();
    this.themeService.darkTheme$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
    this.aiservice.sidebarOpen$.subscribe((isOpen) => {
      this.isSidebarOpen = isOpen;
    });
  }

  startNewChat(): void {
    this.chatService.createNewConversation();
  }

  toggleSidebar(): void {
    const sidebarEl = document.querySelector('app-sidebar');    
    if (sidebarEl) {
      sidebarEl.classList.toggle('open');
      const isSidebarOpen = sidebarEl?.classList.contains('open');
      this.aiservice.sidebarOpenSubject.next(isSidebarOpen)
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}