import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { Subscription } from 'rxjs';
import { DispatcherService, LocalstorageService } from '@services/index';
import { PrimengModule } from '@modules/index';
import {
  ERROR_EXPIRED_SESSION_DETAILS,
  ERROR_EXPIRED_SESSION_TITLE
} from '@constants/index';

import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, 
            RouterOutlet,
            PrimengModule
          ],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  subscription: any = Subscription;
  public primengConfig = inject(PrimeNGConfig);
  private dispatcherService = inject(DispatcherService);
  private localStorageService = inject(LocalstorageService);
  private messageService = inject(MessageService);

  ngOnInit() {
    this.primengConfig.ripple = true;

    this.subscription = this.dispatcherService.on('expired', () => {
      this.messageService.add({
        severity:'error', 
        summary: ERROR_EXPIRED_SESSION_TITLE, 
        detail: ERROR_EXPIRED_SESSION_DETAILS
      });
      this.logout();
    });
  }

  logout() {
    this.localStorageService.clear();
    window.location.reload();
  }
}
