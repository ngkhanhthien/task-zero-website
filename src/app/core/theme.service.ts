import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

export type ThemeMode = 'system' | 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);
  
  // Safe initialization using Angular 21 Signal patterns
  theme = signal<ThemeMode>(this.loadFromStorage());

  constructor() {
    // Automatic reactive effect to apply classes when theme changes
    effect(() => {
      const mode = this.theme();
      
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('theme', mode);
      }

      this.applyThemeClass(mode);
    });
  }

  setTheme(mode: ThemeMode): void {
    this.theme.set(mode);
  }

  private applyThemeClass(mode: ThemeMode): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const html = this.document.documentElement;

    // Remove forced modes to allow CSS @media native fallback when 'system'
    html.classList.remove('dark', 'light');

    if (mode === 'dark') {
      html.classList.add('dark');
    } else if (mode === 'light') {
      html.classList.add('light');
    }
  }

  private loadFromStorage(): ThemeMode {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') {
        return stored as ThemeMode;
      }
    }
    return 'system';
  }
}
