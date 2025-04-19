import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

  isDarkMode() {
    return this.darkMode;
  }

  setTheme(isDark: boolean) {
    const html = document.documentElement;
    isDark ? html.classList.add('dark') : html.classList.remove('dark');
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    this.setTheme(this.darkMode);
  }

  constructor() {
    this.setTheme(this.darkMode);
  }
}
