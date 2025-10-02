import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkTheme = false;
  private darkThemeSubject = new BehaviorSubject<boolean>(this.isDarkTheme);
  
  darkTheme$ = this.darkThemeSubject.asObservable();

  constructor() {
    // Check for user's preferred color scheme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (savedTheme === null && prefersDark)) {
      this.setDarkTheme(true);
    }
  }
  
  toggleTheme(): void {
    this.setDarkTheme(!this.isDarkTheme);
  }
  
  setDarkTheme(isDark: boolean): void {
    this.isDarkTheme = isDark;
    this.darkThemeSubject.next(isDark);
    
    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    
    // Save preference
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
  
  isDarkMode(): boolean {
    return this.isDarkTheme;
  }
}