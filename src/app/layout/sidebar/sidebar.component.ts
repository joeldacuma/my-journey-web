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

import { PanelMenuModule } from 'primeng/panelmenu';
import { PanelModule } from 'primeng/panel';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [CommonModule, PanelMenuModule, PanelModule, MenuModule],
  templateUrl: "./sidebar.component.html",
})
export class SideBarComponent {
  private strapi = inject(StrapiService);
  public el = inject(ElementRef);
  public dashboardMenus: IDashboardSidebarMenuProps[] = [];
  public menuItemsList: IMenuItemProps[] = [];

  ngOnInit() {}

  constructor() {
    effect(async () => {
      const dashboardContentData = await lastValueFrom(
        this.strapi.getDashboardContentData().pipe(
          map((result: IDashboardProps) =>
            DASHBOARD_SIDEMENU_FILTER(result)
          )
        )
      );

      this.menuItemsList = mapApiSideBarMenu(dashboardContentData, this.menuItemsList);
    });
  }
}
