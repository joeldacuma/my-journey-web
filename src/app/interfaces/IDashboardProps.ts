export interface IDashboardProps {
  data: {
    id: number;
    disabled: boolean;
    attributes: {
      Sidebar: Array<IDashboardSidebarMenuProps>;
    }
  }
};

export interface IDashboardSidebarMenuProps {
  id: number;
  title: string;
  disabled: boolean;
  menu: {
    data: [
      IDashboardMenuProps
    ]
  };
};

export interface IDashboardMenuProps {
      id: number;
      attributes: {
        iconName: string;
        title: string;
        url: string;
        disabled: boolean;
        submenus: Array<IDashboardSubMenuProps>;
      }
};

export interface IDashboardSubMenuProps {
  id: number;
  title: string;
  url: string;
  disabled: boolean;
  iconName: string;
};
