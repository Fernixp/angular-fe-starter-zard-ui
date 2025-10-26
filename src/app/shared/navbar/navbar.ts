import { Component } from '@angular/core';
import { ZardButtonComponent } from '../components/button/button.component';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ZardButtonComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {}
