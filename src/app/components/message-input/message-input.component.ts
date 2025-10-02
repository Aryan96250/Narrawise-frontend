import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.scss']
})
export class MessageInputComponent implements OnInit {
  messageText: string = '';
  isLoading: boolean = false;
  
  constructor(private chatService: ChatService) {}
  
  ngOnInit(): void {
    this.chatService.loading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
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