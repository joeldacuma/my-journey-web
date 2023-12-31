import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { LayoutService, LocalstorageService } from '@services/index';
import { PrimengModule } from '@modules/index';

import { ROUTE_LOGIN } from '@constants/index';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    CommonModule,
    PrimengModule
  ],
  templateUrl: './topbar.component.html'
})
export class TopBarComponent {
  public layoutService = inject(LayoutService);
  private router = inject(Router);
  private localstorageService = inject(LocalstorageService);
  @ViewChild('menubutton') menuButton!: ElementRef;
  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  logout() {
    this.localstorageService.clear();
    this.router.navigate([ROUTE_LOGIN]);
  }
  
}
