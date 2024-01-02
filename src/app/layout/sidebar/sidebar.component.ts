import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  inject,
  effect,
} from '@angular/core';
import {
  IDashboardProps,
  IDashboardSidebarMenuProps,
  IMenuItemProps
} from "@interfaces/index";
import { StrapiService } from '@api/index';
import { mapApiSideBarMenu, DASHBOARD_SIDEMENU_FILTER } from "@utils/index";
import { lastValueFrom, map } from "rxjs";

import { PrimengModule } from '@modules/index';

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [CommonModule, PrimengModule],
  templateUrl: "./sidebar.component.html",
})
export class SideBarComponent {
  private strapi = inject(StrapiService);
  public el = inject(ElementRef);
  public dashboardMenus: IDashboardSidebarMenuProps[] = [];
  public menuItemsList: IMenuItemProps[] = [];

  ngOnInit() {
    (async() => {
      const dashboardContentData = await lastValueFrom(
        this.strapi.getDashboardContentData().pipe(
          map((result: IDashboardProps) =>
            DASHBOARD_SIDEMENU_FILTER(result)
          )
        )
      );
  
      this.menuItemsList = mapApiSideBarMenu(dashboardContentData, this.menuItemsList);
    })();
  }
}
