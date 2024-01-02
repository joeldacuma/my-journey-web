import { Injectable, signal, effect } from '@angular/core';
import { Subject } from 'rxjs';

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
    profileSidebarVisible: false
  };

  private overlayOpen = new Subject<boolean>();
  public overlayOpen$ = this.overlayOpen.asObservable();

  onMenuToggle() {
    this.state.overlayMenuActive = !this.state.overlayMenuActive;
    if (this.state.overlayMenuActive) {
      this.overlayOpen.next(this.state.overlayMenuActive);
    }

    if (this.isDesktop()) {
      this.state.staticMenuDesktopInactive = !this.state.staticMenuDesktopInactive;
    } else {
      this.state.staticMenuMobileActive = !this.state.staticMenuMobileActive;
      if (this.state.staticMenuMobileActive) {
        this.overlayOpen.next(this.state.overlayMenuActive);
      }
    }
  }

  showProfileSidebar() {
    this.state.profileSidebarVisible = !this.state.profileSidebarVisible;
    console.log(this.state.profileSidebarVisible);
    if (this.state.profileSidebarVisible) {
      //this.overlayOpen.next(this.state.overlayMenuActive);
    }
  };

  isDesktop() {
    return window.innerWidth > TABLET_SIZE_WIDTH;
  }

  isMobile() {
    return !this.isDesktop();
  }

  constructor() { 
    // effect(() => this.overlayOpen());
  }
}
