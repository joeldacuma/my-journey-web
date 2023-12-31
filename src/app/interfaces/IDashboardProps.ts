declare interface IDashboardProps {
  data: {
    id: number;
    disabled: boolean;
    attributes: {
      Sidebar: Array<IDashboardSidebarMenuProps>;
    }
  }
};

declare interface IDashboardSidebarMenuProps {
  id: number;
  title: string;
  disabled: boolean;
  menu: {
    data: [
      IDashboardMenuProps
    ]
  };
};

declare interface IDashboardMenuProps {
      id: number;
      attributes: {
        iconName: string;
        title: string;
        url: string;
        disabled: boolean;
        submenus: Array<IDashboardSubMenuProps>;
      }
};

declare interface IDashboardSubMenuProps {
  id: number;
  title: string;
  url: string;
  disabled: boolean;
  iconName: string;
};

export {
  IDashboardProps,
  IDashboardSidebarMenuProps,
  IDashboardMenuProps,
  IDashboardSubMenuProps,
};