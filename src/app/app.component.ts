import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ChatAreaComponent } from './components/chat-area/chat-area.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    ChatAreaComponent,
    HttpClientModule,
  ],
  template: `
    <div class="app-container">
      <div class="main-content">
        <app-sidebar></app-sidebar>
        <app-chat-area></app-chat-area>
      </div>
    </div>
  `,
  styles: [`
    :host {
      /* fill the viewport */
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }

    .app-container {
      /* header / main-content / input stacked */
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
    }

    .main-content {
      /* sidebar + chat area side by side */
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    app-sidebar {
      overflow-y: auto;
    }

    app-chat-area {
      /* take up the rest of the space */
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }


  `]
})
export class App {
}