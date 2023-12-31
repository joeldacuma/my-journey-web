import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';


import { ILayoutProps }  from '@interfaces/index';
import { TABLET_SIZE_WIDTH } from '@constants/index';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  public state:ILayoutProps = {
    overlayMenuActive: false,
    staticMenuDesktopInactive: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
  };

  private overlayOpen = signal<boolean>(false);
  public overlayOpen$ = toObservable(this.overlayOpen);

  onMenuToggle() {
    this.state.overlayMenuActive = !this.state.overlayMenuActive;
    if (this.state.overlayMenuActive) {
      this.overlayOpen.set(this.state.overlayMenuActive);
    }

    if (this.isDesktop()) {
      this.state.staticMenuDesktopInactive = !this.state.staticMenuDesktopInactive;
    } else {
      this.state.staticMenuMobileActive = !this.state.staticMenuMobileActive;
      if (this.state.staticMenuMobileActive) {
        this.overlayOpen.set(this.state.overlayMenuActive);
      }
    }
  }

  isDesktop() {
    return window.innerWidth > TABLET_SIZE_WIDTH;
  }

  isMobile() {
    return !this.isDesktop();
  }

  constructor() { }
}
