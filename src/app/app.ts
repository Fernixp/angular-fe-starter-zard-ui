import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ZardToastComponent } from '@shared/components/toast/toast.component';
import { DarkModeService } from './services/darkmode.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ZardToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly darkmodeService = inject(DarkModeService);
 
  ngOnInit(): void {
    this.darkmodeService.initTheme();
  }
}
