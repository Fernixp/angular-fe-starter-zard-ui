import { Component, signal, HostListener, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ZardIcon } from '../shared/components/icon/icons';
import { ZardBreadcrumbModule } from '../shared/components/breadcrumb/breadcrumb.module';
import { ZardDividerComponent } from '../shared/components/divider/divider.component';
import { ZardButtonComponent } from '../shared/components/button/button.component';
import { ZardAvatarComponent } from '../shared/components/avatar/avatar.component';
import { ZardIconComponent } from '../shared/components/icon/icon.component';
import { ZardTooltipModule } from '../shared/components/tooltip/tooltip';
import { ZardMenuModule } from '../shared/components/menu/menu.module';
import { LayoutModule } from '../shared/components/layout/layout.module';
import { DarkModeService } from '../services/darkmode.service';

interface MenuItem {
  icon: ZardIcon;
  label: string;
  route: string;
  submenu?: { label: string }[];
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    LayoutModule,
    ZardButtonComponent,
    ZardBreadcrumbModule,
    ZardMenuModule,
    ZardTooltipModule,
    ZardDividerComponent,
    ZardAvatarComponent,
    ZardIconComponent,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  private readonly darkmodeService = inject(DarkModeService);
  readonly year = new Date().getFullYear();
  sidebarCollapsed = signal(false);
  isMobile = signal(false);
  mobileMenuOpen = signal(false);
  
  mainMenuItems: MenuItem[] = [
    { icon: 'house', label: 'Dashboard', route: '/dashboard' },
    { icon: 'store', label: 'Productos', route: '/productos' },
    { icon: 'folder', label: 'Categorías', route: '/categorias' },
  ];
  
  workspaceMenuItems: MenuItem[] = [
    {
      icon: 'folder',
      label: 'Projects',
      route: '#',
      submenu: [{ label: 'Design System' }, { label: 'Mobile App' }, { label: 'Website' }],
    },
    { icon: 'calendar', label: 'Calendar', route: '#' },
    { icon: 'search', label: 'Search', route: '#' },
  ];
  
  avatar = {
    fallback: 'ZA',
    url: '/avatars/avatar.jpg',
    alt: 'ZadUI',
  };

  constructor() {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    const width = window.innerWidth;
    this.isMobile.set(width < 768);
    
    // En móvil, cerrar el sidebar automáticamente
    if (this.isMobile()) {
      this.mobileMenuOpen.set(false);
    }
  }
  
  toggleSidebar() {
    if (this.isMobile()) {
      this.mobileMenuOpen.update((open) => !open);
    } else {
      this.sidebarCollapsed.update((collapsed) => !collapsed);
    }
  }
  
  onCollapsedChange(collapsed: boolean) {
    this.sidebarCollapsed.set(collapsed);
  }

  closeMobileMenu() {
    if (this.isMobile()) {
      this.mobileMenuOpen.set(false);
    }
  }


  toggleTheme(): void {
    this.darkmodeService.toggleTheme();
  }
 
  getCurrentTheme(): 'light' | 'dark' {
    return this.darkmodeService.getCurrentTheme();
  }
}