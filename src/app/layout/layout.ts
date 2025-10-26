import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import {
  SidebarComponent,
  SidebarGroupComponent,
  SidebarGroupLabelComponent,
} from '../shared/components/layout/sidebar.component';
import { ZardSkeletonComponent } from '../shared/components/skeleton/skeleton.component';
import { ZardButtonComponent } from '../shared/components/button/button.component';
import { ZardIconComponent } from '../shared/components/icon/icon.component';
import { ContentComponent } from '../shared/components/layout/content.component';
import { LayoutComponent } from '../shared/components/layout/layout.component';
import { HeaderComponent } from '../shared/components/layout/header.component';
import { FooterComponent } from '../shared/components/layout/footer.component';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    LayoutComponent,
    HeaderComponent,
    ContentComponent,
    FooterComponent,
    SidebarComponent,
    SidebarGroupComponent,
    SidebarGroupLabelComponent,
    ZardButtonComponent,
    ZardSkeletonComponent,
    ZardIconComponent,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  readonly year = new Date().getFullYear();
}
