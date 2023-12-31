import { IDashboardSidebarMenuProps, IMenuItemProps } from "@interfaces/index";

export const mapApiSideBarMenu = (source: any, result: any) => {
    source.forEach((item: any) => {
        result.push({
          label: item.title,
           items: mapMenus(item.menus.data)
        });
    });

    return result;
};

const mapMenus = (menus: any) => {
  return menus.map((item: any) => {
    return {
        label: item.attributes.title || item.title,
        icon: item.attributes.iconName,
        items: mapSubMenus(item.attributes.submenus)
    };
  });
};

const mapSubMenus = (submenus: any) => {
    return submenus.map((item: any) => {
        return {
            label: item.title,
            icon: item.iconName,
            routerLink: item.url,
        };
    });
};
