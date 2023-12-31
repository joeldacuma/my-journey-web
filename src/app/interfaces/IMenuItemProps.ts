export interface IMenuItemProps {
  label: string;
  icon?: string;
  routerLink?: string;
  items: IMenuItemProps[];
};