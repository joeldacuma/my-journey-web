import { IDashboardSidebarMenuProps } from '@interfaces/index';

export const DASHBOARD_SIDEMENU_FILTER = (result: any) => {
  return result['data']['attributes']['Sidebar'].filter((item: IDashboardSidebarMenuProps) => {
    return (item.disabled === false) && item;
  });
};
