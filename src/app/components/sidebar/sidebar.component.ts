import { Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme/theme.service';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [NgIf, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  themeService = inject(ThemeService);
  isOpen: boolean = false;

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  get isDark() {
    return this.themeService.isDarkMode();
  }

  toggleSideBar() {
    this.isOpen = !this.isOpen;
  }

}
