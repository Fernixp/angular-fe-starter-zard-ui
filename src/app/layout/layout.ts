import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ZardIcon } from '../shared/components/icon/icons';
import { ZardSkeletonComponent } from '../shared/components/skeleton/skeleton.component';
import { ZardBreadcrumbModule } from '../shared/components/breadcrumb/breadcrumb.module';
import { ZardDividerComponent } from '../shared/components/divider/divider.component';
import { ZardButtonComponent } from '../shared/components/button/button.component';
import { ZardAvatarComponent } from '../shared/components/avatar/avatar.component';
import { ZardIconComponent } from '../shared/components/icon/icon.component';
import { ZardTooltipModule } from '../shared/components/tooltip/tooltip';
import { ZardMenuModule } from '../shared/components/menu/menu.module';
import { LayoutModule } from '../shared/components/layout/layout.module';

interface MenuItem {
  icon: ZardIcon;
  label: string;
  submenu?: { label: string }[];
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    LayoutModule,
    ZardButtonComponent,
    ZardBreadcrumbModule,
    ZardMenuModule,
    ZardSkeletonComponent,
    ZardTooltipModule,
    ZardDividerComponent,
    ZardAvatarComponent,
    ZardIconComponent,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  readonly year = new Date().getFullYear();
  sidebarCollapsed = signal(false);

  mainMenuItems: MenuItem[] = [
    { icon: 'house', label: 'Home' },
    { icon: 'inbox', label: 'Inbox' },
  ];

  workspaceMenuItems: MenuItem[] = [
    {
      icon: 'folder',
      label: 'Projects',
      submenu: [{ label: 'Design System' }, { label: 'Mobile App' }, { label: 'Website' }],
    },
    { icon: 'calendar', label: 'Calendar' },
    { icon: 'search', label: 'Search' },
  ];

  avatar = {
    fallback: 'ZA',
    url: '/avatars/avatar.jpg',
    alt: 'ZadUI',
  };

  toggleSidebar() {
    this.sidebarCollapsed.update((collapsed) => !collapsed);
  }

  onCollapsedChange(collapsed: boolean) {
    this.sidebarCollapsed.set(collapsed);
  }
}
