import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  inject,
  computed,
  signal,
  effect,
} from "@angular/core";
import {
  IDashboardProps,
  IDashboardMenuProps,
  IDashboardSidebarMenuProps,
} from "@interfaces/index";
import { StrapiService } from "@api/index";
import { lastValueFrom, map } from "rxjs";

import { PanelMenuModule } from 'primeng/panelmenu';
import { PanelModule } from 'primeng/panel';
import { MenuModule } from 'primeng/menu';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [CommonModule, PanelMenuModule, PanelModule, MenuModule],
  templateUrl: "./sidebar.component.html",
})
export class SideBarComponent {
  private strapi = inject(StrapiService);
  public el = inject(ElementRef);
  public dashboardMenus: IDashboardSidebarMenuProps[] = [
    {
      id: 0,
      title: "",
      disabled: false,
      menu: {
        data: {
          id: 0,
          attributes: {
            iconName: "",
            title: "",
            url: "",
            disabled: false,
            submenus: [],
          },
        },
      },
    }
  ];
  public dashboardMenusData = signal<IDashboardSidebarMenuProps[]>([]);
  public items:any = [];

  ngOnInit() {
    this.items = [{
      label: 'Agenda',
      items: [
        {
            label: 'Events',
            icon: 'pi pi-fw pi-calendar'
        },
        {
            label: 'Members',
            icon: 'pi pi-fw pi-users'
        },
        {
            label: 'Categories',
            icon: 'pi pi-fw pi-list'
        },
        {
            label: 'Locations',
            icon: 'pi pi-fw pi-map-marker'
        }
      ]
    }];
  }

  constructor() {
    effect(async () => {
      const dashboardContentData = await lastValueFrom(
        this.strapi.getDashboardContentData().pipe(
          map((result: IDashboardProps) =>
            result.data.attributes.Sidebar.filter((item: IDashboardSidebarMenuProps) => {
              return (item.disabled === false) && item;
            }))
          )
        )
      console.log(dashboardContentData);
      this.dashboardMenusData.set(dashboardContentData);
    });
  }
}
