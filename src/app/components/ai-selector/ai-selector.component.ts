// ai-selector.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chat.service';

interface AIModel {
  id: string;
  name: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-ai-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ai-selector">
      <p style="font-size: 11px;">⚙️ AI Selector Loaded</p>
      <div class="ai-models-list">
        <div *ngFor="let model of aiModels" class="ai-model-button">
          <input
            type="checkbox"
            [checked]="isActiveModel(model.id)"
            (change)="toggleModel(model.id)"
            [disabled]="!isActiveModel(model.id) && selectedModelIds.length >= 4"
          />
          <!-- bind to model.image, not modal.image -->
          <img
            class="ai-model-icon-img"
            [src]="model.image"
            [alt]="model.name"
          />
          <div class="ai-model-info">
            <div class="ai-model-name" style="font-size: 12px;">
              {{ model.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./ai-selector.component.scss'],
})
export class AISelectorComponent implements OnInit {
  aiModels: AIModel[] = [
    {
      id: 'chatgpt',
      name: 'ChatGPT',
      description: 'OpenAI’s conversational agent',
      image: '/assets/chatgpt-logo.svg'
    },
    {
      id: 'gemini',
      name: 'Gemini',
      description: 'Google’s next-gen LLM',
      image: '/assets/gemini-logo.svg'
    },
    {
      id: 'grok',
      name: 'Grok',
      description: 'Anthropic’s assistant',
      image: '/assets/grok-logo.svg'
    },
    {
      id: 'copilot',
      name: 'Copilot',
      description: 'GitHub’s AI coding helper',
      image: '/assets/ai/copilot-logo.svg'
    },
    {
      id: 'meta',
      name: 'Meta',
      description: 'Meta AI insights',
      image: '/assets/meta-logo.svg'
    },
    {
      id: 'llama',
      name: 'LLaMA',
      description: 'Meta’s lightweight model',
      image: '/assets/llama-logo.svg'
    },
    {
      id: 'claude',
      name: 'Claude',
      description: 'Anthropic’s Claude',
      image: '/assets/claude-logo.svg'
    },
  ];

  selectedModelIds: string[] = [];
  isDarkMode = false;
  constructor(private chatService: ChatService) {
    console.log('🛠️ AISelectorComponent ctor');
  }

  ngOnInit(): void {
    this.chatService.currentConversation$.subscribe(conv => {
      if ((conv as any)?.aiModel) {
        this.selectedModelIds = [(conv as any).aiModel];
      } else if ((conv as any)?.aiModelIds) {
        this.selectedModelIds = [...(conv as any).aiModelIds];
      }
    });
  }

  toggleModel(modelId: string): void {
    const idx = this.selectedModelIds.indexOf(modelId);
    if (idx === -1) {
      if (this.selectedModelIds.length >= 4) {
        alert('You can only select up to 4 models');
        return;
      }
      this.selectedModelIds.push(modelId);
    } else {
      this.selectedModelIds.splice(idx, 1);
    }

    const conv = this.chatService.getCurrentConversation();
    if (conv && conv.messages.length > 0) {
      this.chatService.createNewConversation();
    }
    console.log('Selected models:', this.selectedModelIds);
  }

  isActiveModel(modelId: string): boolean {
    return this.selectedModelIds.includes(modelId);
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }
}
