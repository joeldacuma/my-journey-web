import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { Subscription } from 'rxjs';
import { DispatcherService, LocalstorageService } from '@services/index'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, 
            RouterOutlet
          ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  subscription: any = Subscription;
  public primengConfig = inject(PrimeNGConfig);
  private dispatcherService = inject(DispatcherService);
  private localStorageService = inject(LocalstorageService);

  ngOnInit() {
    this.primengConfig.ripple = true;

    this.subscription = this.dispatcherService.on('logout', () => {
      this.logout();
    });
  }

  logout() {
    this.localStorageService.clear();
    window.location.reload();
  }
}
