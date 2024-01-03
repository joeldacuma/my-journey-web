import { Component, Renderer2, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

import { TopBarComponent } from '@layout/topbar/topbar.component';
import { SideBarComponent } from '@layout/sidebar/sidebar.component';
import { FooterComponent } from '@layout/footer/footer.component';

import { LayoutService } from '@services/index';

@Component({
  selector: "app-layout",
  standalone: true,
  imports: [CommonModule, 
            RouterOutlet, 
            TopBarComponent, 
            SideBarComponent,
            FooterComponent,
           ],
  templateUrl: "./layout.component.html",
})
export class LayoutComponent {
  private layoutService = inject(LayoutService);
  private renderer = inject(Renderer2);
  public subscription: Subscription | undefined;
  private menuOutsideClickListener: Function | undefined;

  @ViewChild(TopBarComponent) appTopbar!: TopBarComponent;
  @ViewChild(SideBarComponent) appSidebar!: SideBarComponent;

  get containerClass() {
    return {
      "layout-static": true,
      "layout-static-inactive":
        this.layoutService.state.staticMenuDesktopInactive,
      "layout-mobile-active": this.layoutService.state.staticMenuMobileActive,
      "p-input-filled": "filled",
      "p-ripple-disabled": false,
    };
  }

  constructor() {
    this.subscription = this.layoutService.overlayOpen$.subscribe((open) => {
      if (open) {
        this.menuOutsideClickListener = this.renderer.listen(
          "document",
          "click",
          (event) => {
            const isOutsideClicked = !(
              this.appSidebar.el.nativeElement.isSameNode(event.target) ||
              this.appSidebar.el.nativeElement.contains(event.target) ||
              this.appTopbar.menuButton.nativeElement.isSameNode(
                event.target
              ) ||
              this.appTopbar.menuButton.nativeElement.contains(event.target)
            );

            if (isOutsideClicked) {
             this.hideMenu(); 
            }
          }
        );
      }
    });
  }

  hideMenu() {
    this.layoutService.state.overlayMenuActive = false;
    this.layoutService.state.staticMenuMobileActive = false;
    this.layoutService.state.menuHoverActive = false;

    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
    }
  }
}
