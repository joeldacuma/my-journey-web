import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutService } from '@services/index';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.component.html'
})
export class TopBarComponent {
  public layoutService = inject(LayoutService);
  @ViewChild('menubutton') menuButton!: ElementRef;
}
