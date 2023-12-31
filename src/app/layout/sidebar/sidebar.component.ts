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
@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [CommonModule],
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

  ngOnInit() {}

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
      this.dashboardMenusData.set(dashboardContentData);
    });
  }
}
